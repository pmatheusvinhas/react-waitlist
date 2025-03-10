import React, { useState, useEffect, useRef } from 'react';
import { Field, WaitlistProps, A11yConfig, SecurityConfig, AnalyticsConfig, ResendMapping, ThemeConfig } from '../types';
import { validateForm, isFormValid, generateHoneypotFieldName, isLikelyBot, getHoneypotStyles, trackEvent } from '../utils';
import { mergeTheme, getAnimationStyles } from '../styles';
import { AriaProvider, useAria, useAnnounce, useAriaLabels, useReducedMotion } from '../a11y';

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
 * Inner form component that uses accessibility context
 */
const WaitlistFormInner: React.FC<WaitlistProps> = ({
  apiKey,
  audienceId,
  proxyEndpoint,
  title = 'Join our waitlist',
  description = 'Be the first to know when we launch',
  submitText = 'Join waitlist',
  successTitle = 'You\'re on the list!',
  successDescription = 'Thank you for joining our waitlist. We\'ll keep you updated.',
  fields = defaultFields,
  theme: userTheme,
  security = {
    enableHoneypot: true,
    checkSubmissionTime: true,
  },
  analytics,
  resendMapping,
  onSuccess,
  onError,
  className,
  style,
}) => {
  // Merge user theme with default theme
  const theme = mergeTheme(userTheme);
  
  // Get accessibility hooks
  const ariaLabels = useAriaLabels();
  const announce = useAnnounce();
  const prefersReducedMotion = useReducedMotion();
  
  // Form state
  const [formState, setFormState] = useState<FormState>('idle');
  const [formValues, setFormValues] = useState<Record<string, string | boolean>>({});
  const [validationResults, setValidationResults] = useState<Record<string, { valid: boolean; message?: string }>>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Security
  const formStartTime = useRef<number>(Date.now());
  const honeypotFieldName = useRef<string>(generateHoneypotFieldName());
  
  // Initialize form values with default values
  useEffect(() => {
    const initialValues: Record<string, string | boolean> = {};
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialValues[field.name] = field.defaultValue;
      } else if (field.type === 'checkbox') {
        initialValues[field.name] = false;
      } else {
        initialValues[field.name] = '';
      }
    });
    setFormValues(initialValues);
  }, [fields]);
  
  // Track view event on mount
  useEffect(() => {
    trackEvent(analytics, { event: 'view' });
  }, [analytics]);
  
  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const newValue = isCheckbox 
      ? (e.target as HTMLInputElement).checked 
      : value;
    
    setFormValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Validate the field
    const field = fields.find((f) => f.name === name);
    if (field) {
      const result = validateForm([field], { [name]: newValue });
      setValidationResults((prev) => ({
        ...prev,
        ...result,
      }));
    }
    
    // Track focus event (only once per field)
    if (name === 'email' && !formValues[name]) {
      trackEvent(analytics, { 
        event: 'focus',
        properties: { field: name }
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track submit event
    trackEvent(analytics, { event: 'submit' });
    
    // Validate all fields
    const results = validateForm(fields, formValues);
    setValidationResults(results);
    
    if (!isFormValid(results)) {
      // Announce validation errors
      const firstError = Object.values(results).find(result => !result.valid);
      if (firstError && firstError.message) {
        announce(firstError.message, true);
      }
      return;
    }
    
    // Check for bot activity
    if (security.enableHoneypot || security.checkSubmissionTime) {
      const honeypotValue = formValues[honeypotFieldName.current] as string | undefined;
      const botCheck = isLikelyBot(
        honeypotValue,
        formStartTime.current,
        1500
      );
      
      if (botCheck.isBot) {
        console.warn('Bot activity detected:', botCheck.reason);
        // Pretend success to not alert bots
        setFormState('success');
        return;
      }
    }
    
    // Set submitting state
    setFormState('submitting');
    announce('Submitting your information...', false);
    
    try {
      // Prepare data for Resend API
      const contactData: Record<string, any> = {
        email: formValues[resendMapping?.email || 'email'] as string,
        audienceId,
      };
      
      // Add first name if available
      if (resendMapping?.firstName && formValues[resendMapping.firstName]) {
        contactData.firstName = formValues[resendMapping.firstName] as string;
      }
      
      // Add last name if available
      if (resendMapping?.lastName && formValues[resendMapping.lastName]) {
        contactData.lastName = formValues[resendMapping.lastName] as string;
      }
      
      // Add metadata fields
      if (resendMapping?.metadata && resendMapping.metadata.length > 0) {
        contactData.metadata = {};
        resendMapping.metadata.forEach((fieldName) => {
          if (formValues[fieldName] !== undefined) {
            contactData.metadata[fieldName] = formValues[fieldName];
          }
        });
      }
      
      // Send data to Resend API
      let response;
      
      if (proxyEndpoint) {
        // Use proxy endpoint for client-side
        response = await fetch(proxyEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audienceId,
            contact: contactData,
          }),
        });
      } else if (apiKey) {
        // Direct API call (only for server components)
        // This should not be used in client-side code
        response = await fetch('https://api.resend.com/audiences/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(contactData),
        });
      } else {
        throw new Error('Either apiKey or proxyEndpoint must be provided');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join waitlist');
      }
      
      const data = await response.json();
      
      // Set success state
      setFormState('success');
      
      // Announce success
      announce(ariaLabels.successMessage || 'Successfully joined the waitlist', true);
      
      // Track success event
      trackEvent(analytics, { 
        event: 'success',
        properties: { 
          email: formValues[resendMapping?.email || 'email'] 
        }
      });
      
      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      // Set error state
      setFormState('error');
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      
      // Announce error
      announce(ariaLabels.errorMessage || 'Error joining the waitlist: ' + errorMsg, true);
      
      // Track error event
      trackEvent(analytics, { 
        event: 'error',
        properties: { 
          message: errorMsg,
          email: formValues[resendMapping?.email || 'email'] 
        }
      });
      
      // Call onError callback
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormState('idle');
    setErrorMessage('');
    formStartTime.current = Date.now();
    
    // Reset form values to defaults
    const initialValues: Record<string, string | boolean> = {};
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialValues[field.name] = field.defaultValue;
      } else if (field.type === 'checkbox') {
        initialValues[field.name] = false;
      } else {
        initialValues[field.name] = '';
      }
    });
    setFormValues(initialValues);
    setValidationResults({});
    
    // Announce form reset
    announce('Form reset. You can join with another email.', false);
  };
  
  // Get animation styles
  const animationStyles = getAnimationStyles(
    { type: 'fadeSlide', duration: 300 },
    'enter',
    prefersReducedMotion
  );
  
  // Render success state
  if (formState === 'success') {
    return (
      <div
        className={className}
        style={{
          fontFamily: theme.typography?.fontFamily,
          color: theme.colors?.text,
          ...animationStyles,
          ...style,
        }}
      >
        <h2 
          style={{ color: theme.colors?.primary }}
          aria-live="polite"
        >
          {successTitle}
        </h2>
        <p>{successDescription}</p>
        <button
          onClick={resetForm}
          style={{
            backgroundColor: theme.colors?.secondary,
            color: 'white',
            border: 'none',
            padding: `${theme.spacing?.sm} ${theme.spacing?.md}`,
            borderRadius: theme.borders?.radius?.md,
            cursor: 'pointer',
            fontWeight: theme.typography?.fontWeights?.medium,
            ...animationStyles,
          }}
        >
          Join another email
        </button>
      </div>
    );
  }
  
  // Render form
  return (
    <div
      className={className}
      style={{
        fontFamily: theme.typography?.fontFamily,
        color: theme.colors?.text,
        ...style,
      }}
    >
      {title && <h2 style={{ color: theme.colors?.primary }}>{title}</h2>}
      {description && <p>{description}</p>}
      
      <form 
        onSubmit={handleSubmit}
        aria-label={ariaLabels.form}
        noValidate
      >
        {/* Honeypot field for bot detection */}
        {security.enableHoneypot && (
          <div style={getHoneypotStyles()}>
            <label htmlFor={honeypotFieldName.current}>Do not fill this field</label>
            <input
              type="text"
              id={honeypotFieldName.current}
              name={honeypotFieldName.current}
              onChange={handleChange}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
            />
          </div>
        )}
        
        {/* Form fields */}
        {fields.map((field) => (
          <div
            key={field.name}
            style={{
              marginBottom: theme.spacing?.md,
            }}
          >
            <label
              htmlFor={field.name}
              style={{
                display: 'block',
                marginBottom: theme.spacing?.xs,
                fontWeight: theme.typography?.fontWeights?.medium,
              }}
            >
              {field.label}
              {field.required && (
                <span style={{ color: theme.colors?.error }}> *</span>
              )}
            </label>
            
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formValues[field.name] as string}
                onChange={handleChange}
                required={field.required}
                aria-required={field.required}
                aria-invalid={validationResults[field.name]?.valid === false}
                aria-describedby={
                  validationResults[field.name]?.valid === false
                    ? `${field.name}-error`
                    : undefined
                }
                style={{
                  width: '100%',
                  padding: theme.spacing?.sm,
                  borderRadius: theme.borders?.radius?.md,
                  border: `1px solid ${
                    validationResults[field.name]?.valid === false
                      ? theme.colors?.error
                      : theme.colors?.gray?.[300]
                  }`,
                  fontSize: theme.typography?.fontSizes?.md,
                }}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={!!formValues[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  aria-required={field.required}
                  aria-invalid={validationResults[field.name]?.valid === false}
                  aria-describedby={
                    validationResults[field.name]?.valid === false
                      ? `${field.name}-error`
                      : undefined
                  }
                  style={{
                    marginRight: theme.spacing?.xs,
                  }}
                />
                <label
                  htmlFor={field.name}
                  style={{
                    fontWeight: 'normal',
                  }}
                >
                  {field.label}
                </label>
              </div>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formValues[field.name] as string}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                aria-required={field.required}
                aria-invalid={validationResults[field.name]?.valid === false}
                aria-describedby={
                  validationResults[field.name]?.valid === false
                    ? `${field.name}-error`
                    : undefined
                }
                aria-label={field.name === 'email' ? ariaLabels.emailField : undefined}
                style={{
                  width: '100%',
                  padding: theme.spacing?.sm,
                  borderRadius: theme.borders?.radius?.md,
                  border: `1px solid ${
                    validationResults[field.name]?.valid === false
                      ? theme.colors?.error
                      : theme.colors?.gray?.[300]
                  }`,
                  fontSize: theme.typography?.fontSizes?.md,
                }}
              />
            )}
            
            {validationResults[field.name]?.valid === false && (
              <div
                id={`${field.name}-error`}
                style={{
                  color: theme.colors?.error,
                  fontSize: theme.typography?.fontSizes?.sm,
                  marginTop: theme.spacing?.xs,
                }}
                role="alert"
              >
                {validationResults[field.name]?.message}
              </div>
            )}
          </div>
        ))}
        
        <button
          type="submit"
          disabled={formState === 'submitting'}
          aria-label={ariaLabels.submitButton}
          aria-busy={formState === 'submitting'}
          style={{
            backgroundColor: theme.colors?.primary,
            color: 'white',
            border: 'none',
            padding: `${theme.spacing?.sm} ${theme.spacing?.md}`,
            borderRadius: theme.borders?.radius?.md,
            cursor: formState === 'submitting' ? 'wait' : 'pointer',
            fontWeight: theme.typography?.fontWeights?.medium,
            opacity: formState === 'submitting' ? 0.7 : 1,
            width: '100%',
          }}
        >
          {formState === 'submitting' ? 'Submitting...' : submitText}
        </button>
        
        {formState === 'error' && (
          <div
            style={{
              color: theme.colors?.error,
              marginTop: theme.spacing?.md,
              fontSize: theme.typography?.fontSizes?.sm,
            }}
            role="alert"
            aria-live="assertive"
          >
            {errorMessage || 'An error occurred. Please try again.'}
          </div>
        )}
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