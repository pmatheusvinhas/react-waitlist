import { useState, useEffect, useRef } from 'react';
import { Field, SecurityConfig, ResendMapping } from '../types';
import { validateForm, isFormValid, generateHoneypotFieldName, isLikelyBot, trackEvent } from '../utils';
import { Resend } from 'resend';
import { useResendAudience, ResendContact } from './useResendAudience';

/**
 * Form states
 */
export type FormState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Hook options
 */
export interface UseWaitlistFormOptions {
  /** Fields to collect */
  fields: Field[];
  /** Security configuration */
  security?: SecurityConfig;
  /** Mapping to Resend API fields */
  resendMapping?: ResendMapping;
  /** Audience ID from Resend */
  audienceId: string;
  /** Endpoint for proxy API (for client-side usage) */
  proxyEndpoint?: string;
  /** Resend API key (only use in server components or with proxy) */
  apiKey?: string;
  /** Analytics configuration */
  analytics?: any;
  /** Callback when submission is successful */
  onSuccess?: (data: any) => void;
  /** Callback when submission fails */
  onError?: (error: Error) => void;
}

/**
 * Hook return value
 */
export interface UseWaitlistFormReturn {
  /** Current form state */
  formState: FormState;
  /** Form values */
  formValues: Record<string, string | boolean>;
  /** Validation results */
  validationResults: Record<string, { valid: boolean; message?: string }>;
  /** Error message */
  errorMessage: string;
  /** Honeypot field name */
  honeypotFieldName: string;
  /** Handle input change */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  /** Handle form submission */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** Reset form */
  resetForm: () => void;
}

/**
 * Hook for waitlist form functionality
 */
export const useWaitlistForm = (options: UseWaitlistFormOptions): UseWaitlistFormReturn => {
  const {
    fields,
    security = {
      enableHoneypot: true,
      checkSubmissionTime: true,
    },
    resendMapping,
    audienceId,
    proxyEndpoint,
    apiKey,
    analytics,
    onSuccess,
    onError,
  } = options;

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
  };
  
  return {
    formState,
    formValues,
    validationResults,
    errorMessage,
    honeypotFieldName: honeypotFieldName.current,
    handleChange,
    handleSubmit,
    resetForm,
  };
}; 