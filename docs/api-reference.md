# API Reference

This document provides a comprehensive reference for all components, props, and utilities available in the React Waitlist package.

## Components

### WaitlistForm

The main component for creating waitlist forms.

```jsx
import { WaitlistForm } from 'react-waitlist';

<WaitlistForm 
  resendAudienceId="your_audience_id"
  resendProxyEndpoint="/api/resend-proxy"
  title="Join Our Waitlist"
  description="Be the first to know when we launch."
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `resendAudienceId` | `string` | No | The ID of the Resend audience to add contacts to |
| `resendProxyEndpoint` | `string` | No | The URL of the proxy endpoint for Resend API calls |
| `title` | `string` | No | The title of the waitlist form |
| `description` | `string` | No | The description text below the title |
| `submitText` | `string` | No | The text for the submit button |
| `successTitle` | `string` | No | The title shown after successful submission |
| `successDescription` | `string` | No | The description shown after successful submission |
| `fields` | `Field[]` | No | Array of field definitions (see Field type below) |
| `theme` | `ThemeConfig` | No | Theme configuration for styling the form |
| `className` | `string` | No | Additional CSS class for the form container |
| `style` | `React.CSSProperties` | No | Inline styles for the form container |
| `security` | `SecurityConfig` | No | Security configuration options |
| `analytics` | `AnalyticsConfig` | No | Analytics configuration options |
| `resendMapping` | `ResendMapping` | No | Mapping of form fields to Resend contact fields |
| `webhooks` | `WebhookConfig[]` | No | Array of webhook configurations |
| `webhookProxyEndpoint` | `string` | No | The URL of the proxy endpoint for webhook calls |
| `recaptchaProxyEndpoint` | `string` | No | The URL of the proxy endpoint for reCAPTCHA verification |
| `onView` | `(data: ViewEventData) => void` | No | Callback when the form is viewed |
| `onSubmit` | `(data: SubmitEventData) => void` | No | Callback when the form is submitted |
| `onSuccess` | `(data: SuccessEventData) => void` | No | Callback when submission is successful |
| `onError` | `(data: ErrorEventData) => void` | No | Callback when an error occurs |

### Server Components

For server-side rendering (SSR) in frameworks like Next.js App Router, use the `ServerWaitlist` component:

```jsx
import { ServerWaitlist } from 'react-waitlist/server';

// In a server component:
<ServerWaitlist 
  apiKey={process.env.RESEND_API_KEY}
  resendAudienceId="your_audience_id"
  title="Join Our Waitlist"
/>
```

#### ServerWaitlist Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string` | Yes | The Resend API key (kept secure on the server) |
| `resendAudienceId` | `string` | Yes | The ID of the Resend audience to add contacts to |
| `recaptchaSiteKey` | `string` | No | The reCAPTCHA site key for bot protection |
| `title` | `string` | No | The title of the waitlist form |
| `description` | `string` | No | The description text below the title |
| `submitText` | `string` | No | The text for the submit button |
| `successTitle` | `string` | No | The title shown after successful submission |
| `successDescription` | `string` | No | The description shown after successful submission |
| `fields` | `Field[]` | No | Array of field definitions (see Field type below) |
| `theme` | `ThemeConfig` | No | Theme configuration for styling the form |
| `className` | `string` | No | Additional CSS class for the form container |
| `style` | `React.CSSProperties` | No | Inline styles for the form container |
| `security` | `SecurityConfig` | No | Security configuration options |
| `analytics` | `AnalyticsConfig` | No | Analytics configuration options |
| `resendMapping` | `ResendMapping` | No | Mapping of form fields to Resend contact fields |
| `webhooks` | `WebhookConfig[]` | No | Array of webhook configurations |

### Client Components

For client-side hydration of server-rendered forms, use the `ClientWaitlist` component:

```jsx
'use client';

import { ClientWaitlist } from 'react-waitlist/client';

// In a client component:
<ClientWaitlist />
```

#### ClientWaitlist Component

The `ClientWaitlist` component is used in conjunction with `ServerWaitlist` to hydrate the server-rendered placeholder with the interactive form.

This component takes no props as it automatically finds and hydrates the placeholder rendered by `ServerWaitlist`.

#### Important Note on Imports

To maintain proper separation between server and client code:

- Always import `ServerWaitlist` from `react-waitlist/server` in server components
- Always import `ClientWaitlist` from `react-waitlist/client` in client components

This separation is crucial for frameworks like Next.js that enforce strict boundaries between server and client code.

## Types

### Field

Defines a form field.

```typescript
interface Field {
  name: string;
  type: 'text' | 'email' | 'select' | 'checkbox';
  label: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: string | boolean;
  options?: string[];
  metadata?: boolean;
}
```

### ThemeConfig

Configuration for styling the form.

```typescript
interface ThemeConfig {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    error?: string;
    success?: string;
    gray?: {
      [key: string]: string;
    };
  };
  typography?: {
    fontFamily?: string;
    fontSizes?: {
      xs?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
    };
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    full?: string;
  };
  animation?: AnimationConfig;
}
```

### SecurityConfig

Configuration for security features.

```typescript
interface SecurityConfig {
  enableHoneypot?: boolean;
  checkSubmissionTime?: boolean;
  minSubmissionTimeSec?: number;
  enableReCaptcha?: boolean;
  reCaptchaSiteKey?: string;
  reCaptchaMinScore?: number;
}
```

### AnalyticsConfig

Configuration for analytics tracking.

```typescript
interface AnalyticsConfig {
  trackView?: boolean;
  trackSubmit?: boolean;
  trackSuccess?: boolean;
  trackError?: boolean;
  customData?: Record<string, any>;
}
```

### ResendMapping

Mapping of form fields to Resend contact fields.

```typescript
interface ResendMapping {
  email?: string;
  firstName?: string;
  lastName?: string;
  metadata?: string[];
}
```

### WebhookConfig

Configuration for a webhook.

```typescript
interface WebhookConfig {
  url: string;
  events: ('view' | 'submit' | 'success' | 'error')[];
  includeAllFields?: boolean;
  includeFields?: string[];
  excludeFields?: string[];
  customHeaders?: Record<string, string>;
  customData?: Record<string, any>;
}
```

## Server Utilities

### createResendProxy

Creates a proxy endpoint for Resend API calls.

```javascript
import { createResendProxy } from 'react-waitlist/server';

export default createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your_audience_id'],
  rateLimit: {
    max: 10,
    windowSec: 60,
  },
});
```

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | `string` | Yes | The Resend API key |
| `allowedAudiences` | `string[]` | No | Array of allowed audience IDs |
| `rateLimit` | `{ max: number, windowSec: number }` | No | Rate limiting configuration |
| `cors` | `{ origin: string | string[], methods: string[] }` | No | CORS configuration |

### createWebhookProxy

Creates a proxy endpoint for webhook calls.

```javascript
import { createWebhookProxy } from 'react-waitlist/server';

export default createWebhookProxy({
  allowedWebhooks: ['https://your-webhook-endpoint.com'],
  secretKey: process.env.WEBHOOK_SECRET_KEY,
});
```

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `allowedWebhooks` | `string[]` | No | Array of allowed webhook URLs |
| `secretKey` | `string` | No | Secret key for signing webhook requests |
| `rateLimit` | `{ max: number, windowSec: number }` | No | Rate limiting configuration |
| `cors` | `{ origin: string | string[], methods: string[] }` | No | CORS configuration |

### createRecaptchaProxy

Creates a proxy endpoint for reCAPTCHA verification.

```javascript
import { createRecaptchaProxy } from 'react-waitlist/server';

export default createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5,
});
```

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `secretKey` | `string` | Yes | The reCAPTCHA secret key |
| `minScore` | `number` | No | Minimum score for verification (0.0 to 1.0) |
| `allowedActions` | `string[]` | No | Array of allowed reCAPTCHA actions |
| `rateLimit` | `{ max: number, windowSec: number }` | No | Rate limiting configuration |
| `cors` | `{ origin: string | string[], methods: string[] }` | No | CORS configuration |

## Hooks

### useWaitlistForm

Hook for creating custom waitlist forms.

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
    resendAudienceId: 'your_audience_id',
    resendProxyEndpoint: '/api/resend-proxy',
    onSuccess: (data) => {
      console.log('Success:', data);
    },
  });

  // Custom rendering logic...
}
```

### useResendAudience

Hook for interacting with Resend audiences.

```jsx
import { useResendAudience } from 'react-waitlist/hooks';

function Component() {
  const { addContact, loading, error } = useResendAudience({
    audienceId: 'your_audience_id',
    proxyEndpoint: '/api/resend-proxy',
  });

  const handleAddContact = async () => {
    try {
      await addContact({
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        metadata: {
          role: 'Developer',
        },
      });
      console.log('Contact added successfully');
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  // Rendering logic...
}
```

### useReCaptcha

Hook for integrating with reCAPTCHA.

```jsx
import { useReCaptcha } from 'react-waitlist/hooks';

function Component() {
  const { executeReCaptcha, isLoaded, error } = useReCaptcha({
    siteKey: 'your_recaptcha_site_key',
    proxyEndpoint: '/api/recaptcha-proxy',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const token = await executeReCaptcha('submit_form');
      console.log('reCAPTCHA token:', token);
      // Use the token for form submission
    } catch (error) {
      console.error('reCAPTCHA error:', error);
    }
  };

  // Rendering logic...
}
```

## Event Types

### ViewEventData

```typescript
interface ViewEventData {
  timestamp: number;
  customData?: Record<string, any>;
}
```

### SubmitEventData

```typescript
interface SubmitEventData {
  formData: Record<string, any>;
  timestamp: number;
  customData?: Record<string, any>;
}
```

### SuccessEventData

```typescript
interface SuccessEventData {
  formData: Record<string, any>;
  response: any;
  timestamp: number;
  customData?: Record<string, any>;
}
```

### ErrorEventData

```typescript
interface ErrorEventData {
  formData?: Record<string, any>;
  error: Error;
  timestamp: number;
  customData?: Record<string, any>;
}
``` 