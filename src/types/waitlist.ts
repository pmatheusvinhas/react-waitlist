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
  // New properties for framework integration
  framework?: {
    type: 'tailwind' | 'material-ui' | 'custom';
    config?: any; // Framework-specific configuration
  };
  // Component-specific styling
  components?: {
    container?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
    form?: React.CSSProperties;
    fieldContainer?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
    inputError?: React.CSSProperties;
    checkboxContainer?: React.CSSProperties;
    checkbox?: React.CSSProperties;
    checkboxLabel?: React.CSSProperties;
    button?: React.CSSProperties;
    buttonLoading?: React.CSSProperties;
    errorMessage?: React.CSSProperties;
    formError?: React.CSSProperties;
    required?: React.CSSProperties;
    successContainer?: React.CSSProperties;
    successTitle?: React.CSSProperties;
    successDescription?: React.CSSProperties;
  };
  // Advanced styling options
  animation?: {
    enabled?: boolean;
    duration?: string;
    easing?: string;
    effects?: {
      hover?: boolean;
      focus?: boolean;
      loading?: boolean;
      success?: boolean;
    };
  };
}

/**
 * Accessibility configuration
 */
export interface A11yConfig {
  /** Whether to announce status changes to screen readers */
  announceStatus?: boolean;
  /** Whether to use high contrast mode */
  highContrast?: boolean;
  /** Whether to respect reduced motion preferences */
  reducedMotion?: 'auto' | boolean;
  /** Custom ARIA labels */
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
 * Security configuration
 */
export interface SecurityConfig {
  /** Whether to enable reCAPTCHA */
  enableReCaptcha?: boolean;
  /** reCAPTCHA site key */
  reCaptchaSiteKey?: string;
  /** reCAPTCHA min score (0.0 to 1.0) */
  reCaptchaMinScore?: number;
  /** Whether to enable honeypot */
  enableHoneypot?: boolean;
  /** Whether to check for submission time (bot detection) */
  checkSubmissionTime?: boolean;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  /** Whether to enable analytics */
  enabled?: boolean;
  /** Events to track */
  trackEvents?: ('view' | 'focus' | 'submit' | 'success' | 'error')[];
  /** Integration with analytics tools */
  integrations?: {
    googleAnalytics?: boolean;
    mixpanel?: string;
    posthog?: string;
    [key: string]: boolean | string | undefined;
  };
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
 * Events that can trigger webhooks
 */
export type WebhookEvent = 'view' | 'submit' | 'success' | 'error';

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  /** URL to send the webhook to */
  url: string;
  /** Events that trigger this webhook */
  events?: WebhookEvent[];
  /** Custom headers to include with the webhook request */
  headers?: Record<string, string>;
  /** Whether to include all form fields in the webhook payload */
  includeAllFields?: boolean;
  /** Specific fields to include in the webhook payload (if includeAllFields is false) */
  includeFields?: string[];
  /** Whether to retry failed webhook requests */
  retry?: boolean;
  /** Maximum number of retry attempts */
  maxRetries?: number;
}

/**
 * Props for the Waitlist component
 */
export interface WaitlistProps {
  /** Resend API key (only use in server components or with proxy) */
  apiKey?: string;
  /** Resend Audience ID */
  resendAudienceId?: string;
  /** Endpoint for Resend proxy API (for client-side usage) */
  resendProxyEndpoint?: string;
  /** Endpoint for webhook proxy API (for secure webhook delivery) */
  webhookProxyEndpoint?: string;
  /** Endpoint for reCAPTCHA proxy API (for secure verification) */
  recaptchaProxyEndpoint?: string;
  /** Title of the waitlist form */
  title?: string;
  /** Description text */
  description?: string;
  /** Text for the submit button */
  submitText?: string;
  /** Success title */
  successTitle?: string;
  /** Success description */
  successDescription?: string;
  /** Fields to collect */
  fields?: Field[];
  /** Theme configuration */
  theme?: ThemeConfig;
  /** Framework configuration (for Tailwind, Material UI, etc.) */
  frameworkConfig?: any;
  /** Accessibility configuration */
  a11y?: A11yConfig;
  /** Security configuration */
  security?: SecurityConfig;
  /** Analytics configuration */
  analytics?: AnalyticsConfig;
  /** Mapping to Resend API fields */
  resendMapping?: ResendMapping;
  /** Webhook configuration */
  webhooks?: WebhookConfig[];
  /** Callback when view event occurs */
  onView?: (data: { timestamp: string }) => void;
  /** Callback when submit event occurs */
  onSubmit?: (data: { timestamp: string; formData: Record<string, any> }) => void;
  /** Callback when success event occurs */
  onSuccess?: (data: { timestamp: string; formData: Record<string, any>; response: any }) => Promise<{ success: boolean; data?: any; error?: string }>;
  /** Callback when error event occurs */
  onError?: (data: { timestamp: string; formData: Record<string, any>; error: Error }) => void;
  /** Custom CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}