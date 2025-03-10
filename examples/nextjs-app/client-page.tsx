'use client';

import React from 'react';
import WaitlistForm from '../../src/components/WaitlistForm';

export default function ClientWaitlistPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Client-Side Example</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <WaitlistForm 
          audienceId="your-audience-id"
          proxyEndpoint="/api/resend-proxy"
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
          ]}
          resendMapping={{
            email: 'email',
            firstName: 'firstName',
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