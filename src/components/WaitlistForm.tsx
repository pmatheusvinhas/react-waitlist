import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { 
  Field, 
  WaitlistProps, 
  A11yConfig as CoreA11yConfig, 
  SecurityConfig, 
  AnalyticsConfig, 
  ResendMapping, 
  ThemeConfig as CoreThemeConfig,
  FrameworkConfig
} from '../core/types';
import { 
  validateForm, 
  isFormValid 
} from '../core/validation';
import { 
  generateHoneypotFieldName, 
  isLikelyBot, 
  getHoneypotStyles, 
  isReCaptchaEnabled 
} from '../core/security';
import { eventBus, WaitlistEventType } from '../core/events';
import { 
  mergeTheme, 
  defaultTheme,
  tailwindDefaultTheme,
  materialUIDefaultTheme
} from '../core/theme';
import { AnimationConfig, defaultAnimation, getAnimationStyles } from '../core/animations';
import { AriaProvider, useAria, useAnnounce, useAriaLabels, useReducedMotion } from '../a11y';
import { useResendAudience, ResendContact } from '../hooks/useResendAudience';
import { useReCaptcha } from '../hooks/useReCaptcha';
import { useWaitlistEvents } from '../hooks/useWaitlistEvents';
import { executeReCaptcha, loadReCaptchaScript } from '../core/recaptcha';
import { verifyReCaptchaToken } from '../core/recaptcha';

/**
 * Default fields for the waitlist form
 */
const defaultFields: Field[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    placeholder: 'your@email.com',
  },
];

/**
 * Form states
 */
type FormState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Extended field with additional properties
 */
interface ExtendedField extends Field {
  checkboxLabel?: string;
}

/**
 * Update SecurityConfig interface to include minSubmissionTime
 */
declare module '../core/types' {
  interface SecurityConfig {
    minSubmissionTime?: number;
  }
}

/**
 * Inner form component that uses accessibility context
 */
const WaitlistFormInner: React.FC<WaitlistProps> = ({
  apiKey,
  resendAudienceId,
  resendProxyEndpoint,
  webhookProxyEndpoint,
  recaptchaProxyEndpoint,
  title = 'Join our waitlist',
  description = 'Be the first to know when we launch',
  submitText = 'Join waitlist',
  successTitle = 'You\'re on the list!',
  successDescription = 'Thank you for joining our waitlist. We\'ll keep you updated.',
  fields = defaultFields,
  theme: userTheme,
  frameworkConfig,
  security = {
    enableHoneypot: true,
    checkSubmissionTime: true,
  },
  analytics,
  resendMapping,
  webhooks,
  onFieldFocus,
  onSubmit,
  onSuccess,
  onError,
  onSecurityEvent,
  className,
  style,
  a11y,
}) => {
  // Use the updated mergeTheme function that handles both types
  const theme = mergeTheme(userTheme);
  
  // Get accessibility hooks
  const announce = useAnnounce();
  const ariaLabels = useAriaLabels();
  const reducedMotion = useReducedMotion();
  
  // Initialize Resend audience hook - only if resendAudienceId is provided
  const resendAudience = resendAudienceId ? useResendAudience({
    apiKey,
    audienceId: resendAudienceId,
    proxyEndpoint: resendProxyEndpoint,
  }) : null;
  
  // Initialize reCAPTCHA hook if enabled
  const reCaptchaEnabled = isReCaptchaEnabled(security);
  const reCaptcha = reCaptchaEnabled
    ? useReCaptcha({
        siteKey: security.reCaptchaSiteKey!,
        onError: (error) => {
          console.error('reCAPTCHA error:', error);
        },
      })
    : null;
  
  // Form state
  const [formState, setFormState] = useState<FormState>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string | boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, { valid: boolean; message?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reference to store form values - used to prevent loss during re-renders
  const formValuesRef = useRef<Record<string, string | boolean>>({});
  
  // Honeypot field name (for bot detection)
  const honeypotFieldName = useRef(generateHoneypotFieldName());
  
  // Submission time tracking (for bot detection)
  const formLoadTime = useRef(Date.now());
  
  // Initialize event system
  const waitlistEvents = useWaitlistEvents();
  
  // Security-related state
  const [submissionStartTime, setSubmissionStartTime] = useState<number | null>(null);
  const [reCaptchaToken, setReCaptchaToken] = useState<string | null>(null);
  const [securityChecksInProgress, setSecurityChecksInProgress] = useState(false);
  
  // Add a new function to emit security events
  const emitSecurityEvent = (type: string, details: Record<string, any>) => {
    // Emit a custom event for security features
    waitlistEvents.emitSecurity(type, details);
    
    // Call onSecurityEvent callback if provided
    if (onSecurityEvent) {
      onSecurityEvent({
        timestamp: new Date().toISOString(),
        securityType: type,
        details
      });
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.info(`Security event [${type}]:`, details);
    }
  };
  
  // Initialize form values from default values
  useEffect(() => {
    // Only initialize if we haven't already
    if (Object.keys(formValuesRef.current).length === 0) {
    const initialValues: Record<string, string | boolean> = {};
      
    fields.forEach((field) => {
        if (field.type === 'checkbox') {
          initialValues[field.name] = field.defaultValue === true;
        } else if (field.defaultValue !== undefined) {
          initialValues[field.name] = field.defaultValue as string;
      } else {
        initialValues[field.name] = '';
      }
    });
      
      // Set both the ref and state to the same initial values
      formValuesRef.current = { ...initialValues };
      setFormValues({ ...initialValues });
    }
  }, [fields]);
  
  // Sync formValues with formValuesRef whenever formValues changes
  // This ensures our ref always has the latest values
  useEffect(() => {
    // Only update if formValues has content (prevents overwriting with empty object)
    if (Object.keys(formValues).length > 0) {
      formValuesRef.current = { ...formValues };
    }
  }, [formValues]);
  
  // Handle field focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    // Call onFieldFocus callback if provided
    if (onFieldFocus) {
      onFieldFocus({ field: name, timestamp: new Date().toISOString() });
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    // Update state using functional update to ensure we're working with the latest state
    setFormValues(prevValues => {
      const newValues = { ...prevValues, [name]: value };
      console.log('Updated form values:', newValues); // Debug log
      return newValues;
    });
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: { valid: true, message: '' },
      }));
    }
  };
  
  // Initialize reCAPTCHA if enabled
  useEffect(() => {
    if (isReCaptchaEnabled(security)) {
      const siteKey = security?.reCaptchaSiteKey || '';
      waitlistEvents.emitSecurity('recaptcha_init', { siteKey: siteKey.substring(0, 5) + '...' });
      
      loadReCaptchaScript(siteKey)
        .then(() => {
          waitlistEvents.emitSecurity('recaptcha_loaded', { success: true });
        })
        .catch((error) => {
          waitlistEvents.emitSecurity('recaptcha_loaded', { 
            success: false, 
            error: error.message || 'Failed to load reCAPTCHA' 
          });
        });
    }
  }, [security, waitlistEvents]);
  
  // Set submission start time when form is first interacted with
  useEffect(() => {
    if (security?.checkSubmissionTime && !submissionStartTime) {
      const handleFirstInteraction = () => {
        const startTime = Date.now();
        setSubmissionStartTime(startTime);
        waitlistEvents.emitSecurity('submission_time_start', { timestamp: startTime });
        
        // Remove event listeners after first interaction
        document.removeEventListener('mousedown', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
      
      document.addEventListener('mousedown', handleFirstInteraction);
      document.addEventListener('keydown', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);
      
      return () => {
        document.removeEventListener('mousedown', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, [security?.checkSubmissionTime, submissionStartTime, waitlistEvents]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    waitlistEvents.emitSubmit(formValues);
    
    try {
      // Run security checks
      const securityChecksPassed = await runSecurityChecks();
      if (!securityChecksPassed) {
        // If security checks failed, show an error instead of silently pretending success
        console.error('Form submission: Security checks failed');
        setFormState('error');
        setFormError('Security verification failed. Please try again.');
        
        // Emit error event for security check failure
        waitlistEvents.emitError(
          formValues, 
          new Error('Security verification failed')
        );
        
        // Call onError callback if provided
        if (onError) {
          onError({
        timestamp: new Date().toISOString(),
            formData: formValues,
            error: new Error('Security verification failed'),
          });
        }
        
        setIsSubmitting(false);
        return;
      }
      
      // Ensure we're using the latest values by combining state and ref
      const currentFormValues = { ...formValues };
      
      // Prepare submission data with the correct structure
      const submissionData = {
        timestamp: new Date().toISOString(),
        formData: currentFormValues,
        metadata: {
          source: window.location.href,
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
          reCaptchaToken: null as string | null,
        },
      };
      
      // Add reCAPTCHA token to submission if available
      if (reCaptchaToken) {
        submissionData.metadata.reCaptchaToken = reCaptchaToken;
      }
      
      // Call onSubmit with the correct data structure
      if (onSubmit) {
        onSubmit({
          timestamp: submissionData.timestamp,
          formData: submissionData.formData
        });
      }
      
      // Call onSuccess with the correct data structure
      if (onSuccess) {
        const result = await onSuccess({
          timestamp: submissionData.timestamp,
          formData: submissionData.formData,
          response: null
        });
        
        // If result is returned and success is true, show success message
        if (result && result.success) {
          setFormState('success');
          
          // Emit success event
          waitlistEvents.emitSuccess(submissionData.formData, result);
          
          // Announce success to screen readers
          if (announce) {
            announce('Form submitted successfully');
          }
          
          // Add to Resend audience if configured
          if (resendAudience && resendAudienceId) {
            try {
              const contact: ResendContact = {
                email: currentFormValues.email as string,
                firstName: currentFormValues.firstName as string,
                lastName: currentFormValues.lastName as string,
                unsubscribed: false,
              };
              
              // Add metadata if mapping is provided
              if (resendMapping?.metadata && Array.isArray(resendMapping.metadata)) {
                const metadata: Record<string, any> = {};
                
                resendMapping.metadata.forEach((field) => {
                  if (currentFormValues[field] !== undefined) {
                    metadata[field] = currentFormValues[field];
                  }
                });
                
                if (Object.keys(metadata).length > 0) {
                  contact.metadata = metadata;
                }
              }
              
              await resendAudience.addContact(contact);
            } catch (error) {
              console.error('Error adding contact to Resend audience:', error);
            }
          }
        } else {
          // Handle error from onSuccess callback
          setFormState('error');
          setFormError(result?.error || 'Something went wrong. Please try again.');
          
          // Emit error event
          waitlistEvents.emitError(submissionData.formData, new Error(result?.error || 'Unknown error'));
          
          // Announce error to screen readers
          if (announce) {
            announce('Form submission failed: ' + (result?.error || 'Unknown error'));
          }
        }
      }
    } catch (error) {
      // Handle unexpected errors
      setFormState('error');
      setFormError('Something went wrong. Please try again.');
      
      // Create a basic submission data object for error reporting
      const errorData = {
        timestamp: new Date().toISOString(),
        formData: formValues,
        error: error instanceof Error ? {
          message: error.message,
          code: (error as any).code
        } : {
          message: String(error),
        }
      };
      
      // Emit error event with the correct structure
      waitlistEvents.emitError(errorData.formData, error instanceof Error ? error : new Error(String(error)));
      
      // Call onError callback if provided
      if (onError) {
        onError({
          timestamp: errorData.timestamp,
          formData: errorData.formData,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
      
      // Announce error to screen readers
      if (announce) {
        announce('Form submission failed: ' + (error instanceof Error ? error.message : String(error)));
      }
      
      setIsSubmitting(false);
    }
  };
  
  // Get animation styles based on reduced motion preference
  const animations = getAnimationStyles(
    theme.animation as AnimationConfig || defaultAnimation,
    reducedMotion
  );
  
  // Render field based on type
  const renderField = (field: Field) => {
    const error = validationErrors[field.name]?.message;
    const isValid = validationErrors[field.name]?.valid !== false;
    
    switch (field.type) {
      case 'email':
      case 'text':
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formValues[field.name] as string}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder={field.placeholder}
            aria-invalid={!isValid}
            aria-describedby={!isValid ? `${field.name}-error` : undefined}
            style={{
              ...theme.components?.input,
              ...(error ? theme.components?.inputError : {}),
            }}
          />
        );
      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={formValues[field.name] as string}
            onChange={handleChange}
            onFocus={handleFocus}
            aria-invalid={!isValid}
            aria-describedby={!isValid ? `${field.name}-error` : undefined}
            style={{
              ...theme.components?.input,
              ...(error ? theme.components?.inputError : {}),
            }}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div style={theme.components?.checkboxContainer}>
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={formValues[field.name] as boolean}
              onChange={handleChange}
              onFocus={handleFocus}
              aria-invalid={!isValid}
              aria-describedby={!isValid ? `${field.name}-error` : undefined}
              style={theme.components?.checkbox}
            />
            <label
              htmlFor={field.name}
              style={theme.components?.checkboxLabel}
            >
              {field.label}
              {field.required && <span style={theme.components?.required}>*</span>}
            </label>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Check honeypot field
  const checkHoneypot = (): boolean => {
    if (!security?.enableHoneypot) return true;
    
    const honeypotValue = formValues[honeypotFieldName.current] as string || '';
    const isHoneypotEmpty = honeypotValue.trim() === '';
    
    // Emit security event for honeypot check
    emitSecurityEvent('honeypot', { 
      passed: isHoneypotEmpty,
      value: honeypotValue ? 'filled' : 'empty'
    });
    
    return isHoneypotEmpty;
  };
  
  // Check submission time
  const checkSubmissionTime = (): boolean => {
    if (!security?.checkSubmissionTime || !submissionStartTime) return true;
    
    const submissionEndTime = Date.now();
    const submissionDuration = submissionEndTime - submissionStartTime;
    const minSubmissionTime = security.minSubmissionTime || 3000; // Default 3 seconds
    const isSubmissionTimeValid = submissionDuration >= minSubmissionTime;
    
    // Emit security event for submission time check
    emitSecurityEvent('submission_time', {
      passed: isSubmissionTimeValid,
      duration: submissionDuration,
      minRequired: minSubmissionTime
    });
    
    return isSubmissionTimeValid;
  };
  
  // Execute reCAPTCHA
  const executeReCaptchaCheck = async (): Promise<boolean> => {
    if (!isReCaptchaEnabled(security)) return true;
    
    const siteKey = security?.reCaptchaSiteKey || '';
    
    try {
      // Log the start of reCAPTCHA execution
      console.info('Security check: Starting reCAPTCHA execution');
      
      // Emit security event for reCAPTCHA execution start
      emitSecurityEvent('recaptcha_execute', { 
        action: 'submit_waitlist',
        siteKey: siteKey.substring(0, 5) + '...' // Only show part of the key for security
      });
      
      // Execute reCAPTCHA
      let token;
      try {
        token = await executeReCaptcha(siteKey, 'submit_waitlist');
        
        // Check if token is null or empty
        if (!token) {
          console.error('Security check: reCAPTCHA returned null or empty token');
          emitSecurityEvent('recaptcha_token_error', { 
            error: 'Null or empty token received'
          });
          return false;
        }
      } catch (tokenError) {
        console.error('Security check: reCAPTCHA execution error -', 
          tokenError instanceof Error ? tokenError.message : String(tokenError));
        
        emitSecurityEvent('recaptcha_execution_error', { 
          error: tokenError instanceof Error ? tokenError.message : String(tokenError)
        });
        
        return false;
      }
      
      setReCaptchaToken(token);
      
      // Log successful reCAPTCHA execution
      console.info(`Security check: reCAPTCHA successful, token length: ${token.length}`);
      
      // Emit security event for successful reCAPTCHA execution
      emitSecurityEvent('recaptcha_success', { 
        tokenLength: token.length,
        tokenPreview: token.substring(0, 10) + '...'
      });
      
      // Verify the token - this will automatically use the appropriate method
      // based on the environment and available configuration
      try {
        const verificationMethod = security.recaptchaProxyEndpoint 
          ? 'proxy' 
          : (security.reCaptchaSecretKey ? 'direct' : 'none');
        
        emitSecurityEvent('recaptcha_verify', { 
          method: verificationMethod,
          hasSecretKey: !!security.reCaptchaSecretKey,
          hasProxyEndpoint: !!security.recaptchaProxyEndpoint
        });
        
        // If no verification method is available, log a warning but don't fail
        if (verificationMethod === 'none') {
          console.warn('Security check: No reCAPTCHA verification method available (secretKey or proxyEndpoint)');
          emitSecurityEvent('recaptcha_verify_warning', {
            warning: 'No verification method available',
            recommendation: 'Configure recaptchaProxyEndpoint for client-side or reCaptchaSecretKey for server-side'
          });
          // Continue with submission despite no verification
          return true;
        }
        
        const verificationResult = await verifyReCaptchaToken(
          token,
          security.reCaptchaSecretKey, // Will be used if provided
          security.recaptchaProxyEndpoint,
          'submit_waitlist',
          0.5 // Default minimum score
        );
        
        if (!verificationResult.valid) {
          emitSecurityEvent('recaptcha_verify_failed', { 
            error: verificationResult.error,
            score: verificationResult.score
          });
          
          console.error('Security check: reCAPTCHA verification failed -', verificationResult.error);
          return false;
        }
        
        emitSecurityEvent('recaptcha_verify_success', { 
          score: verificationResult.score
        });
        
        console.info(`Security check: reCAPTCHA verification successful, score: ${verificationResult.score}`);
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        emitSecurityEvent('recaptcha_verify_error', { 
          error: errorMessage
        });
        
        console.error('Security check: reCAPTCHA verification request failed -', errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Log reCAPTCHA failure
      console.error('Security check: reCAPTCHA failed -', errorMessage);
      
      // Emit security event for reCAPTCHA failure
      emitSecurityEvent('recaptcha_error', { 
        error: errorMessage
      });
      
      // Return false to indicate failure
      return false;
    }
  };
  
  // Run all security checks
  const runSecurityChecks = async (): Promise<boolean> => {
    setSecurityChecksInProgress(true);
    console.info('Security checks: Starting security validation');
    
    // Emit security event for starting security checks
    emitSecurityEvent('security_checks_start', {
      enabledChecks: {
        honeypot: !!security?.enableHoneypot,
        submissionTime: !!security?.checkSubmissionTime,
        reCaptcha: isReCaptchaEnabled(security)
      }
    });
    
    try {
      // Check honeypot
      const honeypotPassed = checkHoneypot();
      console.info(`Security checks: Honeypot check ${honeypotPassed ? 'passed' : 'failed'}`);
      if (!honeypotPassed) {
        emitSecurityEvent('security_check_failed', { reason: 'honeypot' });
        return false;
      }
      
      // Check submission time
      const submissionTimePassed = checkSubmissionTime();
      console.info(`Security checks: Submission time check ${submissionTimePassed ? 'passed' : 'failed'}`);
      if (!submissionTimePassed) {
        emitSecurityEvent('security_check_failed', { reason: 'submission_time' });
        return false;
      }
      
      // Check reCAPTCHA
      const reCaptchaPassed = await executeReCaptchaCheck();
      console.info(`Security checks: reCAPTCHA check ${reCaptchaPassed ? 'passed' : 'failed'}`);
      if (!reCaptchaPassed) {
        emitSecurityEvent('security_check_failed', { reason: 'recaptcha' });
        return false;
      }
      
      // All checks passed
      console.info('Security checks: All security checks passed');
      
      // Emit security event for all checks passed
      emitSecurityEvent('security_checks_passed', { 
        honeypot: honeypotPassed,
        submissionTime: submissionTimePassed,
        reCaptcha: reCaptchaPassed
      });
      
      return true;
    } finally {
      setSecurityChecksInProgress(false);
    }
  };
  
  // Render form based on state
  if (formState === 'success') {
    return (
      <div
        className={className}
        style={{
          ...(theme.components?.container || {}),
          ...style,
        }}
        role="status"
        aria-live="polite"
      >
        <div 
          className="success-container"
          style={{
            ...(theme.components?.successContainer || {}),
            ...animations.fadeIn
          }}
        >
          <h2 style={theme.components?.successTitle || {}}>{successTitle}</h2>
          <p style={theme.components?.successDescription || {}}>{successDescription}</p>
        </div>
      </div>
    );
  }
  
  // Render the form
  return (
    <div
      className={className}
      style={{
        ...(theme.components?.container || {}),
        ...style,
      }}
    >
      <h2 style={theme.components?.title || {}}>{title}</h2>
      <p style={theme.components?.description || {}}>{description}</p>
      
      <form
        onSubmit={handleSubmit}
        style={theme.components?.form || {}}
        aria-label={ariaLabels.form || 'Waitlist signup form'}
      >
        {/* Visible form fields */}
        {fields.map((field) => {
          const extendedField = field as ExtendedField;
          const validation = validationErrors[field.name] || { valid: true, message: '' };
          const isInvalid = !validation.valid;
          
          return (
            <div 
              key={field.name}
              style={theme.components?.fieldContainer || {}}
            >
              <label
                htmlFor={field.name}
                style={theme.components?.label || {}}
              >
                {field.label}
                {field.required && (
                  <span 
                    aria-hidden="true"
                    style={theme.components?.required || {}}
                  >
                    *
                  </span>
                )}
              </label>
              
              {renderField(field)}
              
              {isInvalid && (
                <div
                  id={`${field.name}-error`}
                  style={theme.components?.errorMessage || {}}
                  role="alert"
                >
                  {validation.message}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Honeypot field (invisible to users, used to detect bots) */}
        {security.enableHoneypot && (
          <div style={getHoneypotStyles()}>
            <label htmlFor={honeypotFieldName.current}>
              Please leave this field empty
            </label>
            <input
              type="text"
              name={honeypotFieldName.current}
              id={honeypotFieldName.current}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        )}
        
        {/* Form error message */}
        {formError && (
          <div 
            style={theme.components?.formError || {}}
            role="alert"
          >
            {formError}
          </div>
        )}
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || securityChecksInProgress}
          style={{
            ...(theme.components?.button || {}),
            ...(isSubmitting ? (theme.components?.buttonLoading || {}) : {}),
          }}
          aria-label={ariaLabels.submitButton || 'Join the waitlist'}
          aria-busy={isSubmitting || securityChecksInProgress}
        >
          {isSubmitting || securityChecksInProgress ? (
            <>
              <span style={theme.components?.loadingText || {}}>
                {submitText || 'Join Waitlist'}
              </span>
              <div style={theme.components?.spinner || {}} />
            </>
          ) : (
            submitText || 'Join Waitlist'
          )}
        </button>
      </form>
    </div>
  );
};

/**
 * Main WaitlistForm component
 * This is the primary component for client-side usage
 * Import directly from 'react-waitlist'
 */
export const WaitlistForm: React.FC<WaitlistProps> = (props) => {
  return (
    <AriaProvider config={props.a11y as any}>
      <WaitlistFormInner {...props} />
    </AriaProvider>
  );
};

export default WaitlistForm; 