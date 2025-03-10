import { AnalyticsConfig } from '../types';

/**
 * Event types that can be tracked
 */
export type EventType = 'view' | 'focus' | 'submit' | 'success' | 'error';

/**
 * Event data for analytics
 */
export interface EventData {
  /** Event type */
  event: EventType;
  /** Additional properties */
  properties?: Record<string, any>;
}

/**
 * Track an event with analytics providers
 */
export const trackEvent = (
  config: AnalyticsConfig | undefined,
  eventData: EventData
): void => {
  if (!config?.enabled) return;
  
  // Check if this event type should be tracked
  if (
    config.trackEvents &&
    !config.trackEvents.includes(eventData.event)
  ) {
    return;
  }
  
  // Prepare event data
  const { event, properties } = eventData;
  
  // Track with Google Analytics if enabled
  if (config.integrations?.googleAnalytics) {
    trackGoogleAnalytics(event, properties);
  }
  
  // Track with Mixpanel if enabled
  if (config.integrations?.mixpanel) {
    trackMixpanel(config.integrations.mixpanel, event, properties);
  }
  
  // Track with PostHog if enabled
  if (config.integrations?.posthog) {
    trackPostHog(config.integrations.posthog, event, properties);
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event}`, properties);
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