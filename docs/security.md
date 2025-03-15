# Security

This document outlines the security features of React Waitlist and best practices for secure implementation.

## Security Features

React Waitlist includes multiple layers of security to protect against spam, bots, and other malicious activities:

### 1. Honeypot Fields

Honeypot fields are invisible form fields that are not visible to human users but are typically filled out by bots. The component automatically adds a honeypot field when enabled:

```jsx
<WaitlistForm
  security={{
    enableHoneypot: true // Default: true
  }}
/>
```

**How it works:**
- A hidden field is added to the form with CSS that makes it invisible to humans.
- Bots often fill out all fields in a form, including hidden ones.
- If the honeypot field has a value when the form is submitted, the submission is rejected.

### 2. Submission Time Validation

This feature detects submissions that happen too quickly to be from real users:

```jsx
<WaitlistForm
  security={{
    checkSubmissionTime: true, // Default: true
    minSubmissionTime: 3000 // Default: 3000 (3 seconds)
  }}
/>
```

**How it works:**
- The component records the time when the form is rendered.
- When the form is submitted, it checks how much time has elapsed.
- If the submission happened too quickly (less than the `minSubmissionTime`), it's likely automated and rejected.

### 3. Google reCAPTCHA v3

Google reCAPTCHA v3 provides invisible bot detection that scores user interactions:

```jsx
<WaitlistForm
  security={{
    enableReCaptcha: true,
    reCaptchaSiteKey: "YOUR_RECAPTCHA_SITE_KEY",
    recaptchaProxyEndpoint: "/api/recaptcha-proxy"
  }}
/>
```

**How it works:**
- reCAPTCHA v3 runs in the background and scores user interactions from 0.0 to 1.0.
- When the form is submitted, a token is generated and sent to the proxy endpoint.
- The proxy endpoint verifies the token with Google's API using your secret key.
- If the score is below the threshold (default 0.5), the submission is rejected.

### 4. Rate Limiting

The proxy endpoints include built-in rate limiting to prevent abuse:

```js
// In your proxy handler
createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  rateLimit: {
    max: 5,  // 5 requests
    windowSec: 60  // per minute
  }
})
```

**How it works:**
- The proxy endpoint tracks requests by IP address.
- If an IP address exceeds the allowed number of requests in the time window, subsequent requests are rejected.
- This prevents attackers from making excessive requests to your API.

### 5. Server-Side Validation

All proxy endpoints perform server-side validation of requests:

```js
// In your proxy handler
createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: [process.env.RESEND_AUDIENCE_ID],
  // Required fields validation happens automatically
})
```

**How it works:**
- The proxy endpoints validate all incoming requests.
- They check for required fields, proper formatting, and allowed values.
- This prevents malicious requests with invalid data.

## Secure Implementation

### API Key Protection

Never expose API keys in client-side code:

```jsx
// ❌ WRONG - Exposes API key in the browser
<WaitlistForm
  apiKey="YOUR_RESEND_API_KEY"
  resendAudienceId="YOUR_AUDIENCE_ID"
/>

// ✅ CORRECT - Uses a proxy endpoint
<WaitlistForm
  resendAudienceId="YOUR_AUDIENCE_ID"
  resendProxyEndpoint="/api/resend-proxy"
/>
```

### Proxy Endpoint Implementation

Properly implement proxy endpoints with error handling:

```js
// pages/api/resend-proxy.js
import { createResendProxy } from 'react-waitlist/server';

const handler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: [process.env.RESEND_AUDIENCE_ID],
  rateLimit: {
    max: 5,
    windowSec: 60
  }
});

export default async function resendProxyHandler(req, res) {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Resend proxy error:', error);
    
    // Don't expose internal error details
    res.status(500).json({ 
      error: 'An error occurred while processing your request'
    });
  }
}
```

### Environmental Variables

Store sensitive information in environment variables:

```
# .env.local
RESEND_API_KEY=re_123456789
RESEND_AUDIENCE_ID=aud_123456789
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

## Security Best Practices

### Enable All Security Features

For maximum protection, enable all security features:

```jsx
<WaitlistForm
  security={{
    enableHoneypot: true,
    checkSubmissionTime: true,
    minSubmissionTime: 3000,
    enableReCaptcha: true,
    reCaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    recaptchaProxyEndpoint: "/api/recaptcha-proxy"
  }}
/>
```

### Monitor Security Events

Use the `onSecurityEvent` handler to monitor security-related events:

```jsx
<WaitlistForm
  // ... other props
  onSecurityEvent={(data) => {
    console.log('Security event:', data.securityType, data.details);
    
    // Log to your analytics or monitoring system
    reportSecurityEvent(data);
  }}
/>
```

### Adjust Security Settings Based on Threat Level

You can adjust security settings based on your needs:

```jsx
<WaitlistForm
  security={{
    // Basic protection for low-risk applications
    enableHoneypot: true,
    checkSubmissionTime: true,
    
    // Add reCAPTCHA for higher-risk applications
    enableReCaptcha: true,
    reCaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    recaptchaProxyEndpoint: "/api/recaptcha-proxy"
  }}
/>
```

### Additional Server-Side Protection

For mission-critical applications, add additional server-side protection:

```js
// Additional validation in your server-side code
createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: [process.env.RESEND_AUDIENCE_ID],
  rateLimit: {
    max: 3,  // Stricter rate limiting
    windowSec: 60
  },
  // Enable debug mode for monitoring
  debug: true
})
```

## Security Considerations for High-Load Applications

For applications expecting high traffic or at risk of targeted attacks:

1. **Implement CORS restrictions**:
   ```js
   // In your API route
   res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
   ```

2. **Use a CDN with DDoS protection**:
   - Deploy your application behind Cloudflare or similar services.

3. **Implement IP-based rate limiting**:
   - Use middleware like rate-limit with Redis to track and limit requests across multiple servers.

4. **Log and analyze security events**:
   - Set up monitoring for security events to detect attack patterns.

5. **Consider multi-factor verification for high-value waitlists**:
   - Email verification link
   - SMS verification
   - Social account verification 