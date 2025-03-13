import { ThemeConfig } from '../core/types';

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
  // Component-specific styling
  components: {
    container: {
      padding: '1.5rem',
      borderRadius: '0.5rem',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#1A202C',
      marginBottom: '0.75rem',
    },
    description: {
      fontSize: '1rem',
      color: '#4A5568',
      marginBottom: '1.5rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    fieldContainer: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#4A5568',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#1A202C',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '0.375rem',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    },
    inputError: {
      borderColor: '#E53E3E',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    checkbox: {
      width: '1rem',
      height: '1rem',
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: '#4A5568',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#FFFFFF',
      backgroundColor: '#3182CE',
      border: '1px solid transparent',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    },
    buttonLoading: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    errorMessage: {
      fontSize: '0.875rem',
      color: '#E53E3E',
      marginTop: '0.5rem',
    },
    formError: {
      padding: '0.75rem 1rem',
      marginBottom: '1rem',
      fontSize: '0.875rem',
      color: '#E53E3E',
      backgroundColor: 'rgba(229, 62, 62, 0.1)',
      borderRadius: '0.375rem',
      border: '1px solid rgba(229, 62, 62, 0.2)',
    },
    required: {
      color: '#E53E3E',
      marginLeft: '0.25rem',
    },
    successContainer: {
      textAlign: 'center',
      padding: '2rem 1rem',
    },
    successTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#38A169',
      marginBottom: '0.75rem',
    },
    successDescription: {
      fontSize: '1rem',
      color: '#4A5568',
    },
  },
  // Animation configuration
  animation: {
    enabled: true,
    duration: '0.3s',
    easing: 'ease-in-out',
    effects: {
      hover: true,
      focus: true,
      loading: true,
      success: true,
    },
  },
};

/**
 * Tailwind CSS theme
 */
export const tailwindDefaultTheme: ThemeConfig = {
  colors: {
    primary: '#6366F1', // Indigo-500
    secondary: '#8B5CF6', // Violet-500
    background: '#FFFFFF', // White
    text: '#1F2937', // Gray-800
    error: '#EF4444', // Red-500
    success: '#10B981', // Emerald-500
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
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
      md: '0.375rem', // 6px
      lg: '0.5rem', // 8px
      full: '9999px',
    },
  },
  // Component-specific styling for Tailwind
  components: {
    container: {
      padding: '1.5rem',
      borderRadius: '0.5rem',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#1F2937',
      marginBottom: '0.75rem',
    },
    description: {
      fontSize: '1rem',
      color: '#4B5563',
      marginBottom: '1.5rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    fieldContainer: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#4B5563',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#1F2937',
      backgroundColor: '#F9FAFB',
      border: '1px solid #E5E7EB',
      borderRadius: '0.375rem',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    },
    inputError: {
      borderColor: '#EF4444',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    checkbox: {
      width: '1rem',
      height: '1rem',
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: '#4B5563',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#FFFFFF',
      backgroundColor: '#6366F1',
      border: '1px solid transparent',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    },
    buttonLoading: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    errorMessage: {
      fontSize: '0.875rem',
      color: '#EF4444',
      marginTop: '0.5rem',
    },
    formError: {
      padding: '0.75rem 1rem',
      marginBottom: '1rem',
      fontSize: '0.875rem',
      color: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '0.375rem',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    required: {
      color: '#EF4444',
      marginLeft: '0.25rem',
    },
    successContainer: {
      textAlign: 'center',
      padding: '2rem 1rem',
    },
    successTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#10B981',
      marginBottom: '0.75rem',
    },
    successDescription: {
      fontSize: '1rem',
      color: '#4B5563',
    },
  },
  // Animation configuration
  animation: {
    enabled: true,
    duration: '0.2s',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    effects: {
      hover: true,
      focus: true,
      loading: true,
      success: true,
    },
  },
  // Framework configuration
  framework: {
    type: 'tailwind',
  },
};

/**
 * Material UI theme
 */
export const materialUIDefaultTheme: ThemeConfig = {
  colors: {
    primary: '#3f51b5', // Indigo
    secondary: '#f50057', // Pink
    background: '#FFFFFF', // White
    text: '#212121', // Dark gray
    error: '#f44336', // Red
    success: '#4caf50', // Green
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.25rem', // 20px
      xl: '1.5rem', // 24px
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.5rem', // 8px
    sm: '1rem', // 16px
    md: '1.5rem', // 24px
    lg: '2rem', // 32px
    xl: '3rem', // 48px
  },
  borders: {
    radius: {
      sm: '0.125rem', // 2px
      md: '0.25rem', // 4px
      lg: '0.5rem', // 8px
      full: '9999px',
    },
  },
  // Component-specific styling for Material UI
  components: {
    container: {
      padding: '1.5rem',
      borderRadius: '0.25rem',
      backgroundColor: '#FFFFFF',
      boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#212121',
      marginBottom: '0.75rem',
    },
    description: {
      fontSize: '1rem',
      color: '#757575',
      marginBottom: '1.5rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    fieldContainer: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#757575',
      marginBottom: '0.5rem',
      transition: 'color 0.2s ease',
    },
    input: {
      width: '100%',
      padding: '0.75rem 0.75rem',
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#212121',
      backgroundColor: '#FFFFFF',
      border: '1px solid #e0e0e0',
      borderRadius: '0.25rem',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    inputError: {
      borderColor: '#f44336',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    checkbox: {
      width: '1.25rem',
      height: '1.25rem',
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: '#757575',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
      color: '#FFFFFF',
      backgroundColor: '#3f51b5',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      transition: 'background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    },
    buttonLoading: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    errorMessage: {
      fontSize: '0.75rem',
      color: '#f44336',
      marginTop: '0.25rem',
    },
    formError: {
      padding: '0.75rem 1rem',
      marginBottom: '1.5rem',
      fontSize: '0.875rem',
      color: '#f44336',
      backgroundColor: 'rgba(244, 67, 54, 0.08)',
      borderRadius: '0.25rem',
      border: 'none',
    },
    required: {
      color: '#f44336',
      marginLeft: '0.25rem',
    },
    successContainer: {
      textAlign: 'center',
      padding: '2rem 1rem',
    },
    successTitle: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#4caf50',
      marginBottom: '1rem',
    },
    successDescription: {
      fontSize: '1rem',
      color: '#757575',
    },
  },
  // Animation configuration
  animation: {
    enabled: true,
    duration: '0.25s',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    effects: {
      hover: true,
      focus: true,
      loading: true,
      success: true,
    },
  },
  // Framework configuration
  framework: {
    type: 'material-ui',
  },
};

/**
 * Merge user theme with default theme
 * This function is updated to handle both old and new theme types during the refactoring process
 */
export function mergeTheme(userTheme?: any): any {
  if (!userTheme) {
    return defaultTheme;
  }

  // Deep merge the themes
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
      ...userTheme.borders,
      radius: {
        ...defaultTheme.borders?.radius,
        ...userTheme.borders?.radius,
      },
    },
    animation: {
      ...defaultTheme.animation,
      ...userTheme.animation,
      effects: {
        ...defaultTheme.animation?.effects,
        ...userTheme.animation?.effects,
      },
    },
    components: {
      ...defaultTheme.components,
      ...userTheme.components,
    },
  };
} 