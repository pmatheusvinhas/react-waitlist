# Getting Started

This guide will help you get started with React Waitlist, a customizable waitlist component for React that integrates with Resend audiences.

## Installation

### Frontend (React application)

```bash
npm install react-waitlist
# or
yarn add react-waitlist
```

### Backend (Optional but recommended for security)

```bash
npm install react-waitlist/server
# or
yarn add react-waitlist/server
```

## Integration Options

React Waitlist offers multiple integration options to fit your application architecture:

### 1. Server-Side Rendering (SSR) Integration

For frameworks with server-side rendering support (Next.js App Router, Remix, etc.), use the `ServerWaitlist` and `ClientWaitlist` components to keep API keys secure on the server:

```jsx
// app/page.js (Next.js App Router)
import { ServerWaitlist, ClientWaitlist } from 'react-waitlist/server';

export default function Home() {
  return (
    <main>
      <h1>My Awesome Product</h1>
      {/* Server Component - Renders a placeholder */}
      <ServerWaitlist 
        apiKey={process.env.RESEND_API_KEY} // Securely used on the server
        resendAudienceId="your_audience_id"
        title="Join Our Waitlist"
        description="Be the first to know when we launch."
        submitText="Join Now"
        fields={[
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            required: true,
            placeholder: 'your@email.com',
          },
          {
            name: 'firstName',
            type: 'text',
            label: 'First Name',
            required: false,
            placeholder: 'John',
          }
        ]}
        theme={{
          colors: {
            primary: '#0070f3',
          }
        }}
      />
      {/* Client Component - Hydrates the placeholder */}
      <ClientWaitlist />
    </main>
  );
}
```

#### How Server-Side Rendering Works

1. The `ServerWaitlist` component runs on the server and:
   - Securely handles API keys and sensitive configuration
   - Renders a placeholder with serialized props
   - Does not use any React hooks or client-side code

2. The `ClientWaitlist` component runs on the client and:
   - Has the `'use client'` directive
   - Finds the placeholder rendered by ServerWaitlist
   - Extracts the serialized props
   - Hydrates the form with the actual interactive component
   - Handles all client-side interactivity

This approach ensures that sensitive information like API keys stays on the server while providing a seamless user experience with client-side interactivity.

### 2. Client-Side with Security Utilities

For client-side React applications, use the included security utilities to create proxy endpoints that protect your API keys:

```jsx
// Frontend component
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      resendAudienceId="your_audience_id"
      resendProxyEndpoint="/api/resend-proxy"
    />
  );
}

// Backend proxy (part of this package)
// api/resend-proxy.js
import { createResendProxy } from 'react-waitlist/server';

export default createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your_audience_id'],
});
```

### 3. Custom Integration with Your Own Backend

Use event callbacks to integrate with your existing backend systems:

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      onSuccess={({ formData }) => {
        // Handle successful submission with your own backend
        fetch('https://your-api.com/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }}
    />
  );
}
```

## Basic Usage

### Frontend (React)

React Waitlist can be integrated with various systems through different methods:

#### Simple Usage with Custom Handlers

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      onSuccess={({ formData }) => {
        // Handle successful submission
        console.log('Form submitted successfully:', formData);
        // You could save to your database here
        saveToDatabase(formData);
        // Or integrate with your CRM
        sendToCRM(formData);
        // Or add to your marketing tool
        addToMailingList(formData);
      }}
      onError={({ error }) => {
        console.error('Error submitting form:', error);
      }}
    />
  );
}
```

#### With Resend Integration

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      resendAudienceId="your_audience_id"
      resendProxyEndpoint="https://your-api.com/api/resend-proxy"
    />
  );
}
```

#### With Webhooks for External Systems

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      webhooks={[
        {
          url: "https://your-api.com/webhook",
          events: ["success"],
          includeAllFields: true
        }
      ]}
      webhookProxyEndpoint="https://your-api.com/api/webhook-proxy"
    />
  );
}
```

#### Combining Multiple Integration Methods

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      // Resend integration
      resendAudienceId="your_audience_id"
      resendProxyEndpoint="https://your-api.com/api/resend-proxy"
      
      // Event callbacks
      onSuccess={({ formData, response }) => {
        // Custom logic after successful submission
        trackConversion(formData);
      }}
      
      // Webhooks for external systems
      webhooks={[
        {
          url: "https://your-crm.com/api/leads",
          events: ["success"]
        }
      ]}
      webhookProxyEndpoint="https://your-api.com/api/webhook-proxy"
    />
  );
}
```

## Backend Setup (Optional but Recommended)

For security reasons, it's recommended to use proxy endpoints to protect your API keys and credentials.

### Express.js Backend

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const { createResendProxy } = require('react-waitlist/server');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/resend-proxy', createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your_audience_id'],
}));

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### Next.js API Routes

```javascript
// pages/api/resend-proxy.js (Next.js Pages Router)
import { createResendProxy } from 'react-waitlist/server';

export default createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your_audience_id'],
});
```

```javascript
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

## Customization

React Waitlist is highly customizable. Here are some examples:

### Custom Fields

```jsx
<WaitlistForm 
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
/>
```

### Custom Styling

```jsx
<WaitlistForm 
  theme={{
    colors: {
      primary: '#3182CE',
      secondary: '#805AD5',
      background: '#F7FAFC',
      text: '#2D3748',
      error: '#E53E3E',
      success: '#38A169',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      full: '9999px',
    },
  }}
/>
```

### Custom Content

```jsx
<WaitlistForm 
  title="Join our exclusive beta"
  description="Get early access to our revolutionary product."
  submitText="Request Access"
  successTitle="You're on the list!"
  successDescription="Thank you for joining our waitlist. We'll keep you updated on our progress."
/>
```

## Next Steps

Now that you have React Waitlist integrated into your application, you might want to explore:

- [API Reference](./api-reference.md) - Detailed documentation of all available props and options
- [Customization](./customization.md) - Learn how to customize the appearance and behavior
- [Webhooks](./webhooks.md) - Integrate with external systems using webhooks
- [Events](./events.md) - Use the event system for analytics and custom integrations
- [reCAPTCHA](./recaptcha.md) - Add reCAPTCHA protection to your form
- [Accessibility](./accessibility.md) - Learn about the accessibility features
- [Security](./security.md) - Understand the security features and best practices 