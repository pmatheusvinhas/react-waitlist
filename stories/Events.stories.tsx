import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import WaitlistForm from '../src/components/WaitlistForm';
import { useWaitlistEvents } from '../src/hooks/useWaitlistEvents';

const meta: Meta<typeof WaitlistForm> = {
  title: 'Examples/Events',
  component: WaitlistForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof WaitlistForm>;

export const BasicEvents: Story = {
  args: {
    apiKey: 'demo_api_key',
    audienceId: 'demo_audience_id',
    title: 'Join our waitlist with event callbacks',
    description: 'This example demonstrates the use of event callbacks.',
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        placeholder: 'your@email.com',
      },
    ],
    onView: (data) => {
      console.log('View event:', data);
    },
    onSubmit: (data) => {
      console.log('Submit event:', data);
    },
    onSuccess: (data) => {
      console.log('Success event:', data);
    },
    onError: (data) => {
      console.log('Error event:', data);
    },
  },
};

// Component that demonstrates using the useWaitlistEvents hook
const EventsWithHook = () => {
  const [events, setEvents] = useState<{ type: string; timestamp: string }[]>([]);
  
  const EventLogger = ({ eventManager }: { eventManager: any }) => {
    useWaitlistEvents(
      eventManager,
      ['view', 'submit', 'success', 'error'],
      (data) => {
        setEvents((prev) => [...prev, { type: data.type, timestamp: data.timestamp }]);
      }
    );
    
    return null;
  };
  
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <WaitlistForm
          apiKey="demo_api_key"
          audienceId="demo_audience_id"
          title="Events with Hook"
          description="This example uses the useWaitlistEvents hook to track events."
          fields={[
            {
              name: 'email',
              type: 'email',
              label: 'Email',
              required: true,
              placeholder: 'your@email.com',
            },
          ]}
          // @ts-ignore - This is for demo purposes only
          children={<EventLogger />}
        />
      </div>
      <div style={{ flex: 1, maxWidth: '300px' }}>
        <h3>Event Log</h3>
        <div style={{ 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          padding: '10px',
          maxHeight: '300px',
          overflowY: 'auto',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}>
          {events.length === 0 ? (
            <p>No events yet</p>
          ) : (
            events.map((event, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <strong>{event.type}</strong> at {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const WithHook: Story = {
  render: () => <EventsWithHook />,
}; 