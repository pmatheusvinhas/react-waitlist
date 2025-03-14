import { ThemeConfig } from './types';
import { fontFamilies } from './fonts';

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
    primary: '#2563EB', // Bright blue
    secondary: '#8B5CF6', // Violet
    background: '#F8FAFC', // Very light blue-gray
    text: '#0F172A', // Very dark blue-gray
    error: '#DC2626', // Bright red
    success: '#16A34A', // Bright green
    gray: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: fontFamilies.inter,
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
      padding: '2rem',
      borderRadius: '0.75rem',
      backgroundColor: '#F8FAFC',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 800,
      color: '#0F172A',
      marginBottom: '1rem',
    },
    description: {
      fontSize: '1.125rem',
      color: '#334155',
      marginBottom: '2rem',
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
      fontWeight: 600,
      color: '#475569',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#0F172A',
      backgroundColor: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderRadius: '0.5rem',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    inputError: {
      borderColor: '#DC2626',
      boxShadow: '0 0 0 1px #DC2626',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    checkbox: {
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '0.25rem',
      border: '2px solid #CBD5E1',
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: '#334155',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.875rem 2rem',
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#FFFFFF',
      backgroundColor: '#2563EB',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)',
    },
    buttonLoading: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    errorMessage: {
      fontSize: '0.875rem',
      color: '#DC2626',
      marginTop: '0.5rem',
      fontWeight: 500,
    },
    formError: {
      padding: '1rem',
      marginBottom: '1.5rem',
      fontSize: '0.875rem',
      color: '#DC2626',
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      borderRadius: '0.5rem',
      border: '1px solid rgba(220, 38, 38, 0.2)',
      fontWeight: 500,
    },
    required: {
      color: '#DC2626',
      marginLeft: '0.25rem',
    },
    successContainer: {
      textAlign: 'center',
      padding: '3rem 2rem',
    },
    successTitle: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#16A34A',
      marginBottom: '1rem',
    },
    successDescription: {
      fontSize: '1.125rem',
      color: '#334155',
      lineHeight: 1.6,
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
    primary: '#9C27B0', // Purple
    secondary: '#FF4081', // Pink accent
    background: '#FAFAFA', // Light gray background
    text: '#212121', // Almost black
    error: '#D32F2F', // Red 700
    success: '#388E3C', // Green 700
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: fontFamilies.roboto,
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
      padding: '2rem',
      borderRadius: '0.25rem',
      backgroundColor: '#FFFFFF',
      boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#212121',
      marginBottom: '1rem',
      letterSpacing: '0.0075em',
    },
    description: {
      fontSize: '1rem',
      color: '#616161',
      marginBottom: '2rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    fieldContainer: {
      marginBottom: '2rem',
      position: 'relative',
    },
    label: {
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: 400,
      color: '#9C27B0',
      marginBottom: '0.5rem',
      letterSpacing: '0.00938em',
      transition: 'color 0.2s ease',
    },
    input: {
      width: '100%',
      padding: '1rem 0.75rem',
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#212121',
      backgroundColor: '#FFFFFF',
      border: 'none',
      borderBottom: '1px solid #9E9E9E',
      borderRadius: '0',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      letterSpacing: '0.00938em',
    },
    inputError: {
      borderBottom: '2px solid #D32F2F',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    checkbox: {
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '0.125rem',
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: '#616161',
      letterSpacing: '0.01071em',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 2rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
      color: '#FFFFFF',
      backgroundColor: '#9C27B0',
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
      color: '#D32F2F',
      marginTop: '0.25rem',
      letterSpacing: '0.03333em',
    },
    formError: {
      padding: '1rem',
      marginBottom: '1.5rem',
      fontSize: '0.875rem',
      color: '#D32F2F',
      backgroundColor: 'rgba(211, 47, 47, 0.08)',
      borderRadius: '0.25rem',
      border: 'none',
      letterSpacing: '0.01071em',
    },
    required: {
      color: '#D32F2F',
      marginLeft: '0.25rem',
    },
    successContainer: {
      textAlign: 'center',
      padding: '3rem 2rem',
    },
    successTitle: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#388E3C',
      marginBottom: '1.5rem',
      letterSpacing: '0.0075em',
    },
    successDescription: {
      fontSize: '1rem',
      color: '#616161',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
  },
  // Animation configuration
  animation: {
    enabled: true,
    duration: '0.3s',
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
 * This function ensures that all required theme properties are present
 * while giving absolute priority to user-defined properties
 */
export function mergeTheme(userTheme?: ThemeConfig): ThemeConfig {
  if (!userTheme) {
    return defaultTheme;
  }

  // Deep merge the themes, prioritizing user properties
  return {
    colors: {
      ...defaultTheme.colors,
      ...userTheme.colors,
      // Only merge gray if user hasn't provided a complete replacement
      gray: userTheme.colors?.gray 
        ? (Object.keys(userTheme.colors.gray).length === 0 
            ? { ...defaultTheme.colors?.gray } 
            : { ...defaultTheme.colors?.gray, ...userTheme.colors.gray })
        : defaultTheme.colors?.gray,
    },
    typography: {
      ...defaultTheme.typography,
      ...userTheme.typography,
      // Only merge nested objects if user hasn't provided a complete replacement
      fontSizes: userTheme.typography?.fontSizes 
        ? { ...defaultTheme.typography?.fontSizes, ...userTheme.typography.fontSizes }
        : defaultTheme.typography?.fontSizes,
      fontWeights: userTheme.typography?.fontWeights 
        ? { ...defaultTheme.typography?.fontWeights, ...userTheme.typography.fontWeights }
        : defaultTheme.typography?.fontWeights,
    },
    spacing: {
      ...defaultTheme.spacing,
      ...userTheme.spacing,
    },
    borders: {
      ...defaultTheme.borders,
      ...userTheme.borders,
      // Only merge radius if user hasn't provided a complete replacement
      radius: userTheme.borders?.radius 
        ? { ...defaultTheme.borders?.radius, ...userTheme.borders.radius }
        : defaultTheme.borders?.radius,
    },
    animation: {
      ...defaultTheme.animation,
      ...userTheme.animation,
      // Only merge effects if user hasn't provided a complete replacement
      effects: userTheme.animation?.effects 
        ? { ...defaultTheme.animation?.effects, ...userTheme.animation.effects }
        : defaultTheme.animation?.effects,
    },
    components: {
      ...defaultTheme.components,
      ...userTheme.components,
    },
    // Preserve any additional properties the user might have added
    ...(Object.keys(userTheme).filter(key => 
      !['colors', 'typography', 'spacing', 'borders', 'animation', 'components'].includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: userTheme[key as keyof ThemeConfig] }), {})),
  };
} 