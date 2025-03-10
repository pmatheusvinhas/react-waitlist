# Security Considerations

React Waitlist is designed with security in mind. This document outlines the security features and best practices for using the component.

## Protecting Your API Key

The Resend API key is a sensitive credential that should never be exposed to the client. React Waitlist provides two approaches to protect your API key:

### 1. Server Components

For frameworks that support React Server Components (Next.js App Router, Remix, etc.), you can use the `ServerWaitlist` component, which keeps the API key on the server:

```jsx
import { ServerWaitlist } from 'react-waitlist/server';

export default function WaitlistPage() {
  return (
    <ServerWaitlist 
      apiKey={process.env.RESEND_API_KEY} // Safely used on the server
      audienceId="your-audience-id"
    />
  );
}
```

### 2. Proxy API

For client-side usage, you should create a proxy API endpoint that securely handles the communication with Resend:

```jsx
// pages/api/resend-proxy.js (Next.js)
import { createResendProxy } from 'react-waitlist/server';

export default createResendProxy({
  apiKey: process.env.RESEND_API_KEY, // Kept on the server
  allowedAudiences: ['your-audience-id'], // Restrict to specific audiences
  rateLimit: {
    max: 10, // Maximum 10 requests
    windowSec: 60, // Per minute
  },
});
```

Then, use the client-side component with the proxy endpoint:

```jsx
import { Waitlist } from 'react-waitlist';

function HomePage() {
  return (
    <Waitlist 
      audienceId="your-audience-id"
      proxyEndpoint="/api/resend-proxy" // No API key needed on the client
    />
  );
}
```

## Bot Protection

React Waitlist includes several features to protect against spam and bot submissions:

### Honeypot Field

A honeypot field is an invisible field that humans won't fill out, but bots might. This is enabled by default:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  security={{
    enableHoneypot: true, // Default: true
  }}
/>
```

### Submission Time Check

Bots typically fill out forms much faster than humans. This check detects suspiciously fast submissions:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  security={{
    checkSubmissionTime: true, // Default: true
  }}
/>
```

### reCAPTCHA Integration

For additional protection, you can integrate with Google reCAPTCHA:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  security={{
    enableReCaptcha: true,
    reCaptchaSiteKey: 'your-recaptcha-site-key',
  }}
/>
```

## Rate Limiting

The proxy API includes rate limiting to prevent abuse:

```jsx
createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  rateLimit: {
    max: 10, // Maximum 10 requests
    windowSec: 60, // Per minute
  },
});
```

## Audience Restriction

You can restrict the proxy to only allow specific audience IDs:

```jsx
createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['audience-id-1', 'audience-id-2'],
});
```

## Input Validation

All user inputs are validated both on the client and server side to prevent injection attacks and ensure data integrity.

## HTTPS

Always serve your application over HTTPS to ensure that the data transmitted between the client and server is encrypted.

## Content Security Policy (CSP)

Consider implementing a Content Security Policy to prevent XSS attacks. Here's an example CSP that works with React Waitlist:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; frame-src https://www.google.com/recaptcha/; style-src 'self' 'unsafe-inline';">
```

## Security Headers

Consider adding security headers to your application:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## Regular Updates

Keep your dependencies up to date to ensure you have the latest security patches. 