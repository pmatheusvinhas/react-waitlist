import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { WaitlistForm } from '../src';

const meta: Meta<typeof WaitlistForm> = {
  title: 'Examples/Variations',
  component: WaitlistForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Component Variations

This page showcases different variations of the WaitlistForm component to help you understand the range of customization options available.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WaitlistForm>;

export const MinimalForm: Story = {
  args: {
    resendAudienceId: 'demo-audience-id',
    resendProxyEndpoint: '/api/resend-proxy',
  },
  parameters: {
    docs: {
      description: {
        story: `
### Minimal Form

The simplest possible configuration with only the required props:

\`\`\`jsx
<WaitlistForm
  resendAudienceId="your-audience-id"
  resendProxyEndpoint="/api/resend-proxy"
/>
\`\`\`
        `,
      },
    },
  },
};

export const CustomContent: Story = {
  args: {
    resendAudienceId: 'demo-audience-id',
    resendProxyEndpoint: '/api/resend-proxy',
    title: 'Join our exclusive beta',
    description: 'Get early access to our revolutionary product',
    submitText: 'Request Access',
    successTitle: "You're in!",
    successDescription: "Thank you for joining our beta. We'll be in touch soon.",
  },
  parameters: {
    docs: {
      description: {
        story: `
### Custom Content

Customize all text content in the form:

\`\`\`jsx
<WaitlistForm
  resendAudienceId="your-audience-id"
  resendProxyEndpoint="/api/resend-proxy"
  title="Join our exclusive beta"
  description="Get early access to our revolutionary product"
  submitText="Request Access"
  successTitle="You're in!"
  successDescription="Thank you for joining our beta. We'll be in touch soon."
/>
\`\`\`
        `,
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    resendAudienceId: 'demo-audience-id',
    resendProxyEndpoint: '/api/resend-proxy',
    title: 'Join our waitlist',
    description: 'Be the first to know when we launch',
    theme: {
      colors: {
        primary: '#3b82f6',
        background: '#1e293b',
        text: '#f8fafc',
        border: '#475569',
        error: '#ef4444',
        success: '#10b981',
      },
      borderRadius: '0.5rem',
      shadows: {
        container: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        input: '0 1px 2px rgba(0, 0, 0, 0.2)',
        button: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
### Dark Theme

A dark-themed version of the form:

\`\`\`jsx
<WaitlistForm
  resendAudienceId="your-audience-id"
  resendProxyEndpoint="/api/resend-proxy"
  title="Join our waitlist"
  description="Be the first to know when we launch"
  theme={{
    colors: {
      primary: '#3b82f6',
      background: '#1e293b',
      text: '#f8fafc',
      border: '#475569',
      error: '#ef4444',
      success: '#10b981',
    },
    borderRadius: '0.5rem',
    shadows: {
      container: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      input: '0 1px 2px rgba(0, 0, 0, 0.2)',
      button: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    },
  }}
/>
\`\`\`
        `,
      },
    },
  },
};

export const MinimalistDesign: Story = {
  args: {
    resendAudienceId: 'demo-audience-id',
    resendProxyEndpoint: '/api/resend-proxy',
    title: 'Join waitlist',
    description: 'Get notified when we launch',
    submitText: 'Join',
    theme: {
      colors: {
        primary: '#000000',
        background: '#ffffff',
        text: '#000000',
        border: '#e5e5e5',
        error: '#ff0000',
        success: '#00aa00',
      },
      borderRadius: '0',
      shadows: {
        container: 'none',
        input: 'none',
        button: 'none',
      },
      typography: {
        titleSize: '1.2rem',
        titleWeight: '500',
        descriptionSize: '0.9rem',
        labelSize: '0.8rem',
        labelWeight: '400',
        inputSize: '0.9rem',
        buttonSize: '0.9rem',
        buttonWeight: '500',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
### Minimalist Design

A clean, minimalist design with no shadows and square corners:

\`\`\`jsx
<WaitlistForm
  resendAudienceId="your-audience-id"
  resendProxyEndpoint="/api/resend-proxy"
  title="Join waitlist"
  description="Get notified when we launch"
  submitText="Join"
  theme={{
    colors: {
      primary: '#000000',
      background: '#ffffff',
      text: '#000000',
      border: '#e5e5e5',
      error: '#ff0000',
      success: '#00aa00',
    },
    borderRadius: '0',
    shadows: {
      container: 'none',
      input: 'none',
      button: 'none',
    },
    typography: {
      titleSize: '1.2rem',
      titleWeight: '500',
      descriptionSize: '0.9rem',
      labelSize: '0.8rem',
      labelWeight: '400',
      inputSize: '0.9rem',
      buttonSize: '0.9rem',
      buttonWeight: '500',
    },
  }}
/>
\`\`\`
        `,
      },
    },
  },
}; 