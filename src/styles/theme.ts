import { ThemeConfig } from '../types';

/**
 * Default theme configuration
 */
export const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#3182CE', // Blue
    secondary: '#805AD5', // Purple
    background: '#FFFFFF', // White
    text: '#1A202C', // Dark gray
    error: '#E53E3E', // Red
    success: '#38A169', // Green
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
  },
  borders: {
    radius: {
      sm: '0.125rem', // 2px
      md: '0.25rem', // 4px
      lg: '0.5rem', // 8px
      full: '9999px',
    },
  },
};

/**
 * Merge user theme with default theme
 */
export const mergeTheme = (userTheme?: ThemeConfig): ThemeConfig => {
  if (!userTheme) return defaultTheme;

  return {
    colors: {
      ...defaultTheme.colors,
      ...userTheme.colors,
      gray: {
        ...defaultTheme.colors?.gray,
        ...userTheme.colors?.gray,
      },
    },
    typography: {
      ...defaultTheme.typography,
      ...userTheme.typography,
      fontSizes: {
        ...defaultTheme.typography?.fontSizes,
        ...userTheme.typography?.fontSizes,
      },
      fontWeights: {
        ...defaultTheme.typography?.fontWeights,
        ...userTheme.typography?.fontWeights,
      },
    },
    spacing: {
      ...defaultTheme.spacing,
      ...userTheme.spacing,
    },
    borders: {
      ...defaultTheme.borders,
      radius: {
        ...defaultTheme.borders?.radius,
        ...userTheme.borders?.radius,
      },
    },
  };
}; 