import { ThemeConfig } from '../core/types';

/**
 * Tailwind CSS adapter
 * Converts Tailwind CSS configuration to ThemeConfig
 */
export const tailwindAdapter = (tailwindConfig: any): Partial<ThemeConfig> => {
  // Extract colors from Tailwind config
  const colors = tailwindConfig?.theme?.colors || {};
  
  // Extract typography from Tailwind config
  const fontFamily = tailwindConfig?.theme?.fontFamily || {};
  const fontSize = tailwindConfig?.theme?.fontSize || {};
  const fontWeight = tailwindConfig?.theme?.fontWeight || {};
  
  // Extract spacing from Tailwind config
  const spacing = tailwindConfig?.theme?.spacing || {};
  
  // Extract border radius from Tailwind config
  const borderRadius = tailwindConfig?.theme?.borderRadius || {};
  
  return {
    colors: {
      primary: colors.primary || colors.blue?.[600] || '#3182CE',
      secondary: colors.secondary || colors.purple?.[600] || '#805AD5',
      background: colors.white || '#FFFFFF',
      text: colors.gray?.[900] || '#1A202C',
      error: colors.red?.[600] || '#E53E3E',
      success: colors.green?.[600] || '#38A169',
      gray: {
        50: colors.gray?.[50] || '#F7FAFC',
        100: colors.gray?.[100] || '#EDF2F7',
        200: colors.gray?.[200] || '#E2E8F0',
        300: colors.gray?.[300] || '#CBD5E0',
        400: colors.gray?.[400] || '#A0AEC0',
        500: colors.gray?.[500] || '#718096',
        600: colors.gray?.[600] || '#4A5568',
        700: colors.gray?.[700] || '#2D3748',
        800: colors.gray?.[800] || '#1A202C',
        900: colors.gray?.[900] || '#171923',
      },
    },
    typography: {
      fontFamily: fontFamily.sans || 
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSizes: {
        xs: fontSize.xs || '0.75rem',
        sm: fontSize.sm || '0.875rem',
        md: fontSize.base || '1rem',
        lg: fontSize.lg || '1.125rem',
        xl: fontSize.xl || '1.25rem',
      },
      fontWeights: {
        regular: fontWeight.normal || 400,
        medium: fontWeight.medium || 500,
        bold: fontWeight.bold || 700,
      },
    },
    spacing: {
      xs: spacing[1] || '0.25rem',
      sm: spacing[2] || '0.5rem',
      md: spacing[4] || '1rem',
      lg: spacing[6] || '1.5rem',
      xl: spacing[8] || '2rem',
    },
    borders: {
      radius: {
        sm: borderRadius.sm || '0.125rem',
        md: borderRadius.md || '0.25rem',
        lg: borderRadius.lg || '0.5rem',
        full: borderRadius.full || '9999px',
      },
    },
    framework: {
      type: 'tailwind',
      config: tailwindConfig,
    },
  };
};

/**
 * Material UI adapter
 * Converts Material UI theme to ThemeConfig
 */
export const materialUIAdapter = (muiTheme: any): Partial<ThemeConfig> => {
  return {
    colors: {
      primary: muiTheme?.palette?.primary?.main || '#3182CE',
      secondary: muiTheme?.palette?.secondary?.main || '#805AD5',
      background: muiTheme?.palette?.background?.paper || '#FFFFFF',
      text: muiTheme?.palette?.text?.primary || '#1A202C',
      error: muiTheme?.palette?.error?.main || '#E53E3E',
      success: muiTheme?.palette?.success?.main || '#38A169',
      gray: {
        50: muiTheme?.palette?.grey?.[50] || '#F7FAFC',
        100: muiTheme?.palette?.grey?.[100] || '#EDF2F7',
        200: muiTheme?.palette?.grey?.[200] || '#E2E8F0',
        300: muiTheme?.palette?.grey?.[300] || '#CBD5E0',
        400: muiTheme?.palette?.grey?.[400] || '#A0AEC0',
        500: muiTheme?.palette?.grey?.[500] || '#718096',
        600: muiTheme?.palette?.grey?.[600] || '#4A5568',
        700: muiTheme?.palette?.grey?.[700] || '#2D3748',
        800: muiTheme?.palette?.grey?.[800] || '#1A202C',
        900: muiTheme?.palette?.grey?.[900] || '#171923',
      },
    },
    typography: {
      fontFamily: muiTheme?.typography?.fontFamily || 
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSizes: {
        xs: muiTheme?.typography?.fontSize * 0.75 + 'rem' || '0.75rem',
        sm: muiTheme?.typography?.fontSize * 0.875 + 'rem' || '0.875rem',
        md: muiTheme?.typography?.fontSize + 'rem' || '1rem',
        lg: muiTheme?.typography?.fontSize * 1.125 + 'rem' || '1.125rem',
        xl: muiTheme?.typography?.fontSize * 1.25 + 'rem' || '1.25rem',
      },
      fontWeights: {
        regular: muiTheme?.typography?.fontWeightRegular || 400,
        medium: muiTheme?.typography?.fontWeightMedium || 500,
        bold: muiTheme?.typography?.fontWeightBold || 700,
      },
    },
    spacing: {
      xs: muiTheme?.spacing(1) + 'px' || '0.25rem',
      sm: muiTheme?.spacing(2) + 'px' || '0.5rem',
      md: muiTheme?.spacing(4) + 'px' || '1rem',
      lg: muiTheme?.spacing(6) + 'px' || '1.5rem',
      xl: muiTheme?.spacing(8) + 'px' || '2rem',
    },
    borders: {
      radius: {
        sm: muiTheme?.shape?.borderRadius * 0.5 + 'px' || '0.125rem',
        md: muiTheme?.shape?.borderRadius + 'px' || '0.25rem',
        lg: muiTheme?.shape?.borderRadius * 2 + 'px' || '0.5rem',
        full: '9999px',
      },
    },
    framework: {
      type: 'material-ui',
      config: muiTheme,
    },
  };
};

/**
 * Detect framework type from provided theme or config
 */
export const detectFramework = (theme: any): 'tailwind' | 'material-ui' | 'custom' => {
  // Check if it's a Material UI theme
  if (theme?.palette?.primary?.main && theme?.typography?.fontFamily) {
    return 'material-ui';
  }
  
  // Check if it's a Tailwind config
  if (theme?.theme?.colors && theme?.theme?.fontSize) {
    return 'tailwind';
  }
  
  // Default to custom
  return 'custom';
};

/**
 * Apply appropriate adapter based on framework type
 */
export const applyFrameworkAdapter = (
  theme: ThemeConfig | undefined, 
  frameworkConfig?: any
): ThemeConfig => {
  // If no theme or framework config provided, return empty object
  if (!theme && !frameworkConfig) {
    return {};
  }
  
  // If framework config is provided, detect and apply appropriate adapter
  if (frameworkConfig) {
    const frameworkType = detectFramework(frameworkConfig);
    
    if (frameworkType === 'tailwind') {
      return {
        ...tailwindAdapter(frameworkConfig),
        ...theme,
      };
    }
    
    if (frameworkType === 'material-ui') {
      return {
        ...materialUIAdapter(frameworkConfig),
        ...theme,
      };
    }
  }
  
  // If theme has framework type specified, apply appropriate adapter
  if (theme?.framework?.type && theme?.framework?.config) {
    if (theme.framework.type === 'tailwind') {
      return {
        ...tailwindAdapter(theme.framework.config),
        ...theme,
      };
    }
    
    if (theme.framework.type === 'material-ui') {
      return {
        ...materialUIAdapter(theme.framework.config),
        ...theme,
      };
    }
  }
  
  // Return original theme if no adapter applies
  return theme || {};
}; 