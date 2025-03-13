import { useState, useEffect, useRef } from 'react';
import { Field, SecurityConfig, ResendMapping, WebhookConfig, WaitlistEventData } from '../core/types';
import { validateForm, isFormValid } from '../core/validation';
import { generateHoneypotFieldName, isLikelyBot } from '../core/security';
import { eventBus } from '../core/events';
import { trackEvent } from '../core/analytics';
import { sendWebhooks } from '../core/webhook';
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
  /** Resend Audience ID */
  resendAudienceId?: string;
  /** Endpoint for Resend proxy API */
  resendProxyEndpoint?: string;
  /** Endpoint for webhook proxy API */
  webhookProxyEndpoint?: string;
  /** Resend API key (only use in server components or with proxy) */
  apiKey?: string;
  /** Analytics configuration */
  analytics?: any;
  /** Webhook configuration */
  webhooks?: WebhookConfig[];
  /** Callback when view event occurs */
  onView?: (data: { timestamp: string }) => void;
  /** Callback when submit event occurs */
  onSubmit?: (data: { timestamp: string; formData: Record<string, any> }) => void;
  /** Callback when success event occurs */
  onSuccess?: (data: { timestamp: string; formData: Record<string, any>; response: any }) => void;
  /** Callback when error event occurs */
  onError?: (data: { timestamp: string; formData: Record<string, any>; error: Error }) => void;
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
  /** Event bus */
  eventManager: typeof eventBus;
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
    resendAudienceId,
    resendProxyEndpoint,
    webhookProxyEndpoint,
    apiKey,
    analytics,
    webhooks,
    onView,
    onSubmit,
    onSuccess,
    onError,
  } = options;

  // Initialize Resend audience hook - only if resendAudienceId is provided
  const resendAudience = resendAudienceId ? useResendAudience({
    apiKey,
    audienceId: resendAudienceId,
    proxyEndpoint: resendProxyEndpoint,
  }) : null;

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
  
  // Register event handlers
  useEffect(() => {
    // View event handler
    const viewHandler = (data: WaitlistEventData) => {
      if (onView) {
        onView({ timestamp: data.timestamp });
      }
    };
    
    // Submit event handler
    const submitHandler = (data: WaitlistEventData) => {
      if (onSubmit && data.formData) {
        onSubmit({ timestamp: data.timestamp, formData: data.formData });
      }
    };
    
    // Success event handler
    const successHandler = (data: WaitlistEventData) => {
      if (onSuccess && data.formData && data.response) {
        onSuccess({ 
          timestamp: data.timestamp, 
          formData: data.formData, 
          response: data.response 
        });
      }
    };
    
    // Error event handler
    const errorHandler = (data: WaitlistEventData) => {
      if (onError && data.formData && data.error) {
        onError({ 
          timestamp: data.timestamp, 
          formData: data.formData, 
          error: new Error(data.error.message) 
        });
      }
    };
    
    // Subscribe to events
    const unsubscribeView = eventBus.subscribe('field_focus', viewHandler);
    const unsubscribeSubmit = eventBus.subscribe('submit', submitHandler);
    const unsubscribeSuccess = eventBus.subscribe('success', successHandler);
    const unsubscribeError = eventBus.subscribe('error', errorHandler);
    
    // Unsubscribe when component unmounts
    return () => {
      unsubscribeView();
      unsubscribeSubmit();
      unsubscribeSuccess();
      unsubscribeError();
    };
  }, [onView, onSubmit, onSuccess, onError]);
  
  // Track view event
  useEffect(() => {
    // Track analytics event
    trackEvent(analytics, { event: 'field_focus' });
    
    // Send webhooks
    sendWebhooks(webhooks, 'field_focus', {}, undefined, undefined, webhookProxyEndpoint);
    
    // Emit view event
    eventBus.emit({
      type: 'field_focus',
      timestamp: new Date().toISOString(),
    });
  }, [analytics, webhooks, webhookProxyEndpoint]);
  
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
      const result = validateForm({ [name]: newValue }, [field]);
      setValidationResults((prev) => ({
        ...prev,
        ...result,
      }));
    }
    
    // Track focus event (only once per field)
    if (name === 'email' && !formValues[name]) {
      trackEvent(analytics, { 
        event: 'field_focus',
        properties: { field: name }
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set submitting state
    setFormState('submitting');
    
    // Track submit event
    trackEvent(analytics, { event: 'submit', properties: formValues });
    
    // Send webhooks
    sendWebhooks(webhooks, 'submit', formValues, undefined, undefined, webhookProxyEndpoint);
    
    // Emit submit event
    eventBus.emit({
      type: 'submit',
      timestamp: new Date().toISOString(),
      formData: { ...formValues },
    });
    
    // Validate all fields
    const results = validateForm(formValues, fields);
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
      const data = await resendAudience?.addContact(contactData);
      
      // Set success state
      setFormState('success');
      
      // Emit success event
      eventBus.emit({
        type: 'success',
        timestamp: new Date().toISOString(),
        formData: { ...formValues },
        response: data,
      });
      
      // Track success event
      trackEvent(analytics, { 
        event: 'success',
        properties: { 
          email: formValues[resendMapping?.email || 'email'] 
        }
      });
      
      // Send webhooks
      sendWebhooks(webhooks, 'success', formValues, data, undefined, webhookProxyEndpoint);
    } catch (error) {
      // Set error state
      setFormState('error');
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      
      // Send webhooks
      sendWebhooks(
        webhooks, 
        'error', 
        formValues, 
        undefined, 
        error instanceof Error ? error : new Error(errorMsg),
        webhookProxyEndpoint
      );
      
      // Emit error event
      eventBus.emit({
        type: 'error',
        timestamp: new Date().toISOString(),
        formData: { ...formValues },
        error: {
          message: errorMsg,
          code: error instanceof Error ? (error as any).code : undefined,
        },
      });
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
    eventManager: eventBus,
  };
}; 