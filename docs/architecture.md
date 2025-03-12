# Architecture

This document provides an overview of the React Waitlist architecture, explaining how the different components interact and the data flows through the system.

## Design Philosophy

React Waitlist is designed as a **complete, self-contained solution** for creating waitlist forms. The architecture follows these key principles:

1. **Security First**: API keys and sensitive credentials should never be exposed in client-side code.

2. **Flexibility**: Support multiple integration patterns to accommodate different application architectures.

3. **Self-Contained**: All necessary components, utilities, and security features are included in the package.

4. **Developer Experience**: Provide a seamless experience for developers while maintaining security best practices.

The package includes both client-side components and server-side utilities that work together as a cohesive system. The server-side utilities are not external dependencies but an integral part of the package, designed to help you create secure endpoints that protect your API keys.

## Integration Options

React Waitlist offers three main integration patterns:

1. **Server Component**: For frameworks with server-side rendering support, the `ServerWaitlist` component handles everything on the server, keeping API keys secure.

2. **Client Component with Security Utilities**: For client-side React applications, the `WaitlistForm` component works with the included security utilities to create proxy endpoints that protect your API keys.

3. **Custom Integration**: Use event callbacks to integrate with your existing backend systems, giving you complete control over the data flow.

## Component Architecture

```mermaid
classDiagram
    class WaitlistForm {
        +props: WaitlistFormProps
        +render()
    }
    
    class ServerWaitlist {
        +props: ServerWaitlistProps
        +render()
    }
    
    class useWaitlistForm {
        +formState: string
        +formValues: object
        +validationResults: object
        +handleChange()
        +handleSubmit()
        +resetForm()
    }
    
    class useResendAudience {
        +addContact()
        +loading: boolean
        +error: Error
    }
    
    class useReCaptcha {
        +executeReCaptcha()
        +isLoaded: boolean
        +error: Error
    }
    
    class EventManager {
        +subscribe()
        +emit()
        +unsubscribe()
    }
    
    class SecurityUtilities {
        +createResendProxy()
        +createWebhookProxy()
        +createRecaptchaProxy()
    }
    
    WaitlistForm --> useWaitlistForm: uses
    ServerWaitlist --> useResendAudience: uses directly
    useWaitlistForm --> useResendAudience: uses (optional)
    useWaitlistForm --> useReCaptcha: uses (optional)
    WaitlistForm --> EventManager: uses
    SecurityUtilities --> useResendAudience: protects
```

## Data Flow

```mermaid
flowchart TD
    A[User Input] --> B[WaitlistForm Component]
    B --> C[Form Validation]
    C -->|Invalid| D[Display Errors]
    C -->|Valid| E{Security Checks}
    E -->|Honeypot/Timing| F[Bot Detection]
    F -->|Bot Detected| G[Reject Submission]
    F -->|Human| H{reCAPTCHA Enabled?}
    H -->|No| J[Process Submission]
    H -->|Yes| I[Verify with reCAPTCHA]
    I -->|Failed| G
    I -->|Passed| J
    J -->|Event: submit| K[Emit Events]
    J --> L{Integration Method?}
    
    L -->|Server Component| M1[Direct API Access]
    M1 --> O1[Success State]
    
    L -->|Client with Security Utils| M2[Call API via Proxy]
    M2 --> O2[Success State]
    
    L -->|Custom Integration| M3[Custom Handler]
    M3 --> O3[Success State]
    
    O1 -->|Event: success| K
    O2 -->|Event: success| K
    O3 -->|Event: success| K
    
    O1 --> Q{Webhooks Configured?}
    O2 --> Q
    O3 --> Q
    Q -->|Yes| R[Send Webhooks]
```

## Security Architecture

```mermaid
flowchart TD
    A[React Waitlist Package] --> B{Integration Method}
    
    B -->|Server Component| C[ServerWaitlist]
    C --> D[Direct API Access]
    D --> E[API Keys Secure on Server]
    
    B -->|Client with Security Utils| F[WaitlistForm]
    F --> G[Security Utilities]
    G --> H[Proxy Endpoints]
    H --> I[API Keys Secure on Server]
    
    B -->|Custom Integration| J[WaitlistForm with Callbacks]
    J --> K[Your Custom Backend]
    K --> L[API Keys Secure in Your Backend]
    
    A --> M[Built-in Security Features]
    M --> N[Honeypot Fields]
    M --> O[Submission Timing]
    M --> P[reCAPTCHA Integration]
    M --> Q[Input Validation]
    M --> R[Rate Limiting]
```

## Package Structure

```mermaid
flowchart TD
    A[react-waitlist Package] --> B[Components]
    B --> C[WaitlistForm.tsx]
    B --> D[FormField.tsx]
    B --> E[Other UI Components]
    
    A --> F[Hooks]
    F --> G[useWaitlistForm.ts]
    F --> H[useResendAudience.ts]
    F --> I[useReCaptcha.ts]
    F --> J[useWaitlistEvents.ts]
    
    A --> K[Utils]
    K --> L[validation.ts]
    K --> M[events.ts]
    K --> N[security.ts]
    
    A --> O[Server]
    O --> P[createResendProxy.ts]
    O --> Q[createWebhookProxy.ts]
    O --> R[createRecaptchaProxy.ts]
    O --> S[ServerWaitlist.tsx]
```

## Implementation Examples

### React (CRA/Vite) with Express Backend

```mermaid
sequenceDiagram
    participant User
    participant React as React App
    participant Express as Express Server
    participant Resend as Resend API
    
    User->>React: Fill and submit form
    React->>Express: POST /api/resend-proxy
    Express->>Resend: Add contact to audience
    Resend-->>Express: Response
    Express-->>React: Proxy response
    React->>User: Show success message
```

### Next.js Full-Stack Implementation

```mermaid
sequenceDiagram
    participant User
    participant Next as Next.js Frontend
    participant API as Next.js API Routes
    participant Resend as Resend API
    
    User->>Next: Fill and submit form
    Next->>API: POST /api/resend-proxy
    API->>Resend: Add contact to audience
    Resend-->>API: Response
    API-->>Next: Proxy response
    Next->>User: Show success message
```

### Next.js Server Component Implementation

```mermaid
sequenceDiagram
    participant User
    participant Next as Next.js Server Component
    participant Resend as Resend API
    
    User->>Next: View page with ServerWaitlist
    Next->>Next: Render ServerWaitlist
    User->>Next: Fill and submit form
    Next->>Resend: Direct API call (server-side)
    Resend-->>Next: Response
    Next->>User: Show success message
```

## Conclusion

React Waitlist is designed as a complete solution that prioritizes both security and developer experience. By providing multiple integration options and including all necessary security utilities within the package, it offers a self-contained system for creating secure and customizable waitlist forms. 