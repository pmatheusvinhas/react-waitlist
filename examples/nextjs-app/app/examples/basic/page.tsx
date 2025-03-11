import React from 'react';
import ExampleLayout from '../../../components/ExampleLayout';
import BasicExample from './client';

export default function BasicExamplePage() {
  return (
    <ExampleLayout
      title="Basic Waitlist Form"
      description="A simple waitlist form with minimal configuration"
      clientCode={`import React from 'react';
import { WaitlistForm } from 'react-waitlist';

export default function BasicExample() {
  return (
    <WaitlistForm
      resendAudienceId="your-audience-id"
      resendProxyEndpoint="/api/resend-proxy"
      title="Join our waitlist"
      description="Be the first to know when we launch"
      submitText="Join waitlist"
      onSuccess={(data) => console.log('Success:', data)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}`}
      apiCode={`import { NextResponse } from 'next/server';
import { createResendProxy } from 'react-waitlist/server';

// Create a proxy handler with your Resend API key
const proxyHandler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY || 'your-resend-api-key',
});

export async function POST(req: Request) {
  // Call the proxy handler with the request
  return proxyHandler(req, NextResponse);
}`}
      nextExample="/examples/custom-fields"
    >
      <BasicExample />
    </ExampleLayout>
  );
} 