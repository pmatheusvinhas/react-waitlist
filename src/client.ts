/**
 * Client-side component for React Waitlist
 * This file is specifically for use with SSR frameworks
 */

export { default as ClientWaitlist } from './components/ClientWaitlist';

// Export types needed for the client component
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

// Export themes
export { 
  defaultTheme, 
  tailwindDefaultTheme, 
  materialUIDefaultTheme 
} from './styles';

// Export event types
export type { 
  WaitlistEventType, 
  WaitlistEventData, 
  WaitlistEventHandler 
} from './core/events'; 