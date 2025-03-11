'use client';

import React from 'react';
import { WaitlistForm } from 'react-waitlist';

export default function BasicExample() {
  return (
    <WaitlistForm
      resendAudienceId="demo-audience-id"
      resendProxyEndpoint="/api/resend-proxy"
      title="Join our waitlist"
      description="Be the first to know when we launch"
      submitText="Join waitlist"
      onSuccess={(data) => console.log('Success:', data)}
      onError={(error) => console.error('Error:', error)}
    />
  );
} 