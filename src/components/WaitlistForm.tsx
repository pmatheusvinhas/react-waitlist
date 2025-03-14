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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't allow multiple submissions
    if (isSubmitting) return;
    
    // Set submitting state at the beginning
    setIsSubmitting(true);
    
    // Reset form error
    setFormError(null);
    
    // Ensure we're using the latest values by combining state and ref
    const currentFormValues = { ...formValues };
    
    // Check for honeypot (bot detection)
    if (security.enableHoneypot) {
      const honeypotValue = (e.target as any)[honeypotFieldName.current]?.value;
      if (honeypotValue) {
        console.warn('Honeypot triggered, likely bot submission');
        setFormError('Something went wrong. Please try again later.');
        setIsSubmitting(false);
        return;
      }
    }
    
    // Check submission time (bot detection)
    if (security.checkSubmissionTime) {
      const submissionTime = Date.now();
      const timeElapsed = submissionTime - formLoadTime.current;
      const honeypotValue = (e.target as any)[honeypotFieldName.current]?.value;
    
      const botCheck = isLikelyBot(honeypotValue, formLoadTime.current);
      if (botCheck.isBot) {
        console.warn('Submission time check triggered, likely bot submission. Reason:', botCheck.reason);
        setFormError('Something went wrong. Please try again later.');
        setIsSubmitting(false);
        return;
      }
    }
    
    // Validate form
    const validation = validateForm(currentFormValues, fields);
    setValidationErrors(validation);
    
    if (!isFormValid(validation)) {
      setIsSubmitting(false);
      return;
    }
    
    // Execute reCAPTCHA if enabled
    if (reCaptchaEnabled && reCaptcha && reCaptcha.isLoaded) {
      try {
        await reCaptcha.executeReCaptcha();
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        setFormError('Error verifying reCAPTCHA. Please try again.');
        setIsSubmitting(false);
        return;
      }
    }
    
    // Set form state to submitting
    setFormState('submitting');
    
    // Prepare submission data
    const submissionData = {
      timestamp: new Date().toISOString(),
      formData: { ...currentFormValues },
    };
    
    // Emit submit event
    waitlistEvents.emitSubmit(submissionData.formData);
    
    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(submissionData);
    }
    
    try {
      // Handle form submission with onSuccess callback
      if (onSuccess) {
        const result = await onSuccess({
          ...submissionData,
          response: null,
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
      
      // Emit error event
      waitlistEvents.emitError(submissionData.formData, error as Error);
      
      // Call onError callback if provided
      if (onError) {
        onError({
          timestamp: new Date().toISOString(),
          formData: submissionData.formData,
          error: error as Error,
        });
      }
      
      // Announce error to screen readers
      if (announce) {
        announce('Form submission failed: ' + (error as Error).message);
      }
    } finally {
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
          disabled={isSubmitting}
          style={{
            ...(theme.components?.button || {}),
            ...(isSubmitting ? (theme.components?.buttonLoading || {}) : {}),
          }}
          aria-label={ariaLabels.submitButton || 'Join the waitlist'}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : submitText}
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