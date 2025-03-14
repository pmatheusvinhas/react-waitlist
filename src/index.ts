/**
 * React Waitlist - A customizable waitlist component for React applications
 * Main entry point for client-side usage
 */

// Import and load fonts
import { loadFonts } from './core/fonts';
loadFonts();

// Export the main WaitlistForm component
export { default as WaitlistForm } from './components/WaitlistForm';

// Export hooks
export { useWaitlistEvents } from './hooks/useWaitlistEvents';

// Export types
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
  materialUIDefaultTheme,
  mergeTheme
} from './core/theme';

// Export animations
export {
  getAnimationStyles
} from './core/animations';
export type { AnimationConfig } from './core/animations';

// Export event types
export type { 
  WaitlistEventType, 
  WaitlistEventData, 
  WaitlistEventHandler 
} from './core/events'; 