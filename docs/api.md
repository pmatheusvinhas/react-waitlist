# API Reference

This document provides a comprehensive reference for the React Waitlist API.

## WaitlistForm Component

The main component exported by the library.

### Basic Usage

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
    />
  );
}
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `resendAudienceId` | `string` | Yes | - | Resend Audience ID |
| `resendProxyEndpoint` | `string` | Yes (client-side) | - | Endpoint for Resend proxy API |
| `apiKey` | `string` | Yes (server-side) | - | Resend API key (only use in server components) |
| `title` | `string` | No | "Join our waitlist" | Title of the form |
| `description` | `string` | No | "Be the first to know when we launch" | Description of the form |
| `submitText` | `string` | No | "Join waitlist" | Text for the submit button |
| `successTitle` | `string` | No | "You're on the list!" | Title for the success message |
| `successDescription` | `string` | No | "Thank you for joining our waitlist. We'll keep you updated." | Description for the success message |
| `fields` | `Field[]` | No | `[{ name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' }]` | Form fields to collect |
| `theme` | `ThemeConfig` | No | `defaultTheme` | Theme configuration |
| `frameworkConfig` | `FrameworkConfig` | No | - | Configuration for framework integration |
| `security` | `SecurityConfig` | No | `{ enableHoneypot: true, checkSubmissionTime: true }` | Security configuration |
| `analytics` | `AnalyticsConfig` | No | - | Analytics configuration |
| `resendMapping` | `ResendMapping` | No | - | Mapping to Resend API fields |
| `webhooks` | `WebhookConfig[]` | No | - | Webhook configuration |
| `a11y` | `A11yConfig` | No | - | Accessibility configuration |
| `className` | `string` | No | - | Additional class name |
| `style` | `React.CSSProperties` | No | - | Additional inline styles |
| `onFieldFocus` | `(data: { field: string; timestamp: string }) => void` | No | - | Callback when field is focused |
| `onSubmit` | `(data: { timestamp: string; formData: Record<string, any> }) => void` | No | - | Callback when form is submitted |
| `onSuccess` | `(data: { timestamp: string; formData: Record<string, any>; response: any }) => Promise<{ success: boolean; error?: string }>` | No | - | Callback when submission is successful |
| `onError` | `(data: { timestamp: string; formData: Record<string, any>; error: Error }) => void` | No | - | Callback when submission fails |
| `onSecurityEvent` | `(data: { timestamp: string; securityType: string; details: Record<string, any> }) => void` | No | - | Callback for security events |
| `webhookProxyEndpoint` | `string` | No | - | Endpoint for webhook proxy API |
| `recaptchaProxyEndpoint` | `string` | No | - | Endpoint for reCAPTCHA proxy API |

### Type Definitions

#### Field

```typescript
interface Field {
  /** Unique name for the field */
  name: string;
  /** Type of field */
  type: 'text' | 'email' | 'select' | 'checkbox';
  /** Label to display */
  label: string;
  /** Whether the field is required */
  required: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Default value */
  defaultValue?: string | boolean;
  /** Options for select fields */
  options?: string[];
  /** Whether this field should be sent as metadata to Resend */
  metadata?: boolean;
}
```

#### ThemeConfig

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
    fontWeights?: {
      regular?: number;
      medium?: number;
      bold?: number;
    };
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  borders?: {
    radius?: {
      sm?: string;
      md?: string;
      lg?: string;
      full?: string;
    };
  };
  animation?: {
    enabled?: boolean;
    duration?: string;
    easing?: string;
    effects?: {
      fadeIn?: boolean;
      slideIn?: boolean;
      hover?: boolean;
      focus?: boolean;
      loading?: boolean;
      success?: boolean;
    };
  };
  components?: {
    container?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
    form?: React.CSSProperties;
    fieldContainer?: React.CSSProperties;
    label?: React.CSSProperties;
    required?: React.CSSProperties;
    input?: React.CSSProperties;
    inputError?: React.CSSProperties;
    checkboxContainer?: React.CSSProperties;
    checkbox?: React.CSSProperties;
    checkboxLabel?: React.CSSProperties;
    errorMessage?: React.CSSProperties;
    formError?: React.CSSProperties;
    button?: React.CSSProperties;
    buttonLoading?: React.CSSProperties;
    loadingText?: React.CSSProperties;
    spinner?: React.CSSProperties;
    successContainer?: React.CSSProperties;
    successTitle?: React.CSSProperties;
    successDescription?: React.CSSProperties;
  };
}
```

#### SecurityConfig

```typescript
interface SecurityConfig {
  /**
   * Enable honeypot field to detect bots
   */
  enableHoneypot?: boolean;
  
  /**
   * Check submission time to detect bots
   */
  checkSubmissionTime?: boolean;
  
  /**
   * Minimum time in milliseconds that should elapse between form load and submission
   * Used to detect bot submissions that happen too quickly
   * Default: 3000 (3 seconds)
   */
  minSubmissionTime?: number;
  
  /**
   * Enable Google reCAPTCHA v3
   */
  enableReCaptcha?: boolean;
  
  /**
   * Google reCAPTCHA v3 site key
   * This is the public key that can be safely used in client-side code
   */
  reCaptchaSiteKey?: string;
  
  /**
   * Google reCAPTCHA v3 secret key
   * WARNING: This should ONLY be used in server-side code (SSR)
   * Never expose this key in client-side code
   */
  reCaptchaSecretKey?: string;
  
  /**
   * Endpoint for reCAPTCHA verification via proxy
   * Used to verify reCAPTCHA tokens without exposing the secret key
   * Required for client-side verification
   * Example: '/api/recaptcha-verify'
   */
  recaptchaProxyEndpoint?: string;
}
```

#### ResendMapping

```typescript
interface ResendMapping {
  /** Field to use for email */
  email?: string;
  /** Field to use for first name */
  firstName?: string;
  /** Field to use for last name */
  lastName?: string;
  /** Fields to send as metadata */
  metadata?: string[];
}
```

#### WebhookConfig

```typescript
interface WebhookConfig {
  /** URL to send the webhook to */
  url: string;
  /** Events that trigger this webhook */
  events?: WaitlistEventType[];
  /** Custom headers to include with the webhook request */
  headers?: Record<string, string>;
  /** Whether to include all form fields in the webhook payload */
  includeAllFields?: boolean;
  /** Specific fields to include in the webhook payload */
  includeFields?: string[];
}
```

#### A11yConfig

```typescript
interface A11yConfig {
  /** Whether to announce status changes to screen readers */
  announceStatus?: boolean;
  /** Whether to use high contrast mode */
  highContrast?: boolean;
  /** Whether to reduce motion */
  reduceMotion?: boolean;
  /** Alternative property for reducedMotion that can be 'auto' */
  reducedMotion?: 'auto' | boolean;
  /** Labels for screen readers */
  labels?: {
    form?: string;
    submitButton?: string;
    successMessage?: string;
    errorMessage?: string;
  };
  /** Alternative property for labels */
  ariaLabels?: {
    form?: string;
    emailField?: string;
    submitButton?: string;
    successMessage?: string;
    errorMessage?: string;
    [key: string]: string | undefined;
  };
}
```

#### FrameworkConfig

```typescript
interface FrameworkConfig {
  /** Name of the framework */
  name: 'tailwind' | 'material-ui' | 'chakra-ui' | 'bootstrap' | string;
  /** Custom adapter function */
  adapter?: (theme: ThemeConfig) => ThemeConfig;
}
```

## Server Utilities

### createResendProxy

Creates a proxy handler for Resend API requests.

```js
import { createResendProxy } from 'react-waitlist/server';

const handler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: [process.env.RESEND_AUDIENCE_ID],
  rateLimit: {
    max: 5,
    windowSec: 60
  },
  debug: false
});

export default async function resendProxyHandler(req, res) {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Resend proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### ResendProxyConfig

```typescript
interface ResendProxyConfig {
  /** Resend API key */
  apiKey: string;
  /** Allowed audience IDs (for security) */
  allowedAudiences?: string[];
  /** Rate limiting configuration */
  rateLimit?: {
    /** Maximum number of requests per window */
    max: number;
    /** Time window in seconds */
    windowSec: number;
  };
  /** Enable debug mode */
  debug?: boolean;
}
```

### createRecaptchaProxy

Creates a proxy handler for reCAPTCHA verification.

```js
import { createRecaptchaProxy } from 'react-waitlist/server';

const handler = createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5,
  allowedActions: ['submit_waitlist'],
  debug: false
});

export default async function recaptchaProxyHandler(req, res) {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('reCAPTCHA proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### RecaptchaProxyOptions

```typescript
interface RecaptchaProxyOptions {
  /** Google reCAPTCHA v3 secret key */
  secretKey: string;
  /** Minimum score required (0.0 to 1.0) */
  minScore?: number;
  /** Allowed action names */
  allowedActions?: string[];
  /** Enable debug mode */
  debug?: boolean;
}
```

### createWebhookProxy

Creates a proxy handler for webhook requests.

```js
import { createWebhookProxy } from 'react-waitlist/server';

const handler = createWebhookProxy({
  endpoints: {
    slack: {
      url: process.env.SLACK_WEBHOOK_URL,
      headers: { 'Content-Type': 'application/json' }
    },
    custom: {
      url: process.env.CUSTOM_WEBHOOK_URL,
      headers: { 'Authorization': `Bearer ${process.env.API_KEY}` }
    }
  },
  debug: false
});

export default async function webhookProxyHandler(req, res) {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Webhook proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### WebhookProxyOptions

```typescript
interface WebhookProxyOptions {
  /** Map of webhook endpoints */
  endpoints: Record<string, {
    /** URL to send the webhook to */
    url: string;
    /** Custom headers to include with the webhook request */
    headers?: Record<string, string>;
  }>;
  /** Enable debug mode */
  debug?: boolean;
}
```

## Hooks

### useWaitlistEvents

Hook for handling waitlist events.

```jsx
import { useWaitlistEvents } from 'react-waitlist';

function MyComponent() {
  const { subscribe } = useWaitlistEvents();
  
  useEffect(() => {
    const unsubscribe = subscribe('submit', (data) => {
      console.log('Form submitted:', data);
    });
    
    return () => unsubscribe();
  }, [subscribe]);
  
  return <div>My component</div>;
}
```

### useResendAudience

Hook for interacting with Resend audiences.

```jsx
import { useResendAudience } from 'react-waitlist/hooks';

function MyComponent() {
  const { addContact, loading, error } = useResendAudience({
    audienceId: 'YOUR_AUDIENCE_ID',
    proxyEndpoint: '/api/resend-proxy'
  });
  
  const handleSubmit = async (formData) => {
    try {
      const result = await addContact({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        metadata: {
          company: formData.company,
          role: formData.role
        }
      });
      
      console.log('Contact added:', result);
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };
  
  return <div>My component</div>;
}
```

## Theme Utilities

### Default Themes

```jsx
import { 
  defaultTheme, 
  tailwindDefaultTheme, 
  materialUIDefaultTheme,
  mergeTheme
} from 'react-waitlist';

// Use a default theme
<WaitlistForm theme={materialUIDefaultTheme} />

// Create a custom theme by merging with a default
const customTheme = mergeTheme(defaultTheme, {
  colors: {
    primary: '#FF5733',
    success: '#33FF57'
  }
});

<WaitlistForm theme={customTheme} />
```

### mergeTheme

Utility function to merge theme objects.

```jsx
import { mergeTheme } from 'react-waitlist';

const baseTheme = {
  colors: {
    primary: '#3f51b5',
    text: '#333333'
  }
};

const overrides = {
  colors: {
    primary: '#ff5722'
  }
};

const mergedTheme = mergeTheme(baseTheme, overrides);
// Result:
// {
//   colors: {
//     primary: '#ff5722',
//     text: '#333333'
//   }
// }
```

## Animation Utilities

### getAnimationStyles

Utility function to generate animation styles.

```jsx
import { getAnimationStyles } from 'react-waitlist';

const animationConfig = {
  enabled: true,
  duration: '300ms',
  easing: 'ease-in-out',
  effects: {
    fadeIn: true,
    slideIn: true
  }
};

const styles = getAnimationStyles(animationConfig, 'fadeIn');
// Result:
// {
//   opacity: 0,
//   animation: 'fadeIn 300ms ease-in-out forwards'
// }
``` 