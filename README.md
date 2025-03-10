# React Waitlist

A customizable waitlist component for React that integrates with Resend audiences.

## Features

- 🔒 Secure integration with Resend audiences
- 🎨 Fully customizable UI with theming support
- 🤖 Bot and spam protection
- ♿ Accessibility built-in
- 📊 Analytics tracking
- 🔌 Easy to integrate with any React application
- 🔔 Event system for client-side integrations
- 🪝 Webhook support for integration with external systems

## Installation

```bash
npm install react-waitlist
# or
yarn add react-waitlist
```

## Basic Usage

```jsx
import { WaitlistForm } from 'react-waitlist';
// or
// import WaitlistForm from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      resendAudienceId="your_audience_id"
      resendProxyEndpoint="/api/resend-proxy"
    />
  );
}
```

## Server-Side Usage (Next.js App Router)

```jsx
import { ServerWaitlist } from 'react-waitlist/server';

export default function Page() {
  return (
    <ServerWaitlist 
      apiKey={process.env.RESEND_API_KEY}
      resendAudienceId="your_audience_id"
    />
  );
}
```

## Proxy API Setup

For client-side usage, proxy endpoints are strongly recommended to protect your sensitive credentials:

### Resend Proxy (for API key protection)

```jsx
// pages/api/resend-proxy.js (Next.js Pages Router)
import { createResendProxy } from 'react-waitlist/server';

export default createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your_audience_id'],
});
```

```jsx
// app/api/resend-proxy/route.js (Next.js App Router)
import { NextResponse } from 'next/server';
import { createResendProxy } from 'react-waitlist/server';

const proxyHandler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your_audience_id'],
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

### Webhook Proxy (for secure webhook delivery)

```jsx
// pages/api/webhook-proxy.js (Next.js Pages Router)
import { createWebhookProxy } from 'react-waitlist/server';

export default createWebhookProxy({
  secretKey: process.env.WEBHOOK_SECRET_KEY,
  allowedDestinations: ['https://your-api.com'],
});
```

```jsx
// app/api/webhook-proxy/route.js (Next.js App Router)
import { NextResponse } from 'next/server';
import { createWebhookProxy } from 'react-waitlist/server';

const proxyHandler = createWebhookProxy({
  secretKey: process.env.WEBHOOK_SECRET_KEY,
  allowedDestinations: ['https://your-api.com'],
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

> **Security Recommendation**: For client-side usage, using proxy endpoints is strongly recommended to protect sensitive credentials. The component will display warnings in the console when potential security risks are detected.

## Customization

```jsx
<WaitlistForm 
  resendAudienceId="your_audience_id"
  resendProxyEndpoint="/api/resend-proxy"
  
  // Content
  title="Join our waitlist"
  description="Be the first to know when we launch"
  submitText="Join waitlist"
  successTitle="You're on the list!"
  successDescription="Thank you for joining our waitlist. We'll keep you updated."
  
  // Custom fields
  fields={[
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'firstName', type: 'text', required: false, label: 'First Name' },
    { name: 'company', type: 'text', required: false, label: 'Company' },
    { 
      name: 'role', 
      type: 'select', 
      options: ['Developer', 'Designer', 'Product Manager', 'Other'],
      label: 'Role',
      metadata: true
    }
  ]}
  
  // Theme
  theme={{
    colors: {
      primary: '#3182CE',
      secondary: '#805AD5',
      // ...
    },
    // ...
  }}
  
  // Webhooks
  webhooks={[
    {
      url: "https://your-webhook-endpoint.com/hook",
      events: ["success"],
      includeAllFields: true
    }
  ]}
  webhookProxyEndpoint="/api/webhook-proxy"
  
  // Event callbacks
  onView={({ timestamp }) => console.log('Form viewed at', timestamp)}
  onSubmit={({ formData }) => console.log('Form submitted with', formData)}
  onSuccess={({ response }) => console.log('Success:', response)}
  onError={({ error }) => console.error('Error:', error)}
/>
```

## Documentation

For full documentation and examples, visit our [Storybook documentation](https://pmatheusvinhas.github.io/react-waitlist/).

Additional documentation:
- [Getting Started](https://github.com/pmatheusvinhas/react-waitlist/blob/main/docs/getting-started.md)
- [API Reference](https://github.com/pmatheusvinhas/react-waitlist/blob/main/docs/api-reference.md)
- [Customization](https://github.com/pmatheusvinhas/react-waitlist/blob/main/docs/customization.md)
- [Webhooks](https://github.com/pmatheusvinhas/react-waitlist/blob/main/docs/webhooks.md)
- [Events](https://github.com/pmatheusvinhas/react-waitlist/blob/main/docs/events.md)
- [Accessibility](https://github.com/pmatheusvinhas/react-waitlist/blob/main/docs/accessibility.md)
- [Security](https://github.com/pmatheusvinhas/react-waitlist/blob/main/docs/security.md)
- [Changelog](https://github.com/pmatheusvinhas/react-waitlist/blob/main/CHANGELOG.md)

## License

MIT 