# Webhooks Integration

React Waitlist supports webhooks to help you integrate with external systems and services. Webhooks allow you to send form data and events to specified endpoints when certain actions occur, such as when a user successfully joins your waitlist.

## Basic Usage

To use webhooks, simply add the `webhooks` prop to your WaitlistForm component:

```jsx
import { WaitlistForm } from 'react-waitlist';

function MyWaitlist() {
  return (
    <WaitlistForm
      audienceId="your_audience_id"
      proxyEndpoint="/api/resend-proxy"
      
      webhooks={[
        {
          url: "/api/waitlist-webhook",
          events: ["success"],
          includeAllFields: true
        }
      ]}
    />
  );
}
```

## Webhook Configuration

Each webhook configuration object supports the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | **Required**. The URL to send the webhook payload to. |
| `events` | `string[]` | Array of events that trigger this webhook. Options: `'view'`, `'submit'`, `'success'`, `'error'`. Default: all events. |
| `headers` | `Record<string, string>` | Custom headers to include with the webhook request. |
| `includeAllFields` | `boolean` | Whether to include all form fields in the webhook payload. Default: `true`. |
| `includeFields` | `string[]` | Specific fields to include in the webhook payload (if `includeAllFields` is `false`). |
| `retry` | `boolean` | Whether to retry failed webhook requests. Default: `false`. |
| `maxRetries` | `number` | Maximum number of retry attempts. Default: `3`. |

## Webhook Events

Webhooks can be triggered by the following events:

- **`view`**: When the waitlist form is first viewed/loaded.
- **`submit`**: When the form is submitted (before processing).
- **`success`**: When a user successfully joins the waitlist.
- **`error`**: When an error occurs during form submission.

## Webhook Payload

The webhook payload is a JSON object with the following structure:

```json
{
  "event": "success",
  "timestamp": "2023-08-15T14:30:00Z",
  "formData": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "company": "Acme Inc",
    "jobTitle": "Developer"
  },
  "resendResponse": {
    "id": "cont_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2023-08-15T14:30:00Z"
  }
}
```

For error events, the payload includes an `error` object instead of `resendResponse`:

```json
{
  "event": "error",
  "timestamp": "2023-08-15T14:30:00Z",
  "formData": {
    "email": "user@example.com"
  },
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Multiple Webhooks

You can configure multiple webhooks for different events:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  webhooks={[
    {
      url: "https://your-crm-api.com/leads",
      events: ["success"],
      includeAllFields: true
    },
    {
      url: "/api/analytics-webhook",
      events: ["view", "submit", "success", "error"],
      includeAllFields: false,
      includeFields: ["email"]
    }
  ]}
/>
```

## Selective Field Inclusion

You can control which fields are sent to your webhook:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  fields={[
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'firstName', type: 'text', required: false, label: 'First Name' },
    { name: 'lastName', type: 'text', required: false, label: 'Last Name' },
    { name: 'company', type: 'text', required: false, label: 'Company' },
    { name: 'role', type: 'select', required: false, label: 'Role', 
      options: ['Developer', 'Designer', 'Product Manager', 'Other'] }
  ]}
  
  webhooks={[
    {
      url: "/api/webhook",
      events: ["success"],
      includeAllFields: false,
      includeFields: ["email", "firstName", "lastName"]
    }
  ]}
/>
```

## Custom Headers

You can add custom headers to your webhook requests:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  webhooks={[
    {
      url: "/api/webhook",
      events: ["success"],
      headers: {
        "X-API-Key": "your-secret-key",
        "X-Source": "waitlist-form"
      }
    }
  ]}
/>
```

## Webhook Security

When implementing webhook endpoints, consider these security best practices:

1. **Use the Webhook Proxy**: For secure webhook delivery with sensitive headers, use the webhook proxy endpoint:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  resendProxyEndpoint="/api/resend-proxy"
  webhookProxyEndpoint="/api/webhook-proxy"
  webhooks={[
    {
      url: "https://your-api.com/webhook",
      events: ["success"],
      headers: {
        "X-API-Key": "your-secret-key" // Safely handled by the proxy
      }
    }
  ]}
/>
```

2. **Set up the Webhook Proxy**: Create a webhook proxy endpoint on your server:

```jsx
// pages/api/webhook-proxy.js (Next.js Pages Router)
import { createWebhookProxy } from 'react-waitlist/server';

export default createWebhookProxy({
  secretKey: process.env.WEBHOOK_SECRET_KEY,
  allowedDestinations: ['https://your-api.com'],
  defaultHeaders: {
    'X-Source': 'your-app'
  }
});
```

```jsx
// app/api/webhook-proxy/route.js (Next.js App Router)
import { NextResponse } from 'next/server';
import { createWebhookProxy } from 'react-waitlist/server';

const proxyHandler = createWebhookProxy({
  secretKey: process.env.WEBHOOK_SECRET_KEY,
  allowedDestinations: ['https://your-api.com']
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

3. **Validate the source**: Use custom headers or API keys to verify that requests are coming from your application.
4. **Use HTTPS**: Always use HTTPS for your webhook endpoints to encrypt data in transit.
5. **Implement rate limiting**: Protect your endpoints from abuse by implementing rate limiting.
6. **Validate payload data**: Always validate and sanitize incoming data before processing it.

## Testing Webhooks

For testing webhooks during development, you can use services like:

- [Webhook.site](https://webhook.site/) - Provides a temporary URL to test webhook deliveries
- [RequestBin](https://requestbin.com/) - Similar to Webhook.site
- [Ngrok](https://ngrok.com/) - Exposes your local development server to the internet

## Integration Examples

### Zapier Integration

```jsx
<WaitlistForm
  apiKey="your_resend_api_key"
  audienceId="your_audience_id"
  webhooks={[
    {
      url: "https://hooks.zapier.com/hooks/catch/your-zap-id/",
      events: ["success"],
      includeAllFields: true
    }
  ]}
/>
```

### HubSpot Integration

```jsx
<WaitlistForm
  apiKey="your_resend_api_key"
  audienceId="your_audience_id"
  webhooks={[
    {
      url: "https://your-custom-endpoint.com/hubspot-proxy",
      events: ["success"],
      includeAllFields: true,
      headers: {
        "X-HubSpot-API-Key": "your-hubspot-api-key"
      }
    }
  ]}
/>
```

### Custom Backend Integration

```jsx
<WaitlistForm
  apiKey="your_resend_api_key"
  audienceId="your_audience_id"
  webhooks={[
    {
      url: "/api/waitlist-webhook",
      events: ["success"],
      includeAllFields: true,
      retry: true,
      maxRetries: 3
    }
  ]}
/>
```

## Troubleshooting

If your webhooks aren't working as expected:

1. **Check the webhook URL**: Ensure the URL is correct and accessible.
2. **Verify event types**: Make sure you're listening for the correct events.
3. **Check browser console**: Look for any errors in the browser console.
4. **Inspect network requests**: Use browser developer tools to inspect the webhook requests.
5. **Test with a service like Webhook.site**: Use a webhook testing service to verify that requests are being sent correctly.

## Limitations

- Webhooks are sent from the client-side by default, which may not be suitable for all use cases.
- For server-side webhook handling, consider implementing a proxy endpoint on your server.
- Webhook retries use a simple linear backoff strategy. For production use cases with critical webhooks, consider implementing a more sophisticated retry mechanism on your server.

## Retry Configuration

You can configure retry behavior for failed webhook requests:

```jsx
<WaitlistForm
  audienceId="your_audience_id"
  proxyEndpoint="/api/resend-proxy"
  
  webhooks={[
    {
      url: "/api/webhook",
      events: ["success"],
      retry: true,
      maxRetries: 3
    }
  ]}
/>
```

This will attempt to resend the webhook up to 3 times if the initial request fails. 