import { CSSProperties } from 'react';
import { ThemeConfig } from '../types';

/**
 * Animation configuration
 */
export interface AnimationConfig {
  enabled?: boolean;
  duration?: string;
  easing?: string;
  type?: 'fade' | 'slide' | 'scale' | 'none';
  effects?: {
    hover?: boolean;
    focus?: boolean;
    loading?: boolean;
    success?: boolean;
  };
}

/**
 * Default animation configuration
 */
export const defaultAnimation: AnimationConfig = {
  enabled: true,
  duration: '0.3s',
  easing: 'ease-in-out',
  type: 'fade',
  effects: {
    hover: true,
    focus: true,
    loading: true,
    success: true,
  },
};

/**
 * Get animation styles based on animation configuration and reduced motion preference
 */
export const getAnimationStyles = (
  config: AnimationConfig = defaultAnimation,
  reducedMotion: boolean = false
): Record<string, CSSProperties> => {
  // If animations are disabled or reduced motion is preferred, return empty styles
  if (!config.enabled || reducedMotion || config.type === 'none') {
    return {
      fadeIn: {},
      fadeOut: {},
      slideIn: {},
      slideOut: {},
      scaleIn: {},
      scaleOut: {},
      pulse: {},
      spin: {},
    };
  }

  const duration = config.duration || '0.3s';
  const easing = config.easing || 'ease-in-out';

  return {
    fadeIn: {
      animation: `fadeIn ${duration} ${easing}`,
      opacity: 1,
    },
    fadeOut: {
      animation: `fadeOut ${duration} ${easing}`,
      opacity: 0,
    },
    slideIn: {
      animation: `slideIn ${duration} ${easing}`,
      transform: 'translateY(0)',
    },
    slideOut: {
      animation: `slideOut ${duration} ${easing}`,
      transform: 'translateY(20px)',
    },
    scaleIn: {
      animation: `scaleIn ${duration} ${easing}`,
      transform: 'scale(1)',
    },
    scaleOut: {
      animation: `scaleOut ${duration} ${easing}`,
      transform: 'scale(0.95)',
    },
    pulse: {
      animation: `pulse 2s ${easing} infinite`,
    },
    spin: {
      animation: `spin 1s linear infinite`,
    },
  };
};

/**
 * Generate CSS keyframes for animations
 */
export const generateAnimationKeyframes = (): string => {
  return `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(20px); opacity: 0; }
    }
    
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes scaleOut {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(0.95); opacity: 0; }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
};

/**
 * Get hover effect styles based on theme configuration
 */
export const getHoverEffects = (theme: ThemeConfig): Record<string, CSSProperties> => {
  if (!theme.animation?.effects?.hover) {
    return {};
  }

  return {
    buttonHover: {
      backgroundColor: theme.colors?.secondary || '#805AD5',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    inputHover: {
      borderColor: theme.colors?.primary || '#3182CE',
    },
  };
}; 