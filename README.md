# React Waitlist

A customizable waitlist component for React that integrates with Resend audiences.

## Features

- 🔒 Secure integration with Resend audiences
- 🎨 Fully customizable UI with theming support
- 🤖 Bot and spam protection
- ♿ Accessibility built-in
- 📊 Analytics tracking
- 🔌 Easy to integrate with any React application

## Installation

```bash
npm install react-waitlist
# or
yarn add react-waitlist
```

## Basic Usage

```jsx
import Waitlist from 'react-waitlist';

function App() {
  return (
    <Waitlist 
      audienceId="your_audience_id"
      proxyEndpoint="/api/resend-proxy"
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
      audienceId="your_audience_id"
    />
  );
}
```

## Proxy API Setup

For client-side usage, you need to set up a proxy endpoint to protect your Resend API key:

```jsx
// pages/api/resend-proxy.js (Next.js)
import { createResendProxy } from 'react-waitlist/proxy';

export default createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your_audience_id'],
});
```

## Customization

```jsx
<Waitlist 
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
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
  
  // Callbacks
  onSuccess={(data) => console.log('Success:', data)}
  onError={(error) => console.error('Error:', error)}
/>
```

## Documentation

For full documentation, visit [our documentation site](https://react-waitlist.docs.example.com).

## License

MIT 