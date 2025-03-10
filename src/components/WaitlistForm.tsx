import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Field, WaitlistProps, A11yConfig, SecurityConfig, AnalyticsConfig, ResendMapping, ThemeConfig } from '../types';
import { validateForm, isFormValid, generateHoneypotFieldName, isLikelyBot, getHoneypotStyles, trackEvent } from '../utils';
import { mergeTheme, getAnimationStyles, AnimationConfig, defaultAnimation } from '../styles';
import { AriaProvider, useAria, useAnnounce, useAriaLabels, useReducedMotion } from '../a11y';
import { useResendAudience, ResendContact } from '../hooks/useResendAudience';

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
 * Option type for select fields
 */
interface SelectOption {
  value: string;
  label: string;
}

/**
 * Extended field type with additional properties
 */
interface ExtendedField extends Omit<Field, 'options'> {
  checkboxLabel?: string;
  options?: (string | SelectOption)[];
}

/**
 * Extended theme with component-specific styles
 */
interface ExtendedTheme extends ThemeConfig {
  container?: CSSProperties;
  title?: CSSProperties;
  description?: CSSProperties;
  form?: CSSProperties;
  fieldContainer?: CSSProperties;
  label?: CSSProperties;
  input?: CSSProperties;
  inputError?: CSSProperties;
  checkboxContainer?: CSSProperties;
  checkbox?: CSSProperties;
  checkboxLabel?: CSSProperties;
  button?: CSSProperties;
  buttonLoading?: CSSProperties;
  errorMessage?: CSSProperties;
  formError?: CSSProperties;
  required?: CSSProperties;
}

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
  const theme = mergeTheme(userTheme) as ExtendedTheme;
  
  // Get accessibility hooks
  const ariaLabels = useAriaLabels();
  const announce = useAnnounce();
  const prefersReducedMotion = useReducedMotion();
  
  // Initialize Resend audience hook
  const resendAudience = useResendAudience({
    apiKey,
    audienceId,
    proxyEndpoint,
  });
  
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
      const contactData: ResendContact = {
        email: formValues[resendMapping?.email || 'email'] as string,
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
            contactData.metadata![fieldName] = formValues[fieldName];
          }
        });
      }
      
      // Send data to Resend API using the hook
      const data = await resendAudience.addContact(contactData);
      
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
      announce(ariaLabels.errorMessage || `Error: ${errorMsg}`, true);
      
      // Track error event
      trackEvent(analytics, { 
        event: 'error',
        properties: { 
          message: errorMsg 
        }
      });
      
      // Call onError callback
      if (onError && error instanceof Error) {
        onError(error);
      } else if (onError) {
        onError(new Error(errorMsg));
      }
    }
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormState('idle');
    setErrorMessage('');
    
    // Reset form values
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
    
    // Reset validation results
    setValidationResults({});
    
    // Reset security measures
    formStartTime.current = Date.now();
    honeypotFieldName.current = generateHoneypotFieldName();
    
    // Announce form reset
    announce('Form has been reset', false);
  };
  
  // Get animation styles based on user preferences
  const animationConfig: AnimationConfig = prefersReducedMotion ? { type: 'none' } : defaultAnimation;
  const animations = {
    fadeIn: getAnimationStyles(animationConfig, 'enter'),
  };
  
  // Render form based on state
  if (formState === 'success') {
    return (
      <div
        className={className}
        style={{
          ...(theme.container || {}),
          ...style,
        }}
        role="status"
        aria-live="polite"
      >
        <div style={animations.fadeIn}>
          <h2 style={theme.title || {}}>{successTitle}</h2>
          <p style={theme.description || {}}>{successDescription}</p>
        </div>
      </div>
    );
  }
  
  // Render the form
  return (
    <div
      className={className}
      style={{
        ...(theme.container || {}),
        ...style,
      }}
    >
      <h2 style={theme.title || {}}>{title}</h2>
      <p style={theme.description || {}}>{description}</p>
      
      <form
        onSubmit={handleSubmit}
        style={theme.form || {}}
        aria-label={ariaLabels.form || 'Waitlist signup form'}
      >
        {/* Visible form fields */}
        {fields.map((field) => {
          const extendedField = field as ExtendedField;
          const validation = validationResults[field.name];
          const isInvalid = validation && !validation.valid;
          
          return (
            <div key={field.name} style={theme.fieldContainer || {}}>
              <label
                htmlFor={field.name}
                style={theme.label || {}}
              >
                {field.label}
                {field.required && <span style={theme.required || { color: 'red' }}> *</span>}
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
                    ...(theme.input || {}),
                    ...(isInvalid ? (theme.inputError || {}) : {}),
                  }}
                >
                  <option value="">{field.placeholder || 'Select an option'}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  {extendedField.options?.filter(opt => typeof opt !== 'string').map((option) => {
                    const typedOption = option as SelectOption;
                    return (
                      <option key={typedOption.value} value={typedOption.value}>
                        {typedOption.label}
                      </option>
                    );
                  })}
                </select>
              ) : field.type === 'checkbox' ? (
                <div style={theme.checkboxContainer || {}}>
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    checked={formValues[field.name] as boolean}
                    onChange={handleChange}
                    required={field.required}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                    style={theme.checkbox || {}}
                  />
                  <span style={theme.checkboxLabel || {}}>{extendedField.checkboxLabel || field.label}</span>
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
                    ...(theme.input || {}),
                    ...(isInvalid ? (theme.inputError || {}) : {}),
                  }}
                />
              )}
              
              {isInvalid && (
                <div
                  id={`${field.name}-error`}
                  style={theme.errorMessage || {}}
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
              id={honeypotFieldName.current}
              name={honeypotFieldName.current}
              type="text"
              onChange={handleChange}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
            />
          </div>
        )}
        
        {/* Submit button */}
        <button
          type="submit"
          style={{
            ...(theme.button || {}),
            ...(formState === 'submitting' ? (theme.buttonLoading || {}) : {}),
          }}
          disabled={formState === 'submitting'}
          aria-label={ariaLabels.submitButton || 'Submit to join waitlist'}
        >
          {formState === 'submitting' ? 'Submitting...' : submitText}
        </button>
        
        {/* Error message */}
        {formState === 'error' && (
          <div
            style={theme.formError || {}}
            role="alert"
          >
            {errorMessage}
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