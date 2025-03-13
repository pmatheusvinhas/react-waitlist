/**
 * Server-side components and utilities for React Waitlist
 * This file is specifically for use with SSR frameworks
 */

// Export the server component
export { default as ServerWaitlist } from './components/ServerWaitlist';

// Export server utilities
export { createResendProxy } from './server/proxy';
export type { ResendProxyConfig } from './server/proxy';
export { createWebhookProxy } from './server/webhookProxy';
export type { WebhookProxyConfig } from './server/webhookProxy';

// Export types needed for the server component
export type { 
  Field, 
  WaitlistProps, 
  ThemeConfig, 
  SecurityConfig, 
  AnalyticsConfig, 
  ResendMapping, 
  WebhookConfig, 
  A11yConfig, 
  FrameworkConfig
} from './core/types';

// Export ServerWaitlistProps from the component file
export type { ServerWaitlistProps } from './components/ServerWaitlist'; 