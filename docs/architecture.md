# Architecture

This document provides an in-depth look at the architecture of the React Waitlist component.

## High-Level Overview

React Waitlist is designed with a modular architecture that separates concerns, making it easy to maintain and extend. The main components are:

```mermaid
graph TD
    A[WaitlistForm Component] --> B[Core Logic]
    A --> C[UI Rendering]
    B --> D[Validation]
    B --> E[Security]
    B --> F[Events]
    A --> G[Hooks]
    G --> H[useResendAudience]
    G --> I[useReCaptcha]
    G --> J[useWaitlistEvents]
    A --> K[Accessibility]
    K --> L[AriaProvider]
    K --> M[Screen Reader]
    N[Server] --> O[Proxy Endpoints]
    O --> P[Resend API]
    O --> Q[reCAPTCHA API]
    O --> R[Webhook Handler]
```

## Component Structure

### Main Components

```mermaid
graph TD
    A[WaitlistForm] --> B[WaitlistFormInner]
    B --> C[AriaProvider]
    C --> D[Form Fields]
    C --> E[Submit Button]
    C --> F[Success Message]
    C --> G[Error Message]
```

The `WaitlistForm` is the main exported component that users interact with. It wraps the `WaitlistFormInner` component with an `AriaProvider` for accessibility support.

## Core Logic

The core logic is organized into the following modules:

```mermaid
graph LR
    A[Core] --> B[Types]
    A --> C[Validation]
    A --> D[Security]
    A --> E[Events]
    A --> F[Theme]
    A --> G[Animations]
    A --> H[Fonts]
    A --> I[Adapters]
    A --> J[reCAPTCHA]
    A --> K[Webhook]
```

- **Types**: TypeScript interfaces and types for the component API
- **Validation**: Form validation logic
- **Security**: Bot protection and security measures
- **Events**: Event handling and publish-subscribe event bus system
- **Theme**: Theming and styling utilities
- **Animations**: Animation utilities
- **Fonts**: Font loading utilities
- **Adapters**: Framework adapters for different UI libraries
- **reCAPTCHA**: Google reCAPTCHA integration
- **Webhook**: Webhook handling

## Events System

The events system is built on a publish-subscribe (pub/sub) pattern, implemented as an event bus. This architecture allows components to emit events and subscribe to them without tight coupling.

```mermaid
graph TD
    A[WaitlistForm] -->|emits| B[EventBus]
    B -->|notifies| C[onFieldFocus Handler]
    B -->|notifies| D[onSubmit Handler]
    B -->|notifies| E[onSuccess Handler]
    B -->|notifies| F[onError Handler]
    B -->|notifies| G[onSecurityEvent Handler]
    B -->|notifies| H[Custom Subscribers]
    I[useWaitlistEvents] -->|interacts with| B
```

The event system handles various types of events:
- Field focus events
- Form submission events
- Success events
- Error events
- Security-related events

For a detailed explanation of the events system, see the [Events System Documentation](./events.md).

## Hooks

Custom React hooks provide functionality for different aspects of the component:

```mermaid
graph TD
    A[Hooks] --> B[useResendAudience]
    A --> C[useReCaptcha]
    A --> D[useWaitlistEvents]
    A --> E[useWaitlistForm]
    B --> F[Resend API]
    C --> G[reCAPTCHA API]
    D --> H[Event Bus]
    E --> B
    E --> C
    E --> D
```

- **useResendAudience**: Manages integration with Resend audiences
- **useReCaptcha**: Handles reCAPTCHA verification
- **useWaitlistEvents**: Provides event handling functionality
- **useWaitlistForm**: Combines the above hooks for form handling

## Server-Side Components

The server-side components provide proxy endpoints for secure API access:

```mermaid
graph TD
    A[Server] --> B[Proxy]
    A --> C[reCAPTCHA Proxy]
    A --> D[Webhook Proxy]
    B --> E[Resend API]
    C --> F[reCAPTCHA API]
    D --> G[Custom Webhooks]
```

- **Proxy**: Proxies requests to the Resend API
- **reCAPTCHA Proxy**: Verifies reCAPTCHA tokens without exposing the secret key
- **Webhook Proxy**: Handles webhook requests

## Data Flow

The following diagram shows the flow of data through the component:

```mermaid
sequenceDiagram
    participant User
    participant Form
    participant Validation
    participant Security
    participant EventBus
    participant ResendHook
    participant RecaptchaHook
    participant Proxy
    participant Resend
    participant reCAPTCHA

    User->>Form: Fill form & submit
    Form->>EventBus: Emit field_focus event
    Form->>Validation: Validate input
    Validation-->>Form: Validation result
    
    alt if valid
        Form->>EventBus: Emit submit event
        Form->>Security: Check for bots
        Security->>RecaptchaHook: Verify user
        RecaptchaHook->>reCAPTCHA: Get token
        reCAPTCHA-->>RecaptchaHook: Token
        RecaptchaHook->>Proxy: Verify token
        Proxy->>reCAPTCHA: Verify with secret
        reCAPTCHA-->>Proxy: Verification result
        Proxy-->>RecaptchaHook: Verification result
        RecaptchaHook-->>Security: Human/bot result
        
        alt if human
            Form->>ResendHook: Add to audience
            ResendHook->>Proxy: Send contact data
            Proxy->>Resend: Add contact
            Resend-->>Proxy: Success/error
            Proxy-->>ResendHook: Success/error
            ResendHook-->>Form: Success/error
            
            alt if success
                Form->>EventBus: Emit success event
                EventBus-->>User: Success message
            else if error
                Form->>EventBus: Emit error event
                EventBus-->>User: Error message
            end
        else if bot
            Security->>EventBus: Emit security event
            EventBus-->>Form: Bot detected
            Form-->>User: Error message
        end
    else if invalid
        Form->>EventBus: Emit error event
        EventBus-->>User: Validation error
    end
```

This diagram illustrates how events are emitted at various points in the data flow process, allowing for extensibility and custom behavior at each step.

## Configuration Options

The component can be configured with various options:

```mermaid
graph TD
    A[Configuration] --> B[Form Fields]
    A --> C[Theming]
    A --> D[Security]
    A --> E[Accessibility]
    A --> F[Events]
    A --> G[Resend Integration]
    A --> H[Webhooks]
```

For detailed configuration options, see the [API Reference](./api.md).

## Framework Integration

React Waitlist provides adapters for popular CSS frameworks:

```mermaid
graph TD
    A[Framework Adapters] --> B[Default]
    A --> C[Tailwind CSS]
    A --> D[Material UI]
    A --> E[Custom]
```

These adapters transform the component's theme configuration to match the target framework's styling conventions. Currently, we provide built-in support for:

- **Default**: A clean, neutral styling that works well in most contexts
- **Tailwind CSS**: Optimized for use with Tailwind CSS classes
- **Material UI**: Follows Material Design guidelines 

You can also create custom adapters for your preferred framework or design system.

## Module Dependency

The dependency graph shows how the modules depend on each other:

```mermaid
graph TD
    A[WaitlistForm] --> B[Core Types]
    A --> C[Hooks]
    A --> D[A11y]
    C --> B
    D --> B
    A --> E[Security]
    E --> B
    A --> F[Validation]
    F --> B
    A --> G[Events]
    G --> B
    A --> H[Theme]
    H --> B
```

This modular design allows for easy maintenance and extension of the component. 

## Related Documentation

For more information on specific aspects of the architecture:

- [API Reference](./api.md): Complete API documentation
- [Events System](./events.md): Detailed guide to the events system
- [Security](./security.md): Security features and best practices 