# Getting Started with React Waitlist

React Waitlist is a customizable waitlist component for React that integrates with Resend audiences. It allows you to easily collect and manage waitlist signups for your product or service.

## Installation

```bash
npm install react-waitlist
# or
yarn add react-waitlist
```

## Basic Usage

There are two main ways to use React Waitlist:

### 1. Client-Side with Proxy API (Recommended for most applications)

This approach uses a proxy API endpoint to protect your Resend API key.

First, create a proxy API endpoint:

```jsx
// pages/api/resend-proxy.js (Next.js Pages Router)
import { createResendProxy } from 'react-waitlist/server';

export default createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your-audience-id'], // Optional: restrict to specific audiences
  rateLimit: { // Optional: rate limiting
    max: 10, // Maximum 10 requests
    windowSec: 60, // Per minute
  },
});
```

```jsx
// app/api/resend-proxy/route.js (Next.js App Router)
import { NextResponse } from 'next/server';
import { createResendProxy } from 'react-waitlist/server';

const proxyHandler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your-audience-id'],
});

export async function POST(req) {
  const res = {
    status: (code) => ({
      json: (data) => NextResponse.json(data, { status: code }),
    }),
  };
  return await proxyHandler(req, res);
}
```

Then, use the component in your client-side code:

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      audienceId="your_audience_id"
      proxyEndpoint="/api/resend-proxy"
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
    />
  );
}
```

### 2. Server-Side Component (Next.js App Router, Remix, etc.)

For frameworks that support React Server Components, you can use the `ServerWaitlist` component:

```jsx
import { ServerWaitlist } from 'react-waitlist/server';

export default function WaitlistPage() {
  return (
    <ServerWaitlist 
      apiKey={process.env.RESEND_API_KEY}
      audienceId="your-audience-id"
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
    />
  );
}
```

## Customization

React Waitlist is highly customizable. Here are some examples:

### Custom Fields

```jsx
<WaitlistForm 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  fields={[
    {
      name: 'email',
      type: 'email',
      label: 'Email',
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
      name: 'consent',
      type: 'checkbox',
      label: 'I agree to receive updates about the product',
      required: true,
    },
  ]}
  resendMapping={{
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    metadata: ['role'], // Fields to send as metadata
  }}
/>
```

### Custom Theme

```jsx
<WaitlistForm 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  theme={{
    colors: {
      primary: '#3182CE', // Blue
      secondary: '#805AD5', // Purple
      background: '#FFFFFF', // White
      text: '#1A202C', // Dark gray
      error: '#E53E3E', // Red
      success: '#38A169', // Green
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
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

### Accessibility

```jsx
<WaitlistForm 
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

### Security

```jsx
<WaitlistForm 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  security={{
    enableHoneypot: true, // Add a honeypot field to detect bots
    checkSubmissionTime: true, // Check if the form was submitted too quickly
    enableReCaptcha: true, // Enable reCAPTCHA
    reCaptchaSiteKey: 'your-recaptcha-site-key',
  }}
/>
```

### Analytics

```jsx
<WaitlistForm 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  analytics={{
    enabled: true,
    trackEvents: ['view', 'focus', 'submit', 'success', 'error'],
    integrations: {
      googleAnalytics: true,
      mixpanel: 'your-mixpanel-token',
      posthog: 'your-posthog-token',
    },
  }}
/>
```

## Advanced Usage

### Using Hooks

For more control, you can use the hooks directly:

```jsx
import { useWaitlistForm, useResendAudience } from 'react-waitlist/hooks';

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

  // Custom rendering logic...
}
```

## API Reference

For a complete API reference, see the [API Reference](./api-reference.md) documentation. 