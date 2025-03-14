import { WaitlistEventType } from './events';
import React from 'react';

/**
 * Field types supported by the waitlist form
 */
export type FieldType = 'text' | 'email' | 'select' | 'checkbox';

/**
 * Field definition for the waitlist form
 */
export interface Field {
  /** Unique name for the field */
  name: string;
  /** Type of field */
  type: FieldType;
  /** Label to display */
  label: string;
  /** Whether the field is required */
  required: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Default value */
  defaultValue?: string | boolean;
  /** Options for select fields */
  options?: string[];
  /** Whether this field should be sent as metadata to Resend */
  metadata?: boolean;
}

/**
 * Event data structure for waitlist events
 */
export interface WaitlistEventData {
  /** Type of event */
  type: WaitlistEventType;
  /** Timestamp of the event */
  timestamp: string;
  /** Field name (for field_focus events) */
  field?: string;
  /** Form data (for submit, success, error events) */
  formData?: Record<string, any>;
  /** Response from API (for success events) */
  response?: any;
  /** Error information (for error events) */
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    error?: string;
    success?: string;
    gray?: {
      [key: string]: string;
    };
  };
  typography?: {
    fontFamily?: string;
    fontSizes?: {
      xs?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
    };
    fontWeights?: {
      regular?: number;
      medium?: number;
      bold?: number;
    };
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  borders?: {
    radius?: {
      sm?: string;
      md?: string;
      lg?: string;
      full?: string;
    };
  };
  animation?: {
    enabled?: boolean;
    duration?: string;
    easing?: string;
    effects?: {
      fadeIn?: boolean;
      slideIn?: boolean;
      hover?: boolean;
      focus?: boolean;
      loading?: boolean;
      success?: boolean;
    };
  };
  components?: {
    container?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
    form?: React.CSSProperties;
    fieldContainer?: React.CSSProperties;
    label?: React.CSSProperties;
    required?: React.CSSProperties;
    input?: React.CSSProperties;
    inputError?: React.CSSProperties;
    checkboxContainer?: React.CSSProperties;
    checkbox?: React.CSSProperties;
    checkboxLabel?: React.CSSProperties;
    errorMessage?: React.CSSProperties;
    formError?: React.CSSProperties;
    button?: React.CSSProperties;
    buttonLoading?: React.CSSProperties;
    successContainer?: React.CSSProperties;
    successTitle?: React.CSSProperties;
    successDescription?: React.CSSProperties;
  };
  framework?: {
    type?: string;
    config?: any;
  };
}

/**
 * Security configuration
 */
export interface SecurityConfig {
  /** Enable honeypot field to detect bots */
  enableHoneypot?: boolean;
  /** Check submission time to detect bots */
  checkSubmissionTime?: boolean;
  /** Enable reCAPTCHA */
  enableReCaptcha?: boolean;
  /** reCAPTCHA site key */
  reCaptchaSiteKey?: string;
}

/**
 * Analytics configuration (stub)
 * This is a placeholder to maintain compatibility with existing code
 */
export interface AnalyticsConfig {
  /** Whether to enable analytics (always false) */
  enabled?: boolean;
  /** Placeholder for events to track */
  trackEvents?: WaitlistEventType[];
  /** Placeholder for integrations */
  integrations?: Record<string, any>;
}

/**
 * Mapping configuration for Resend API
 */
export interface ResendMapping {
  /** Field to use for email */
  email?: string;
  /** Field to use for first name */
  firstName?: string;
  /** Field to use for last name */
  lastName?: string;
  /** Fields to send as metadata */
  metadata?: string[];
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  /** URL to send the webhook to */
  url: string;
  /** Events that trigger this webhook */
  events?: WaitlistEventType[];
  /** Custom headers to include with the webhook request */
  headers?: Record<string, string>;
  /** Whether to include all form fields in the webhook payload */
  includeAllFields?: boolean;
  /** Specific fields to include in the webhook payload */
  includeFields?: string[];
}

/**
 * Accessibility configuration
 */
export interface A11yConfig {
  /** Whether to announce status changes to screen readers */
  announceStatus?: boolean;
  /** Whether to use high contrast mode */
  highContrast?: boolean;
  /** Whether to reduce motion */
  reduceMotion?: boolean;
  /** Alternative property for reducedMotion that can be 'auto' */
  reducedMotion?: 'auto' | boolean;
  /** Labels for screen readers */
  labels?: {
    form?: string;
    submitButton?: string;
    successMessage?: string;
    errorMessage?: string;
  };
  /** Alternative property for labels */
  ariaLabels?: {
    form?: string;
    emailField?: string;
    submitButton?: string;
    successMessage?: string;
    errorMessage?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Framework adapter configuration
 */
export interface FrameworkConfig {
  /** Name of the framework */
  name: 'tailwind' | 'material-ui' | 'chakra-ui' | 'bootstrap' | string;
  /** Custom adapter function */
  adapter?: (theme: ThemeConfig) => ThemeConfig;
}

/**
 * Waitlist form props
 */
export interface WaitlistProps {
  /** Resend API key (only use in server components or with proxy) */
  apiKey?: string;
  /** Resend Audience ID */
  resendAudienceId?: string;
  /** Endpoint for Resend proxy API (for client-side usage) */
  resendProxyEndpoint?: string;
  /** Endpoint for webhook proxy API (for client-side usage) */
  webhookProxyEndpoint?: string;
  /** Endpoint for reCAPTCHA proxy API (for client-side usage) */
  recaptchaProxyEndpoint?: string;
  /** Title of the form */
  title?: string;
  /** Description of the form */
  description?: string;
  /** Text for the submit button */
  submitText?: string;
  /** Title for the success message */
  successTitle?: string;
  /** Description for the success message */
  successDescription?: string;
  /** Fields to collect */
  fields?: Field[];
  /** Theme configuration */
  theme?: ThemeConfig;
  /** Framework configuration for adapting the theme */
  frameworkConfig?: FrameworkConfig;
  /** Security configuration */
  security?: SecurityConfig;
  /** Analytics configuration */
  analytics?: AnalyticsConfig;
  /** Mapping to Resend API fields */
  resendMapping?: ResendMapping;
  /** Webhook configuration */
  webhooks?: WebhookConfig[];
  /** Accessibility configuration */
  a11y?: A11yConfig;
  /** Callback when field is focused */
  onFieldFocus?: (data: { field: string; timestamp: string }) => void;
  /** Callback when form is submitted */
  onSubmit?: (data: { timestamp: string; formData: Record<string, any> }) => void;
  /** Callback when submission is successful */
  onSuccess?: (data: { timestamp: string; formData: Record<string, any>; response: any }) => Promise<{ success: boolean; error?: string }>;
  /** Callback when submission fails */
  onError?: (data: { timestamp: string; formData: Record<string, any>; error: Error }) => void;
  /** Additional class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
} 