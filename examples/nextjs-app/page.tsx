import React from 'react';
import { ServerWaitlist } from '../../src/server';

export default function WaitlistPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Next.js App Router Example</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ServerWaitlist 
          apiKey={process.env.RESEND_API_KEY || 'your-api-key'}
          audienceId="your-audience-id"
          title="Join Our Waitlist"
          description="Be the first to know when we launch our new product."
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
            },
            {
              name: 'lastName',
              type: 'text',
              label: 'Last Name',
              required: false,
              placeholder: 'Doe',
            },
          ]}
          resendMapping={{
            email: 'email',
            firstName: 'firstName',
            lastName: 'lastName',
          }}
          theme={{
            colors: {
              primary: '#0070f3',
              secondary: '#0070f3',
            },
          }}
          a11y={{
            announceStatus: true,
          }}
          security={{
            enableHoneypot: true,
            checkSubmissionTime: true,
          }}
          onSuccess={(data) => console.log('Success:', data)}
          onError={(error) => console.error('Error:', error)}
        />
      </div>
    </div>
  );
} 