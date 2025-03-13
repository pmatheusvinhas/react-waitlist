import React, { createContext, useContext, ReactNode } from 'react';
import { A11yConfig } from '../core/types';

/**
 * Default ARIA labels
 */
const defaultAriaLabels = {
  form: 'Waitlist signup form',
  emailField: 'Your email address',
  submitButton: 'Join the waitlist',
  successMessage: 'Successfully joined the waitlist',
  errorMessage: 'Error joining the waitlist',
};

/**
 * Context for ARIA attributes and accessibility features
 */
interface AriaContextType {
  /** Whether to announce status changes to screen readers */
  announceStatus: boolean;
  /** Whether to use high contrast mode */
  highContrast: boolean;
  /** Whether to respect reduced motion preferences */
  reducedMotion: 'auto' | boolean;
  /** ARIA labels for various elements */
  ariaLabels: {
    form: string;
    emailField: string;
    submitButton: string;
    successMessage: string;
    errorMessage: string;
    [key: string]: string;
  };
  /** Announce a message to screen readers */
  announce: (message: string, assertive?: boolean) => void;
}

/**
 * Create the ARIA context
 */
const AriaContext = createContext<AriaContextType>({
  announceStatus: true,
  highContrast: false,
  reducedMotion: 'auto',
  ariaLabels: defaultAriaLabels,
  announce: () => {},
});

/**
 * Props for the AriaProvider component
 */
interface AriaProviderProps {
  /** Accessibility configuration */
  config?: A11yConfig;
  /** Children components */
  children: ReactNode;
}

/**
 * Provider component for accessibility features
 */
export const AriaProvider: React.FC<AriaProviderProps> = ({
  config,
  children,
}) => {
  // Merge user config with defaults
  const mergedConfig = {
    announceStatus: config?.announceStatus ?? true,
    highContrast: config?.highContrast ?? false,
    reducedMotion: config?.reducedMotion ?? config?.reduceMotion ?? 'auto',
    ariaLabels: {
      ...defaultAriaLabels,
      ...(config?.ariaLabels || config?.labels),
    },
  };

  /**
   * Announce a message to screen readers
   */
  const announce = (message: string, assertive = false) => {
    if (!mergedConfig.announceStatus) return;

    // Create or get the live region element
    let liveRegion = document.getElementById(
      assertive ? 'aria-live-assertive' : 'aria-live-polite'
    );

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = assertive ? 'aria-live-assertive' : 'aria-live-polite';
      liveRegion.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.position = 'absolute';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.padding = '0';
      liveRegion.style.margin = '-1px';
      liveRegion.style.overflow = 'hidden';
      liveRegion.style.clip = 'rect(0, 0, 0, 0)';
      liveRegion.style.whiteSpace = 'nowrap';
      liveRegion.style.border = '0';
      document.body.appendChild(liveRegion);
    }

    // Update the live region with the new message
    liveRegion.textContent = message;

    // Clear the message after a delay
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, 5000);
  };

  // Context value
  const contextValue: AriaContextType = {
    ...mergedConfig,
    announce,
  };

  return (
    <AriaContext.Provider value={contextValue}>{children}</AriaContext.Provider>
  );
};

/**
 * Hook to use ARIA context
 */
export const useAria = (): AriaContextType => {
  const context = useContext(AriaContext);
  if (!context) {
    throw new Error('useAria must be used within an AriaProvider');
  }
  return context;
}; 