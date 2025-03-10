import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { WaitlistForm } from '../src';

const meta: Meta<typeof WaitlistForm> = {
  title: 'Examples/ReCaptcha',
  component: WaitlistForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof WaitlistForm>;

export const WithReCaptcha: Story = {
  args: {
    resendAudienceId: 'demo_audience_id',
    resendProxyEndpoint: '/api/resend-proxy',
    recaptchaProxyEndpoint: '/api/recaptcha-proxy',
    title: 'Join our waitlist with reCAPTCHA',
    description: 'This form is protected by Google reCAPTCHA v3 to ensure you are not a robot.',
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        placeholder: 'your@email.com',
      },
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        required: true,
        placeholder: 'Your name',
      },
    ],
    security: {
      enableReCaptcha: true,
      reCaptchaSiteKey: process.env.STORYBOOK_RECAPTCHA_SITE_KEY || 'demo_recaptcha_site_key',
      reCaptchaMinScore: 0.5,
      enableHoneypot: true,
      checkSubmissionTime: true,
    },
    onSubmit: (data) => {
      console.log('Form submitted:', data);
    },
    onSuccess: (data) => {
      console.log('Submission successful:', data);
    },
    onError: (data) => {
      console.error('Submission error:', data);
    },
  },
};

export const WithCustomReCaptchaProxy: Story = {
  args: {
    ...WithReCaptcha.args,
    title: 'Custom reCAPTCHA Proxy',
    description: 'This example uses a custom reCAPTCHA proxy endpoint for verification.',
    recaptchaProxyEndpoint: 'https://your-custom-proxy.com/recaptcha',
  },
};

// Example of server-side implementation for the reCAPTCHA proxy
export const ServerImplementationExample = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2>Server-side Implementation Example</h2>
      <p>Here's how to implement the reCAPTCHA proxy on your server:</p>
      
      <h3>Next.js API Route (Pages Router)</h3>
      <pre style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
        {`// pages/api/recaptcha-proxy.js
import { createRecaptchaProxy } from 'react-waitlist/server';

export default createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5,
  allowedActions: ['submit_waitlist'],
});`}
      </pre>
      
      <h3>Next.js App Router</h3>
      <pre style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
        {`// app/api/recaptcha-proxy/route.js
import { NextResponse } from 'next/server';
import { createRecaptchaProxy } from 'react-waitlist/server';

const proxyHandler = createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5,
  allowedActions: ['submit_waitlist'],
});

export async function POST(req) {
  const res = {
    status: (code) => ({
      json: (data) => NextResponse.json(data, { status: code }),
    }),
  };
  return await proxyHandler(req, res);
}`}
      </pre>
    </div>
  );
}; 