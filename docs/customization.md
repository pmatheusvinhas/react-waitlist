# Customization

React Waitlist is highly customizable to match your brand and design system. This document outlines the various customization options available.

## Content Customization

You can customize the text content of the waitlist form:

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

You can customize the visual appearance of the waitlist form using the theme prop:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  // Theme customization
  theme={{
    colors: {
      primary: '#3182CE',
      secondary: '#805AD5',
      background: '#F7FAFC',
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
  }}
/>
```

### Design System Integration

The theme system is designed to be compatible with popular design systems. Here are some examples:

#### Tailwind CSS

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  // Tailwind CSS integration
  theme={{
    container: { className: 'bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto' },
    title: { className: 'text-2xl font-bold text-gray-900 mb-2' },
    description: { className: 'text-gray-600 mb-6' },
    form: { className: 'space-y-4' },
    fieldContainer: { className: 'flex flex-col space-y-1' },
    label: { className: 'text-sm font-medium text-gray-700' },
    input: { className: 'px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500' },
    inputError: { className: 'px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500' },
    button: { className: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors' },
    buttonLoading: { className: 'w-full bg-blue-400 text-white font-medium py-2 px-4 rounded-md cursor-not-allowed' },
    errorMessage: { className: 'text-sm text-red-600 mt-1' },
    formError: { className: 'p-3 bg-red-50 border border-red-200 text-red-700 rounded-md mt-4' },
  }}
/>
```

#### Material UI

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  // Material UI integration
  theme={{
    container: { sx: { maxWidth: 'sm', mx: 'auto', p: 3, borderRadius: 1, boxShadow: 1 } },
    title: { sx: { typography: 'h5', mb: 1, fontWeight: 'bold' } },
    description: { sx: { typography: 'body2', mb: 3, color: 'text.secondary' } },
    form: { sx: { display: 'flex', flexDirection: 'column', gap: 2 } },
    fieldContainer: { sx: { width: '100%' } },
    label: { sx: { typography: 'subtitle2', mb: 0.5 } },
    input: { sx: { width: '100%', p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' } },
    inputError: { sx: { width: '100%', p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'error.main' } },
    button: { sx: { mt: 2, py: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } } },
    buttonLoading: { sx: { mt: 2, py: 1.5, bgcolor: 'action.disabledBackground', color: 'text.disabled' } },
    errorMessage: { sx: { typography: 'caption', color: 'error.main', mt: 0.5 } },
    formError: { sx: { p: 2, mt: 2, bgcolor: 'error.light', color: 'error.main', borderRadius: 1 } },
  }}
/>
```

## Custom CSS

You can apply custom CSS using className and style props:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  className="my-custom-waitlist"
  style={{ maxWidth: '500px', margin: '0 auto' }}
/>
```

You can then style the component using CSS:

```css
.my-custom-waitlist {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.my-custom-waitlist h2 {
  color: #343a40;
  font-size: 1.75rem;
}
```

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