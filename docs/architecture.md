# Architecture

This document provides an overview of the React Waitlist architecture, explaining how the different components interact and the data flows through the system.

## Component Architecture

```mermaid
classDiagram
    class WaitlistForm {
        +props: WaitlistFormProps
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
    
    WaitlistForm --> useWaitlistForm: uses
    useWaitlistForm --> useResendAudience: uses (optional)
    useWaitlistForm --> useReCaptcha: uses (optional)
    WaitlistForm --> EventManager: uses
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
    J --> L{Resend Integration?}
    L -->|Yes| M[Call Resend API via Proxy]
    L -->|No| N[Custom Handler]
    M -->|Success| O[Success State]
    M -->|Error| P[Error State]
    N -->|Success| O
    N -->|Error| P
    O -->|Event: success| K
    P -->|Event: error| K
    O --> Q{Webhooks Configured?}
    Q -->|Yes| R[Send Webhooks]
```

## Integration Options

```mermaid
flowchart LR
    A[React Waitlist] --> B{Frontend Framework}
    B --> C[React/CRA]
    B --> D[Next.js]
    B --> E[Vite]
    B --> F[Other React Frameworks]
    
    A --> G{Backend Options}
    G --> H[Express.js]
    G --> I[Next.js API Routes]
    G --> J[Serverless Functions]
    G --> K[Firebase Functions]
    G --> L[Custom Backend]
    
    A --> M{Integration Options}
    M --> N[Resend Audiences]
    M --> O[Custom Database]
    M --> P[CRM Systems]
    M --> Q[Marketing Tools]
```

## Security Architecture

```mermaid
flowchart TD
    A[Client-Side Component] --> B{API Keys Exposed?}
    B -->|Yes| C[Security Risk!]
    B -->|No| D[Secure Implementation]
    
    A --> E[Proxy Endpoints]
    E --> F[API Key Protection]
    E --> G[Rate Limiting]
    E --> H[Audience Restriction]
    
    A --> I[Bot Protection]
    I --> J[Honeypot Fields]
    I --> K[Submission Timing]
    I --> L[reCAPTCHA v3]
```

## Client-Side vs Server-Side Usage

```mermaid
flowchart TD
    A[React Waitlist] --> B{Deployment Type}
    
    B -->|Client-Side| C[WaitlistForm Component]
    C --> D[Requires Proxy Endpoints]
    D --> E[Backend Services]
    E --> F[Resend API]
    
    B -->|Server-Side| G[ServerWaitlist Component]
    G --> H[Direct API Access]
    H --> F
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

### Serverless Implementation

```mermaid
sequenceDiagram
    participant User
    participant React as React App
    participant Lambda as AWS Lambda
    participant Resend as Resend API
    
    User->>React: Fill and submit form
    React->>Lambda: POST /api/resend-proxy
    Lambda->>Resend: Add contact to audience
    Resend-->>Lambda: Response
    Lambda-->>React: Proxy response
    React->>User: Show success message
``` 