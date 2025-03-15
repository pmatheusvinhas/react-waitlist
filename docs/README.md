# React Waitlist

A lightweight, customizable waitlist component for React applications with Resend integration.

## Overview

React Waitlist is a standalone component that allows you to easily add a waitlist signup form to your React application. It integrates seamlessly with [Resend](https://resend.com) to collect and manage your waitlist subscribers.

The component is designed to be:
- **Easy to use**: Simple API with sensible defaults
- **Customizable**: Extensive theming options
- **Secure**: Built-in protections against spam and bots
- **Accessible**: WCAG compliant with screen reader support
- **Framework-agnostic**: Works with any React framework

## Table of Contents

- [React Waitlist](#react-waitlist)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
    - [Client-side Usage with Proxy](#client-side-usage-with-proxy)
    - [Setting Up Proxy Endpoints](#setting-up-proxy-endpoints)
      - [Next.js Example](#nextjs-example)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Security](#security)
    - [Honeypot Fields](#honeypot-fields)
    - [Submission Time Checks](#submission-time-checks)
    - [Google reCAPTCHA v3](#google-recaptcha-v3)
    - [Rate Limiting](#rate-limiting)
  - [Examples](#examples)
  - [License](#license)

## Installation

```bash
npm install react-waitlist
# or
yarn add react-waitlist
# or
pnpm add react-waitlist
```

## Quick Start

### Client-side Usage with Proxy

For client-side usage, it's recommended to use a proxy endpoint to protect your API keys:

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
      submitText="Join Now"
      
      // Resend integration
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
      
      // Security features
      security={{
        enableHoneypot: true,
        checkSubmissionTime: true,
        enableReCaptcha: true,
        reCaptchaSiteKey: "YOUR_RECAPTCHA_SITE_KEY",
        recaptchaProxyEndpoint: "/api/recaptcha-proxy"
      }}
      
      // Event handlers
      onSuccess={(data) => console.log('Success:', data)}
      onError={(data) => console.error('Error:', data)}
    />
  );
}
```

### Setting Up Proxy Endpoints

Create proxy API routes to securely handle API requests:

#### Next.js Example

```js
// pages/api/resend-proxy.js
import { createResendProxy } from 'react-waitlist/server';

const handler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: [process.env.RESEND_AUDIENCE_ID],
  // Optional rate limiting
  rateLimit: {
    max: 5,  // 5 requests
    windowSec: 60  // per minute
  }
});

export default async function resendProxyHandler(req, res) {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Resend proxy error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
```

```js
// pages/api/recaptcha-proxy.js
import { createRecaptchaProxy } from 'react-waitlist/server';

const handler = createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5,
  allowedActions: ['submit_waitlist']
});

export default async function recaptchaProxyHandler(req, res) {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('reCAPTCHA proxy error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
```

## Features

- **Resend Integration**: Easily add subscribers to your Resend audience
- **Customizable Form Fields**: Define the data you want to collect
- **Theming**: Extensive theming options with framework compatibility
- **Security Features**:
  - Honeypot fields to catch bots
  - Submission time checks
  - Google reCAPTCHA v3 integration
  - Rate limiting on proxy endpoints
- **Accessibility**: ARIA attributes, keyboard navigation, screen reader announcements
- **Event Handlers**: React to form events (focus, submit, success, error)
- **Framework Compatibility**: Adapters for popular CSS frameworks

## Architecture

React Waitlist is built with a modular architecture that separates concerns:

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

For more details, see the [Architecture Documentation](./architecture.md).

## Security

React Waitlist includes multiple security measures to protect against spam and bots:

### Honeypot Fields

Invisible fields that bots tend to fill out but real users cannot see:

```jsx
<WaitlistForm
  security={{
    enableHoneypot: true
  }}
/>
```

### Submission Time Checks

Detects submissions that happen too quickly to be from real users:

```jsx
<WaitlistForm
  security={{
    checkSubmissionTime: true,
    minSubmissionTime: 2000 // 2 seconds
  }}
/>
```

### Google reCAPTCHA v3

Invisible CAPTCHA that scores user behavior:

```jsx
<WaitlistForm
  security={{
    enableReCaptcha: true,
    reCaptchaSiteKey: "YOUR_RECAPTCHA_SITE_KEY",
    recaptchaProxyEndpoint: "/api/recaptcha-proxy"
  }}
/>
```

### Rate Limiting

Built-in rate limiting on proxy endpoints prevents abuse:

```js
createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  rateLimit: {
    max: 5,  // 5 requests
    windowSec: 60  // per minute
  }
})
```

For more details, see the [Security Documentation](./security.md).

## Examples

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
      submitText="Join Now"
      
      // Resend integration
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
      
      // Security features
      security={{
        enableHoneypot: true,
        checkSubmissionTime: true,
        enableReCaptcha: true,
        reCaptchaSiteKey: "YOUR_RECAPTCHA_SITE_KEY",
        recaptchaProxyEndpoint: "/api/recaptcha-proxy"
      }}
      
      // Event handlers
      onSuccess={(data) => console.log('Success:', data)}
      onError={(data) => console.error('Error:', data)}
    />
  );
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.