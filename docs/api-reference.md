# API Reference

## Components

### `<WaitlistForm>`

The main component for client-side usage.

```jsx
import { WaitlistForm } from 'react-waitlist';

<WaitlistForm 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
/>
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `audienceId` | `string` | Yes | - | The Resend audience ID to add contacts to |
| `proxyEndpoint` | `string` | No* | - | The endpoint for the proxy API (*required for client-side usage) |
| `apiKey` | `string` | No* | - | The Resend API key (*only use in server components) |
| `title` | `string` | No | "Join our waitlist" | The title of the waitlist form |
| `description` | `string` | No | "Be the first to know when we launch" | The description of the waitlist form |
| `submitText` | `string` | No | "Join waitlist" | The text for the submit button |
| `successTitle` | `string` | No | "You're on the list!" | The title shown after successful submission |
| `successDescription` | `string` | No | "Thank you for joining our waitlist. We'll keep you updated." | The description shown after successful submission |
| `fields` | `Field[]` | No | `[{ name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' }]` | The fields to collect |
| `theme` | `ThemeConfig` | No | - | Theme configuration |
| `a11y` | `A11yConfig` | No | - | Accessibility configuration |
| `security` | `SecurityConfig` | No | `{ enableHoneypot: true, checkSubmissionTime: true }` | Security configuration |
| `analytics` | `AnalyticsConfig` | No | - | Analytics configuration |
| `resendMapping` | `ResendMapping` | No | - | Mapping of fields to Resend API fields |
| `onSuccess` | `(data: any) => void` | No | - | Callback when submission is successful |
| `onError` | `(error: Error) => void` | No | - | Callback when submission fails |
| `className` | `string` | No | - | Custom CSS class name |
| `style` | `React.CSSProperties` | No | - | Custom inline styles |

### `<ServerWaitlist>`

The server-side component for frameworks with SSR support.

```jsx
import { ServerWaitlist } from 'react-waitlist/server';

<ServerWaitlist 
  apiKey={process.env.RESEND_API_KEY}
  audienceId="your-audience-id"
/>
```

#### Props

Same as `<WaitlistForm>` except:
- `apiKey` is required
- `proxyEndpoint` is not available

## Types

### `Field`

```typescript
type FieldType = 'text' | 'email' | 'select' | 'checkbox';

interface Field {
  /** Unique name for the field */
  name: string;
  /** Type of field */
  type: FieldType;
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

### `ThemeConfig`

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
}
```

### `A11yConfig`

```typescript
interface A11yConfig {
  /** Whether to announce status changes to screen readers */
  announceStatus?: boolean;
  /** Whether to use high contrast mode */
  highContrast?: boolean;
  /** Whether to respect reduced motion preferences */
  reducedMotion?: 'auto' | boolean;
  /** Custom ARIA labels */
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

### `SecurityConfig`

```typescript
interface SecurityConfig {
  /** Whether to enable reCAPTCHA */
  enableReCaptcha?: boolean;
  /** reCAPTCHA site key */
  reCaptchaSiteKey?: string;
  /** Whether to enable honeypot */
  enableHoneypot?: boolean;
  /** Whether to check for submission time (bot detection) */
  checkSubmissionTime?: boolean;
}
```

### `AnalyticsConfig`

```typescript
interface AnalyticsConfig {
  /** Whether to enable analytics */
  enabled?: boolean;
  /** Events to track */
  trackEvents?: ('view' | 'focus' | 'submit' | 'success' | 'error')[];
  /** Integration with analytics tools */
  integrations?: {
    googleAnalytics?: boolean;
    mixpanel?: string;
    posthog?: string;
    [key: string]: boolean | string | undefined;
  };
}
```

### `ResendMapping`

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

## Hooks

### `useWaitlistForm`

```typescript
function useWaitlistForm(options: UseWaitlistFormOptions): UseWaitlistFormReturn;

interface UseWaitlistFormOptions {
  /** Fields to collect */
  fields: Field[];
  /** Security configuration */
  security?: SecurityConfig;
  /** Mapping to Resend API fields */
  resendMapping?: ResendMapping;
  /** Audience ID from Resend */
  audienceId: string;
  /** Endpoint for proxy API (for client-side usage) */
  proxyEndpoint?: string;
  /** Resend API key (only use in server components or with proxy) */
  apiKey?: string;
  /** Analytics configuration */
  analytics?: AnalyticsConfig;
  /** Callback when submission is successful */
  onSuccess?: (data: any) => void;
  /** Callback when submission fails */
  onError?: (error: Error) => void;
}

interface UseWaitlistFormReturn {
  /** Current form state */
  formState: 'idle' | 'submitting' | 'success' | 'error';
  /** Form values */
  formValues: Record<string, string | boolean>;
  /** Validation results */
  validationResults: Record<string, { valid: boolean; message?: string }>;
  /** Error message */
  errorMessage: string;
  /** Honeypot field name */
  honeypotFieldName: string;
  /** Handle input change */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  /** Handle form submission */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** Reset form */
  resetForm: () => void;
}
```

### `useResendAudience`

```typescript
function useResendAudience(options: UseResendAudienceOptions): UseResendAudienceReturn;

interface UseResendAudienceOptions {
  /** Resend API key */
  apiKey?: string;
  /** Audience ID */
  audienceId: string;
  /** Proxy endpoint for client-side usage */
  proxyEndpoint?: string;
}

interface UseResendAudienceReturn {
  /** Add a contact to the audience */
  addContact: (contact: ResendContact) => Promise<ResendResponse>;
  /** Update a contact in the audience */
  updateContact: (id: string, contact: Partial<ResendContact>) => Promise<ResendResponse>;
  /** Remove a contact from the audience */
  removeContact: (id: string) => Promise<void>;
  /** Get a contact from the audience */
  getContact: (id: string) => Promise<ResendResponse>;
  /** List contacts in the audience */
  listContacts: () => Promise<ResendResponse[]>;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
}
```

## Utilities

### `createResendProxy`

```typescript
function createResendProxy(config: ResendProxyConfig): RequestHandler;

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
}
``` 