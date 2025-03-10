import { useEffect, useState } from 'react';
import { useAria } from './AriaProvider';

/**
 * Hook to handle reduced motion preferences
 */
export const useReducedMotion = (): boolean => {
  const { reducedMotion } = useAria();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // If explicitly set, use that value
    if (typeof reducedMotion === 'boolean') {
      setPrefersReducedMotion(reducedMotion);
      return;
    }

    // Check if window.matchMedia is available (for testing environments)
    if (typeof window !== 'undefined' && window.matchMedia) {
      // Otherwise, check user's system preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      // Listen for changes
      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };

      // Add event listener with modern API if available
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
    
    // Default to false in environments without matchMedia
    return undefined;
  }, [reducedMotion]);

  return prefersReducedMotion;
};

/**
 * Hook to handle high contrast preferences
 */
export const useHighContrast = (): boolean => {
  const { highContrast } = useAria();
  const [prefersHighContrast, setPrefersHighContrast] = useState<boolean>(false);

  useEffect(() => {
    // If explicitly set, use that value
    if (highContrast) {
      setPrefersHighContrast(true);
      return;
    }

    // Check if window.matchMedia is available (for testing environments)
    if (typeof window !== 'undefined' && window.matchMedia) {
      // Check user's system preference if available
      const mediaQuery = window.matchMedia('(prefers-contrast: more)');
      setPrefersHighContrast(mediaQuery.matches);

      // Listen for changes
      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersHighContrast(event.matches);
      };

      // Add event listener with modern API if available
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
    
    // Default to false in environments without matchMedia
    return undefined;
  }, [highContrast]);

  return prefersHighContrast;
};

/**
 * Hook to get ARIA labels
 */
export const useAriaLabels = () => {
  const { ariaLabels } = useAria();
  return ariaLabels;
};

/**
 * Hook to announce messages to screen readers
 */
export const useAnnounce = () => {
  const { announce } = useAria();
  return announce;
}; 