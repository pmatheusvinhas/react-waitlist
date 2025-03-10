# Customization

React Waitlist is highly customizable to match your brand and design system. This document outlines the various customization options available.

## Content Customization

You can customize the text content of the waitlist form:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  
  // Content customization
  title="Join Our Private Beta"
  description="Sign up to get early access to our revolutionary product."
  submitText="Request Access"
  successTitle="You're In!"
  successDescription="Thank you for joining our private beta. We'll be in touch soon."
/>
```

## Field Customization

You can customize the fields that are collected:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  fields={[
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'your@email.com',
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: false,
      placeholder: 'John',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: false,
      placeholder: 'Doe',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      options: ['Developer', 'Designer', 'Product Manager', 'Other'],
      required: false,
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company',
      required: false,
      placeholder: 'Acme Inc.',
    },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'I agree to receive updates about the product',
      required: true,
    },
  ]}
  
  // Map fields to Resend API
  resendMapping={{
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    metadata: ['role', 'company'], // Fields to send as metadata
  }}
/>
```

### Supported Field Types

- `email`: Email input field
- `text`: Text input field
- `select`: Dropdown select field
- `checkbox`: Checkbox field

## Theme Customization

You can customize the visual appearance of the waitlist form using the theme prop:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  theme={{
    // Colors
    colors: {
      primary: '#3182CE', // Primary color (buttons, accents)
      secondary: '#805AD5', // Secondary color
      background: '#FFFFFF', // Background color
      text: '#1A202C', // Text color
      error: '#E53E3E', // Error color
      success: '#38A169', // Success color
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
    
    // Typography
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
    
    // Spacing
    spacing: {
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
    },
    
    // Borders
    borders: {
      radius: {
        sm: '0.125rem', // 2px
        md: '0.25rem', // 4px
        lg: '0.5rem', // 8px
        full: '9999px', // Circular
      },
    },
  }}
/>
```

### Design System Integration

The theme system is designed to be compatible with popular design systems. Here are some examples:

#### Tailwind CSS

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  theme={{
    colors: {
      primary: '#3B82F6', // blue-500
      secondary: '#8B5CF6', // violet-500
      background: '#FFFFFF',
      text: '#1F2937', // gray-800
      error: '#EF4444', // red-500
      success: '#10B981', // green-500
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
    // ... other theme values
  }}
/>
```

#### Material UI

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  theme={{
    colors: {
      primary: '#1976D2', // primary.main
      secondary: '#9C27B0', // secondary.main
      background: '#FFFFFF',
      text: '#212121', // text.primary
      error: '#D32F2F', // error.main
      success: '#2E7D32', // success.main
    },
    borders: {
      radius: {
        sm: '4px',
        md: '4px',
        lg: '4px',
        full: '9999px',
      },
    },
    // ... other theme values
  }}
/>
```

## Custom CSS

You can also apply custom CSS using the `className` and `style` props:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  className="my-custom-waitlist"
  style={{ maxWidth: '500px', margin: '0 auto' }}
/>
```

Then in your CSS:

```css
.my-custom-waitlist {
  /* Custom styles */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 24px;
}

.my-custom-waitlist h2 {
  /* Custom title styles */
  font-size: 24px;
  margin-bottom: 16px;
}

/* And so on... */
```

## Animation Customization

You can customize the animations used by the component:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  animations={{
    type: 'fadeSlide', // 'fade', 'slide', 'fadeSlide', 'scale', 'none'
    duration: 300, // Duration in milliseconds
    easing: 'ease-in-out', // CSS easing function
    delay: 0, // Delay in milliseconds
  }}
/>
```

## Accessibility Customization

You can customize the accessibility features:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  a11y={{
    announceStatus: true, // Announce status changes to screen readers
    highContrast: false, // Use high contrast mode
    reducedMotion: 'auto', // Respect user's reduced motion preference
    ariaLabels: {
      form: 'Waitlist signup form',
      emailField: 'Your email address',
      submitButton: 'Join the waitlist',
      successMessage: 'Successfully joined the waitlist',
      errorMessage: 'Error joining the waitlist',
    },
  }}
/>
```

## Advanced Customization

For more advanced customization, you can use the hooks directly and build your own UI:

```jsx
import { useWaitlistForm } from 'react-waitlist/hooks';

function CustomWaitlistForm() {
  const {
    formState,
    formValues,
    validationResults,
    errorMessage,
    honeypotFieldName,
    handleChange,
    handleSubmit,
    resetForm,
  } = useWaitlistForm({
    fields: [
      { name: 'email', type: 'email', label: 'Email', required: true },
    ],
    audienceId: 'your-audience-id',
    proxyEndpoint: '/api/resend-proxy',
  });

  // Build your own UI using the hook's state and handlers
  return (
    <form onSubmit={handleSubmit}>
      {/* Your custom UI */}
    </form>
  );
} 