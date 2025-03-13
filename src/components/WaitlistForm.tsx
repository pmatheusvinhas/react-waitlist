import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Field, WaitlistProps, A11yConfig, SecurityConfig, AnalyticsConfig, ResendMapping, ThemeConfig } from '../types';
import { validateForm, isFormValid, generateHoneypotFieldName, isLikelyBot, getHoneypotStyles, trackEvent, isReCaptchaEnabled } from '../utils';
import { mergeTheme, getAnimationStyles, AnimationConfig, defaultAnimation, applyFrameworkAdapter } from '../styles';
import { AriaProvider, useAria, useAnnounce, useAriaLabels, useReducedMotion } from '../a11y';
import { useResendAudience, ResendContact } from '../hooks/useResendAudience';
import { useReCaptcha } from '../hooks/useReCaptcha';

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
  onView,
  onSubmit,
  onSuccess,
  onError,
  className,
  style,
}) => {
  // Apply framework adapter if provided and merge with user theme
  const adaptedTheme = frameworkConfig 
    ? applyFrameworkAdapter(userTheme, frameworkConfig) 
    : userTheme;
  
  // Merge user theme with default theme
  const theme = mergeTheme(adaptedTheme);
  
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
  
  // Honeypot field name (for bot detection)
  const honeypotFieldName = useRef(generateHoneypotFieldName());
  
  // Submission time tracking (for bot detection)
  const formLoadTime = useRef(Date.now());
  
  // Initialize form values from default values
  useEffect(() => {
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
    
    setFormValues(initialValues);
  }, [fields]);
  
  // Track view event
  useEffect(() => {
    if (onView) {
      onView({ timestamp: new Date().toISOString() });
    }
    
    if (analytics?.enabled) {
      trackEvent(analytics, { event: 'view' });
    }
  }, [onView, analytics]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    
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
    
    // Reset form error
    setFormError(null);
    
    // Check for honeypot (bot detection)
    if (security.enableHoneypot) {
      const honeypotValue = (e.target as any)[honeypotFieldName.current]?.value;
      if (honeypotValue) {
        console.warn('Honeypot triggered, likely bot submission');
        setFormError('Something went wrong. Please try again later.');
        return;
      }
    }
    
    // Check submission time (bot detection)
    if (security.checkSubmissionTime) {
      const submissionTime = Date.now();
      const timeElapsed = submissionTime - formLoadTime.current;
    
      if (isLikelyBot(formValues.honeypot as string, formLoadTime.current)) {
        console.warn('Submission time check triggered, likely bot submission');
        setFormError('Something went wrong. Please try again later.');
        return;
      }
    }
    
    // Validate form
    const validation = validateForm(formValues, fields);
    setValidationErrors(validation);
    
    if (!Object.values(validation).every(result => result.valid)) {
      return;
    }
    
    // Execute reCAPTCHA if enabled
    if (security.reCaptchaSiteKey && reCaptcha && reCaptcha.isLoaded) {
      try {
        await reCaptcha.executeReCaptcha();
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        setFormError('Error verifying reCAPTCHA. Please try again.');
        return;
      }
    }
    
    // Start submission
    setIsSubmitting(true);
    setFormState('submitting');
    
    // Prepare submission data
    const submissionData = {
      timestamp: new Date().toISOString(),
      formData: { ...formValues },
    };
    
    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(submissionData);
    }
    
    // Track submit event
    if (analytics?.enabled) {
      trackEvent(analytics, { 
        event: 'submit',
        properties: submissionData.formData
      });
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
          
          // Track success event
          if (analytics?.enabled) {
            trackEvent(analytics, { 
              event: 'success',
              properties: submissionData.formData
            });
          }
          
          // Announce success to screen readers
          if (announce) {
            announce('Form submitted successfully');
      }
      
          // Add to Resend audience if configured
          if (resendAudience && resendAudienceId) {
            try {
              const contact: ResendContact = {
                email: formValues.email as string,
                firstName: formValues.firstName as string,
                lastName: formValues.lastName as string,
                unsubscribed: false,
              };
              
              // Add metadata if mapping is provided
              if (resendMapping?.metadata && Array.isArray(resendMapping.metadata)) {
                const metadata: Record<string, any> = {};
                
                resendMapping.metadata.forEach((field) => {
                  if (formValues[field] !== undefined) {
                    metadata[field] = formValues[field];
          }
        });
                
                if (Object.keys(metadata).length > 0) {
                  contact.metadata = metadata;
                }
              }
              
              await resendAudience.addContact(contact);
            } catch (error) {
              console.error('Failed to add contact to Resend audience:', error);
            }
          }
        } else {
          // If result is returned but success is false, show error message
          setFormState('error');
          setFormError(result?.error || 'Something went wrong. Please try again later.');
          
          // Track error event
          if (analytics?.enabled) {
            trackEvent(analytics, { 
              event: 'error',
              properties: { message: result?.error || 'Unknown error' }
            });
          }
        }
      } else {
        // If no onSuccess callback is provided, show success message
      setFormState('success');
      
      // Track success event
        if (analytics?.enabled) {
          trackEvent(analytics, { 
            event: 'success',
            properties: submissionData.formData
          });
        }
        
        // Announce success to screen readers
        if (announce) {
          announce('Form submitted successfully');
        }
      }
    } catch (error) {
      // Handle error
      setFormState('error');
      setFormError((error as Error).message || 'Something went wrong. Please try again later.');
      
      // Call onError callback if provided
      if (onError) {
        onError({
          ...submissionData,
          error: error as Error,
        });
      }
      
      // Track error event
      if (analytics?.enabled) {
        trackEvent(analytics, { 
          event: 'error',
          properties: { message: (error as Error).message }
        });
      }
      
      // Announce error to screen readers
      if (announce) {
        announce('Error submitting form');
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
              
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formValues[field.name] as string}
                  onChange={handleChange}
                  required={field.required}
                  aria-invalid={isInvalid}
                  aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                  style={{
                    ...(theme.components?.input || {}),
                    ...(isInvalid ? (theme.components?.inputError || {}) : {}),
                  }}
                >
                  <option value="">{field.placeholder || 'Select an option'}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div style={theme.components?.checkboxContainer || {}}>
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    checked={formValues[field.name] as boolean}
                    onChange={handleChange}
                    required={field.required}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                    style={theme.components?.checkbox || {}}
                  />
                  <span style={theme.components?.checkboxLabel || {}}>{extendedField.checkboxLabel || field.label}</span>
                </div>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formValues[field.name] as string}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  aria-invalid={isInvalid}
                  aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                  style={{
                    ...(theme.components?.input || {}),
                    ...(isInvalid ? (theme.components?.inputError || {}) : {}),
                  }}
                />
              )}
              
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
          disabled={isSubmitting || !isFormValid(validationErrors)}
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
 * Waitlist form component with accessibility provider
 */
const WaitlistForm: React.FC<WaitlistProps> = (props) => {
  return (
    <AriaProvider config={props.a11y}>
      <WaitlistFormInner {...props} />
    </AriaProvider>
  );
};

export default WaitlistForm; 