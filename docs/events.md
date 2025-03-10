# Events System

React Waitlist provides a powerful events system that allows you to respond to various actions that occur during the waitlist form lifecycle. This system enables easy integration with analytics tools, custom logging, and other event-driven functionality.

## Event Types

The following events are available:

| Event | Description |
|-------|-------------|
| `view` | Triggered when the waitlist form is first viewed/loaded |
| `submit` | Triggered when the form is submitted (before processing) |
| `success` | Triggered when a user successfully joins the waitlist |
| `error` | Triggered when an error occurs during form submission |

## Using Event Callbacks

The simplest way to use events is through callback props:

```jsx
import { WaitlistForm } from 'react-waitlist';

function MyWaitlist() {
  return (
    <WaitlistForm
      apiKey="your_resend_api_key"
      audienceId="your_audience_id"
      
      // Event callbacks
      onView={({ timestamp }) => {
        console.log('Form viewed at', timestamp);
      }}
      
      onSubmit={({ timestamp, formData }) => {
        console.log('Form submitted at', timestamp, 'with data', formData);
      }}
      
      onSuccess={({ timestamp, formData, response }) => {
        console.log('Successfully joined waitlist at', timestamp);
        // You can access the Resend API response
        console.log('Resend response:', response);
      }}
      
      onError={({ timestamp, formData, error }) => {
        console.error('Error at', timestamp, ':', error.message);
      }}
    />
  );
}
```

## Using the useWaitlistEvents Hook

For more advanced use cases, you can use the `useWaitlistEvents` hook to subscribe to events programmatically:

```jsx
import { WaitlistForm, useWaitlistEvents } from 'react-waitlist';

function MyWaitlist() {
  const [eventLog, setEventLog] = useState([]);
  
  // Component that uses the hook to subscribe to events
  const EventLogger = ({ eventManager }) => {
    useWaitlistEvents(
      eventManager,
      ['view', 'submit', 'success', 'error'], // Events to subscribe to
      (data) => {
        // Handler function
        setEventLog(prev => [...prev, {
          type: data.type,
          timestamp: data.timestamp,
          data: data.formData || {}
        }]);
      }
    );
    
    return null;
  };
  
  return (
    <div>
      <WaitlistForm
        apiKey="your_resend_api_key"
        audienceId="your_audience_id"
        // Pass the EventLogger as a child component
        // Note: This is for demonstration purposes only
        children={<EventLogger />}
      />
      
      {/* Display event log */}
      <div>
        <h3>Event Log</h3>
        <pre>{JSON.stringify(eventLog, null, 2)}</pre>
      </div>
    </div>
  );
}
```

## Integration with Analytics Tools

### Google Analytics

```jsx
import { WaitlistForm } from 'react-waitlist';

function MyWaitlist() {
  return (
    <WaitlistForm
      apiKey="your_resend_api_key"
      audienceId="your_audience_id"
      
      onView={() => {
        window.gtag('event', 'waitlist_view');
      }}
      
      onSubmit={({ formData }) => {
        window.gtag('event', 'waitlist_submit', {
          email_domain: formData.email.split('@')[1]
        });
      }}
      
      onSuccess={() => {
        window.gtag('event', 'waitlist_success');
      }}
      
      onError={({ error }) => {
        window.gtag('event', 'waitlist_error', {
          error_message: error.message
        });
      }}
    />
  );
}
```

### Mixpanel

```jsx
import { WaitlistForm } from 'react-waitlist';

function MyWaitlist() {
  return (
    <WaitlistForm
      apiKey="your_resend_api_key"
      audienceId="your_audience_id"
      
      onView={() => {
        mixpanel.track('Waitlist Viewed');
      }}
      
      onSubmit={({ formData }) => {
        mixpanel.track('Waitlist Submitted', {
          email: formData.email
        });
      }}
      
      onSuccess={({ formData }) => {
        // Identify the user
        mixpanel.identify(formData.email);
        
        // Track the event
        mixpanel.track('Waitlist Joined');
        
        // Set user properties
        mixpanel.people.set({
          '$email': formData.email,
          'Joined Waitlist': true
        });
      }}
    />
  );
}
```

## Relationship with Webhooks

The events system works alongside the [webhooks system](./webhooks.md). While event callbacks are executed in the browser (client-side), webhooks send data to external endpoints (server-side).

You can use both systems together for a comprehensive approach:

```jsx
<WaitlistForm
  apiKey="your_resend_api_key"
  audienceId="your_audience_id"
  
  // Client-side event handling
  onSuccess={({ formData }) => {
    // Update UI or client-side state
    setShowConfetti(true);
  }}
  
  // Server-side integrations
  webhooks={[
    {
      url: "/api/crm-webhook",
      events: ["success"],
      includeAllFields: true
    }
  ]}
/>
```

## Event Data Structure

Each event provides different data:

### View Event

```js
{
  type: 'view',
  timestamp: '2023-08-15T14:30:00Z'
}
```

### Submit Event

```js
{
  type: 'submit',
  timestamp: '2023-08-15T14:31:00Z',
  formData: {
    email: 'user@example.com',
    firstName: 'John',
    // ... other form fields
  }
}
```

### Success Event

```js
{
  type: 'success',
  timestamp: '2023-08-15T14:31:05Z',
  formData: {
    email: 'user@example.com',
    firstName: 'John',
    // ... other form fields
  },
  response: {
    // Resend API response
    id: 'cont_123456789',
    email: 'user@example.com',
    // ... other response fields
  }
}
```

### Error Event

```js
{
  type: 'error',
  timestamp: '2023-08-15T14:31:05Z',
  formData: {
    email: 'user@example.com',
    firstName: 'John',
    // ... other form fields
  },
  error: {
    message: 'Error message',
    code: 'ERROR_CODE'
  }
}
```

## Best Practices

1. **Keep Event Handlers Light**: Event handlers should be lightweight to avoid affecting performance.

2. **Error Handling**: Always include error handling in your event handlers to prevent unhandled exceptions.

3. **Privacy Considerations**: Be mindful of privacy regulations when tracking user data in events.

4. **Conditional Logic**: Use conditional logic in your event handlers to respond differently based on context.

5. **Debugging**: Use event handlers for debugging during development by logging events to the console.

## Limitations

- Event handlers run in the client's browser and are subject to browser limitations.
- For server-side processing, use webhooks instead of or in addition to event callbacks.
- The event system does not persist events between page loads or sessions. 