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
 * Props for the Waitlist component
 */
export interface WaitlistProps {
  /** Resend API key (only use in server components or with proxy) */
  apiKey?: string;
  /** Audience ID from Resend */
  audienceId: string;
  /** Endpoint for proxy API (for client-side usage) */
  proxyEndpoint?: string;
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
  /** Accessibility configuration */
  a11y?: A11yConfig;
  /** Security configuration */
  security?: SecurityConfig;
  /** Analytics configuration */
  analytics?: AnalyticsConfig;
  /** Mapping to Resend API fields */
  resendMapping?: ResendMapping;
  /** Callback when submission is successful */
  onSuccess?: (data: any) => void;
  /** Callback when submission fails */
  onError?: (error: Error) => void;
  /** Custom CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
} 