import { CSSProperties } from 'react';

/**
 * Animation types
 */
export type AnimationType = 'fade' | 'slide' | 'fadeSlide' | 'scale' | 'none';

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Type of animation */
  type?: AnimationType;
  /** Duration in milliseconds */
  duration?: number;
  /** Easing function */
  easing?: string;
  /** Delay in milliseconds */
  delay?: number;
}

/**
 * Default animation configuration
 */
export const defaultAnimation: AnimationConfig = {
  type: 'fadeSlide',
  duration: 300,
  easing: 'ease-in-out',
  delay: 0,
};

/**
 * Get animation styles based on configuration and state
 */
export const getAnimationStyles = (
  config: AnimationConfig = defaultAnimation,
  state: 'enter' | 'exit' = 'enter',
  prefersReducedMotion = false
): CSSProperties => {
  // If reduced motion is preferred, return minimal animation
  if (prefersReducedMotion) {
    return {
      transition: 'opacity 0.1s ease',
    };
  }

  const { type, duration, easing, delay } = {
    ...defaultAnimation,
    ...config,
  };

  // Base transition style
  const baseStyle: CSSProperties = {
    transition: `all ${duration}ms ${easing} ${delay}ms`,
  };

  // If no animation, return empty styles
  if (type === 'none') {
    return {};
  }

  // Animation-specific styles
  switch (type) {
    case 'fade':
      return {
        ...baseStyle,
        opacity: state === 'enter' ? 1 : 0,
      };
    case 'slide':
      return {
        ...baseStyle,
        transform: state === 'enter' ? 'translateY(0)' : 'translateY(20px)',
      };
    case 'fadeSlide':
      return {
        ...baseStyle,
        opacity: state === 'enter' ? 1 : 0,
        transform: state === 'enter' ? 'translateY(0)' : 'translateY(20px)',
      };
    case 'scale':
      return {
        ...baseStyle,
        opacity: state === 'enter' ? 1 : 0,
        transform: state === 'enter' ? 'scale(1)' : 'scale(0.95)',
      };
    default:
      return baseStyle;
  }
}; 