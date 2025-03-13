import { WaitlistEventType, WaitlistEventData } from './events';
import { AnalyticsConfig } from './types';

/**
 * Track an event with the configured analytics providers
 */
export const trackEvent = (
  config: AnalyticsConfig | undefined,
  event: { event: string; properties?: Record<string, any> }
): void => {
  if (!config || config.enabled === false) {
    return;
  }

  const { event: eventName, properties = {} } = event;

  // Check if this event type should be tracked
  if (config.trackEvents && !config.trackEvents.includes(eventName as any)) {
    return;
  }

  // Track with Google Analytics
  if (config.integrations?.googleAnalytics && typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }

  // Track with Mixpanel
  if (config.integrations?.mixpanel && typeof window !== 'undefined' && (window as any).mixpanel) {
    (window as any).mixpanel.track(eventName, properties);
  }

  // Track with PostHog
  if (config.integrations?.posthog && typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(eventName, properties);
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, properties);
  }
};

/**
 * Track an event with Google Analytics
 */
const trackGoogleAnalytics = (
  event: string,
  properties?: Record<string, any>
): void => {
  // Check if GA is available
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }
  
  try {
    window.gtag('event', event, properties);
  } catch (error) {
    console.error('Error tracking Google Analytics event:', error);
  }
};

/**
 * Track an event with Mixpanel
 */
const trackMixpanel = (
  token: string,
  event: string,
  properties?: Record<string, any>
): void => {
  // Check if Mixpanel is available
  if (typeof window === 'undefined' || !window.mixpanel) {
    return;
  }
  
  try {
    // Initialize Mixpanel if not already initialized
    if (!window.mixpanel.get_distinct_id) {
      window.mixpanel.init(token);
    }
    
    window.mixpanel.track(event, properties);
  } catch (error) {
    console.error('Error tracking Mixpanel event:', error);
  }
};

/**
 * Track an event with PostHog
 */
const trackPostHog = (
  token: string,
  event: string,
  properties?: Record<string, any>
): void => {
  // Check if PostHog is available
  if (typeof window === 'undefined' || !window.posthog) {
    return;
  }
  
  try {
    // Initialize PostHog if not already initialized
    if (!window.posthog.get_distinct_id) {
      window.posthog.init(token);
    }
    
    window.posthog.capture(event, properties);
  } catch (error) {
    console.error('Error tracking PostHog event:', error);
  }
};

// Add type definitions for analytics libraries
declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: any) => void;
    mixpanel?: {
      init: (token: string) => void;
      track: (event: string, properties?: any) => void;
      get_distinct_id?: () => string;
    };
    posthog?: {
      init: (token: string) => void;
      capture: (event: string, properties?: any) => void;
      get_distinct_id?: () => string;
    };
  }
} 