# Getting Started with React Waitlist

React Waitlist is a customizable waitlist component for React that integrates with Resend audiences. It allows you to easily collect and manage waitlist signups for your product or service.

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

## Basic Usage

React Waitlist is highly flexible and can be integrated with various systems. Here are some common usage patterns:

### Simple Usage with Callbacks

The simplest way to use React Waitlist is with event callbacks to integrate with your own systems:

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
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

### Integration with Resend Audiences

For integration with Resend audiences, you'll need to set up a proxy endpoint to protect your API key:

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      resendAudienceId="your_audience_id"
      resendProxyEndpoint="https://your-api.com/api/resend-proxy"
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
    />
  );
}
```

### Using Webhooks for External Integrations

You can use webhooks to send form data to external systems:

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <WaitlistForm 
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
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

### Combining Multiple Integration Methods

You can combine different integration methods for maximum flexibility:

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
      
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
    />
  );
}
```

## Backend Setup (Optional but Recommended)

For security reasons, it's recommended to use proxy endpoints to protect your API keys and credentials. The implementation depends on your backend technology.

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
  allowedAudiences: ['your_audience_id'], // Optional: restrict to specific audiences
  rateLimit: { // Optional: rate limiting
    max: 10, // Maximum 10 requests
    windowSec: 60, // Per minute
  },
}));

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### AWS Lambda Function

```javascript
// lambda-function.js
const { createResendProxy } = require('react-waitlist/server');

const proxyHandler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your_audience_id'],
});

exports.handler = async (event) => {
  const req = {
    body: JSON.parse(event.body),
    headers: event.headers,
  };
  
  let statusCode = 200;
  let responseBody = {};
  
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseBody = data;
        }
      };
    }
  };
  
  await proxyHandler(req, res);
  
  return {
    statusCode,
    body: JSON.stringify(responseBody),
    headers: {
      'Content-Type': 'application/json'
    }
  };
};
```

### Firebase Cloud Function

```javascript
// functions/index.js
const functions = require('firebase-functions');
const { createResendProxy } = require('react-waitlist/server');

exports.resendProxy = functions.https.onRequest(async (req, res) => {
  const proxyHandler = createResendProxy({
    apiKey: process.env.RESEND_API_KEY,
    allowedAudiences: ['your_audience_id'],
  });
  
  await proxyHandler(req, res);
});
```

### Next.js API Routes

```jsx
// pages/api/resend-proxy.js (Next.js Pages Router)
import { createResendProxy } from 'react-waitlist/server';

export default createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your-audience-id'],
});
```

```jsx
// app/api/resend-proxy/route.js (Next.js App Router)
import { NextResponse } from 'next/server';
import { createResendProxy } from 'react-waitlist/server';

const proxyHandler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your-audience-id'],
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

## Framework-Specific Examples

### Create React App (CRA)

```jsx
// src/App.js
import React from 'react';
import { WaitlistForm } from 'react-waitlist';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Awesome Product</h1>
        <WaitlistForm 
          resendAudienceId="your_audience_id"
          resendProxyEndpoint="https://your-api.com/api/resend-proxy"
          title="Join Our Waitlist"
          description="Be the first to know when we launch."
        />
      </header>
    </div>
  );
}

export default App;
```

### Vite

```jsx
// src/App.jsx
import React from 'react';
import { WaitlistForm } from 'react-waitlist';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Awesome Product</h1>
        <WaitlistForm 
          resendAudienceId="your_audience_id"
          resendProxyEndpoint="https://your-api.com/api/resend-proxy"
          title="Join Our Waitlist"
          description="Be the first to know when we launch."
        />
      </header>
    </div>
  );
}

export default App;
```

### Next.js (Client Component)

```jsx
// app/page.js
'use client';

import { WaitlistForm } from 'react-waitlist';

export default function Home() {
  return (
    <main>
      <h1>My Awesome Product</h1>
      <WaitlistForm 
        resendAudienceId="your_audience_id"
        resendProxyEndpoint="/api/resend-proxy"
        title="Join Our Waitlist"
        description="Be the first to know when we launch."
      />
    </main>
  );
}
```

### Next.js (Server Component)

```jsx
// app/page.js
import { ServerWaitlist } from 'react-waitlist/server';

export default function Home() {
  return (
    <main>
      <h1>My Awesome Product</h1>
      <ServerWaitlist 
        apiKey={process.env.RESEND_API_KEY}
        resendAudienceId="your_audience_id"
        title="Join Our Waitlist"
        description="Be the first to know when we launch."
      />
    </main>
  );
}
```

## Customization

React Waitlist is highly customizable. Here are some examples:

### Custom Fields

```jsx
<WaitlistForm 
  resendAudienceId="your-audience-id"
  resendProxyEndpoint="https://your-api.com/api/resend-proxy"
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
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: false,
      placeholder: 'Doe',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      options: ['Developer', 'Designer', 'Product Manager', 'Other'],
      required: false,
    },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'I agree to receive updates about the product',
      required: true,
    },
  ]}
  resendMapping={{
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    metadata: ['role'], // Fields to send as metadata
  }}
/>
```

### Custom Theme

```jsx
<WaitlistForm 
  resendAudienceId="your-audience-id"
  resendProxyEndpoint="https://your-api.com/api/resend-proxy"
  theme={{
    colors: {
      primary: '#3182CE', // Blue
      secondary: '#805AD5', // Purple
      background: '#FFFFFF', // White
      text: '#1A202C', // Dark gray
      error: '#E53E3E', // Red
      success: '#38A169', // Green
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
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
    borders: {
      radius: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
        full: '9999px',
      },
    },
  }}
/>
```

## Advanced Usage

### Using Hooks

For more control, you can use the hooks directly:

```jsx
import { useWaitlistForm } from 'react-waitlist/hooks';

function CustomWaitlistForm() {
  const {
    formState,
    formValues,
    validationResults,
    errorMessage,
    honeypotFieldName,
    handleChange,
    handleSubmit,
    resetForm,
  } = useWaitlistForm({
    fields: [
      { name: 'email', type: 'email', label: 'Email', required: true },
    ],
    resendAudienceId: 'your-audience-id',
    resendProxyEndpoint: 'https://your-api.com/api/resend-proxy',
    onSuccess: (data) => {
      console.log('Success:', data);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  // Custom rendering logic...
  return (
    <form onSubmit={handleSubmit}>
      {/* Your custom form elements */}
    </form>
  );
}
```

## API Reference

For a complete API reference, see the [API Reference](./api-reference.md) documentation. 