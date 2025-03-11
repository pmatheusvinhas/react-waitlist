import React from 'react';
import ExampleLayout from '../../../components/ExampleLayout';
import StylingExample from './client';

export default function StylingExamplePage() {
  return (
    <ExampleLayout
      title="Custom Styling"
      description="Waitlist form with custom theme and styling"
      clientCode={`import React from 'react';
import { WaitlistForm } from 'react-waitlist';

export default function StylingExample() {
  return (
    <WaitlistForm
      resendAudienceId="your-audience-id"
      resendProxyEndpoint="/api/resend-proxy"
      title="Join our waitlist"
      description="Be the first to know when we launch"
      submitText="Join waitlist"
      theme={{
        colors: {
          primary: '#3b82f6',
          background: '#f8fafc',
          text: '#1e293b',
          error: '#ef4444',
          success: '#10b981',
          border: '#cbd5e1',
        },
        fonts: {
          body: 'Inter, system-ui, sans-serif',
          heading: 'Inter, system-ui, sans-serif',
        },
        borderRadius: '0.5rem',
        spacing: {
          inputPadding: '0.75rem 1rem',
          buttonPadding: '0.75rem 1.5rem',
          containerPadding: '2rem',
          gap: '1.5rem',
        },
        shadows: {
          input: '0 1px 2px rgba(0, 0, 0, 0.05)',
          button: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
          container: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        typography: {
          titleSize: '1.5rem',
          titleWeight: '700',
          descriptionSize: '1rem',
          labelSize: '0.875rem',
          labelWeight: '500',
          inputSize: '1rem',
          buttonSize: '1rem',
          buttonWeight: '600',
        },
        transitions: {
          hover: 'all 0.2s ease-in-out',
        },
        hover: {
          button: {
            backgroundColor: '#2563eb',
            transform: 'translateY(-1px)',
          },
          input: {
            borderColor: '#3b82f6',
          },
        },
      }}
    />
  );
}`}
      previousExample="/examples/custom-fields"
      nextExample="/examples/events"
    >
      <StylingExample />
    </ExampleLayout>
  );
} 