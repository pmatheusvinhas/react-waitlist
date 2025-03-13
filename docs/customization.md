# Customization Guide

The `WaitlistForm` component is designed to be highly customizable to match your application's design system. This guide covers all the ways you can customize the component.

## Customization Approaches

There are three main approaches to customizing the `WaitlistForm` component:

1. **Theme Configuration**: Using the `theme` prop to configure colors, typography, spacing, and other design tokens.
2. **CSS Classes**: Using the `className` prop to apply custom CSS classes.
3. **External CSS**: Using external CSS files to apply more advanced styles.

These approaches can be used individually or combined for maximum flexibility.

## Theme Configuration

The `theme` prop accepts a configuration object that allows you to customize various aspects of the component's appearance.

### Basic Theme Example

```jsx
<WaitlistForm
  theme={{
    colors: {
      primary: '#3b82f6',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb',
      success: '#10b981',
      error: '#ef4444',
    },
    borderRadius: '0.5rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
  }}
  // other props
/>
```

### Complete Theme Configuration

The theme object supports the following properties:

```typescript
interface ThemeConfig {
  // Colors
  colors: {
    primary: string;
    secondary?: string;
    background: string;
    text: string;
    border: string;
    success: string;
    error: string;
    muted?: string;
    accent?: string;
  };
  
  // Typography
  fontFamily: string;
  fontSize: {
    xs?: string;
    sm?: string;
    base: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  fontWeight: {
    normal?: string | number;
    medium?: string | number;
    bold?: string | number;
  };
  
  // Spacing
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl'?: string;
    '3xl'?: string;
  };
  
  // Borders
  borderRadius: string;
  borderWidth: string;
  
  // Shadows
  shadows: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  
  // Transitions
  transitions: {
    duration?: string;
    timing?: string;
  };
  
  // Component-specific styling
  components?: {
    form?: {
      padding?: string;
      maxWidth?: string;
      background?: string;
    };
    input?: {
      height?: string;
      padding?: string;
      background?: string;
    };
    button?: {
      height?: string;
      padding?: string;
      background?: string;
      hoverBackground?: string;
    };
    title?: {
      fontSize?: string;
      fontWeight?: string | number;
      color?: string;
    };
    description?: {
      fontSize?: string;
      color?: string;
    };
  };
  
  // Animation configuration
  animations?: {
    enable?: boolean;
    duration?: string;
    submitButton?: {
      type?: 'fade' | 'scale' | 'slide';
      duration?: string;
    };
    successMessage?: {
      type?: 'fade' | 'scale' | 'slide';
      duration?: string;
    };
    respectReducedMotion?: boolean;
  };
}
```

## Design System Integration

The theme system is designed to be flexible enough to integrate with various design systems. You can create adapter functions to convert your design system tokens into the format expected by the `WaitlistForm` component.

### Creating a Design System Adapter

```jsx
// Example adapter for a custom design system
function createThemeFromDesignSystem(designSystem) {
  return {
    colors: {
      primary: designSystem.colors.brand,
      background: designSystem.colors.surface,
      text: designSystem.colors.text,
      border: designSystem.colors.border,
      success: designSystem.colors.positive,
      error: designSystem.colors.negative,
    },
    fontFamily: designSystem.typography.fontFamily,
    fontSize: {
      base: designSystem.typography.fontSize.medium,
      lg: designSystem.typography.fontSize.large,
    },
    spacing: {
      xs: designSystem.spacing[1],
      sm: designSystem.spacing[2],
      md: designSystem.spacing[4],
      lg: designSystem.spacing[6],
      xl: designSystem.spacing[8],
    },
    borderRadius: designSystem.borders.radius.medium,
    borderWidth: designSystem.borders.width.regular,
    // ... other properties
  };
}

// Usage
import { myDesignSystem } from './design-system';

function App() {
  const waitlistTheme = createThemeFromDesignSystem(myDesignSystem);
  
  return (
    <WaitlistForm
      theme={waitlistTheme}
      // other props
    />
  );
}
```

## CSS Classes

For more control over the styling, you can use the `className` prop to apply custom CSS classes to the component.

```jsx
<WaitlistForm
  className="my-custom-waitlist"
  // other props
/>
```

Then in your CSS file:

```css
.my-custom-waitlist {
  /* Custom styles */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.my-custom-waitlist form {
  /* Form styles */
}

.my-custom-waitlist input {
  /* Input styles */
}

.my-custom-waitlist button {
  /* Button styles */
}
```

## External CSS

For the most advanced customization, you can use external CSS files to apply styles to the component. This approach gives you complete control over the styling.

```jsx
import './custom-waitlist.css';

function App() {
  return (
    <WaitlistForm
      className="custom-waitlist"
      // other props
    />
  );
}
```

In your CSS file, you can use CSS variables to create a theme:

```css
.custom-waitlist {
  --waitlist-primary-color: #3b82f6;
  --waitlist-background-color: #ffffff;
  --waitlist-text-color: #1f2937;
  --waitlist-border-color: #e5e7eb;
  --waitlist-success-color: #10b981;
  --waitlist-error-color: #ef4444;
  --waitlist-border-radius: 0.5rem;
  --waitlist-font-family: 'Inter', system-ui, sans-serif;
  --waitlist-spacing-sm: 0.5rem;
  --waitlist-spacing-md: 1rem;
  --waitlist-spacing-lg: 1.5rem;
  
  /* Apply the variables */
  background-color: var(--waitlist-background-color);
  color: var(--waitlist-text-color);
  font-family: var(--waitlist-font-family);
  border-radius: var(--waitlist-border-radius);
  padding: var(--waitlist-spacing-lg);
}

.custom-waitlist input {
  border: 1px solid var(--waitlist-border-color);
  border-radius: var(--waitlist-border-radius);
  padding: var(--waitlist-spacing-sm);
}

.custom-waitlist button {
  background-color: var(--waitlist-primary-color);
  color: white;
  border-radius: var(--waitlist-border-radius);
  padding: var(--waitlist-spacing-sm) var(--waitlist-spacing-md);
}

/* Advanced effects */
.custom-waitlist button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.custom-waitlist input:focus {
  border-color: var(--waitlist-primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  outline: none;
  transition: all 0.2s ease;
}
```

## Combining Approaches

For the most flexibility, you can combine all three approaches:

```jsx
import './custom-waitlist.css';

function App() {
  return (
    <WaitlistForm
      theme={{
        colors: {
          primary: '#3b82f6',
          background: '#ffffff',
          text: '#1f2937',
        },
        borderRadius: '0.5rem',
      }}
      className="custom-waitlist"
      // other props
    />
  );
}
```

This allows you to:
1. Use the `theme` prop for basic configuration
2. Use the `className` prop for applying custom CSS classes
3. Use external CSS for advanced styles and effects

## Best Practices

1. **Start with the theme prop**: Use the `theme` prop for basic customization before resorting to custom CSS.
2. **Use CSS classes for layout**: Use the `className` prop for layout-related styles.
3. **Use external CSS for advanced effects**: Use external CSS for advanced effects like animations, gradients, and shadows.
4. **Maintain consistency**: Keep your customization consistent with your application's design system.
5. **Test on different devices**: Ensure your customization works well on different devices and screen sizes.

## Examples

Check out the [examples directory](../examples/) for complete examples of different customization approaches.

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  // Content customization
  title="Join our exclusive beta"
  description="Get early access to our product and help shape its future."
  submitText="Request Access"
  successTitle="You're on the list!"
  successDescription="Thank you for your interest. We'll be in touch soon."
/>
```

## Field Customization

You can customize the fields collected in the form:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  // Field customization
  fields={[
    { 
      name: 'email', 
      type: 'email', 
      required: true, 
      label: 'Email Address', 
      placeholder: 'your@email.com' 
    },
    { 
      name: 'firstName', 
      type: 'text', 
      required: false, 
      label: 'First Name' 
    },
    { 
      name: 'role', 
      type: 'select', 
      required: true, 
      label: 'Your Role',
      options: ['Developer', 'Designer', 'Product Manager', 'Other']
    },
    {
      name: 'updates',
      type: 'checkbox',
      required: false,
      label: 'Receive product updates',
      defaultValue: true
    }
  ]}
  
  // Map fields to Resend API
  resendMapping={{
    email: 'email',
    firstName: 'firstName',
    metadata: ['role', 'updates']
  }}
/>
```

### Supported Field Types

- `email`: Email input field
- `text`: Text input field
- `select`: Dropdown select field
- `checkbox`: Checkbox field

## Theme Customization

React Waitlist offers a powerful theming system that allows you to customize the appearance of the form to match your brand. There are several ways to customize the theme:

### 1. Using the Built-in Themes

React Waitlist comes with several built-in themes that you can use out of the box:

```jsx
import { WaitlistForm, tailwindTheme, materialUITheme } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      audienceId="your_audience_id"
      proxyEndpoint="/api/resend-proxy"
      
      // Use the Tailwind CSS theme
      theme={tailwindTheme}
    />
  );
}
```

Available built-in themes:
- `defaultTheme`: The default theme with a clean, modern design
- `tailwindTheme`: A theme that matches Tailwind CSS default styles
- `materialUITheme`: A theme that matches Material UI default styles

### 2. Customizing the Theme Object

You can customize the theme by providing your own theme object:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  // Custom theme
  theme={{
    colors: {
      primary: '#3182CE',
      secondary: '#805AD5',
      background: '#FFFFFF',
      text: '#1A202C',
      error: '#E53E3E',
      success: '#38A169',
      gray: {
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
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
      fontWeights: {
        regular: 400,
        medium: 500,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borders: {
      radius: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
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
      // ... other component styles
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
  }}
/>
```

### 3. Framework Integration

React Waitlist can integrate with popular design systems like Tailwind CSS and Material UI:

#### Tailwind CSS Integration

```jsx
import { WaitlistForm } from 'react-waitlist';
import tailwindConfig from '../tailwind.config.js';

function App() {
  return (
    <WaitlistForm 
      audienceId="your_audience_id"
      proxyEndpoint="/api/resend-proxy"
      
      // Pass your Tailwind config
      frameworkConfig={tailwindConfig}
    />
  );
}
```

#### Material UI Integration

```jsx
import { WaitlistForm } from 'react-waitlist';
import { createTheme } from '@mui/material/styles';

function App() {
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
    // ... other MUI theme options
  });

  return (
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
      // Pass your Material UI theme
      frameworkConfig={muiTheme}
    />
  );
}
```

### 4. CSS Customization

You can also use CSS to customize the appearance of the form:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  // Apply custom CSS class
  className="my-custom-waitlist"
/>
```

```css
/* In your CSS file */
.my-custom-waitlist {
  /* Custom variables */
  --form-bg: linear-gradient(145deg, #ffffff, #f3f4f6);
  --form-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.1);
  --form-border: 1px solid rgba(99, 102, 241, 0.1);
  --form-radius: 1rem;
  --title-gradient: linear-gradient(to right, #6366f1, #4f46e5);
}

/* Container styling */
.my-custom-waitlist > div {
  background: var(--form-bg);
  box-shadow: var(--form-shadow);
  border-radius: var(--form-radius);
  border: var(--form-border);
}

/* More custom styles... */
```

## Combining Approaches

For maximum flexibility, you can combine these approaches:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  // Use the Tailwind theme as a base
  theme={tailwindTheme}
  
  // Override specific properties
  theme={{
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
    },
    components: {
      button: {
        borderRadius: '9999px', // Make buttons rounded
      }
    }
  }}
  
  // Apply custom CSS for advanced styling
  className="my-custom-waitlist"
  
  // Apply inline styles
  style={{ maxWidth: '500px' }}
/>
```

This hybrid approach gives you the best of both worlds: the structure and consistency of the theme system, with the flexibility and power of CSS when needed.

## Animation Customization

You can customize animations for the component:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  theme={{
    // Animation customization
    animations: {
      transition: 'all 0.3s ease-in-out',
      success: {
        animation: 'fadeIn 0.5s ease-in-out',
      },
    },
  }}
/>
```

## Accessibility Customization

You can enhance accessibility features:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  a11y={{
    announceStatus: true,
    highContrast: false,
    reducedMotion: 'auto',
    ariaLabels: {
      form: 'Waitlist signup form',
      emailField: 'Email address',
      submitButton: 'Join the waitlist',
      successMessage: 'Successfully joined the waitlist',
      errorMessage: 'Error joining the waitlist',
    },
  }}
/>
```

## Advanced Customization

For complete control, you can use the hooks to build your own UI:

```jsx
import { useWaitlistForm } from 'react-waitlist/hooks';

function CustomWaitlistForm() {
  const {
    formState,
    formValues,
    validationResults,
    errorMessage,
    handleChange,
    handleSubmit,
    resetForm,
  } = useWaitlistForm({
    audienceId: 'your_audience_id',
    proxyEndpoint: '/api/resend-proxy',
    fields: [
      { name: 'email', type: 'email', required: true, label: 'Email' },
    ],
  });

  return (
    <div>
      {/* Your completely custom UI here */}
    </div>
  );
} 