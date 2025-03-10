import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import WaitlistForm from '../src/components/WaitlistForm';

const meta: Meta<typeof WaitlistForm> = {
  title: 'Examples/Webhooks',
  component: WaitlistForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof WaitlistForm>;

export const BasicWebhook: Story = {
  args: {
    apiKey: 'demo_api_key',
    audienceId: 'demo_audience_id',
    title: 'Join our waitlist with webhooks',
    description: 'We\'ll notify you when we launch. This example includes webhook integration.',
    fields: [
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
      {
        name: 'company',
        type: 'text',
        label: 'Company',
        required: false,
        placeholder: 'Acme Inc',
      },
    ],
    resendMapping: {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
    },
    webhooks: [
      {
        url: 'https://webhook.site/your-unique-id',
        events: ['success'],
        includeAllFields: true,
      },
    ],
  },
};

export const MultipleWebhooks: Story = {
  args: {
    apiKey: 'demo_api_key',
    audienceId: 'demo_audience_id',
    title: 'Join our waitlist with multiple webhooks',
    description: 'This example sends data to multiple endpoints for different events.',
    fields: [
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
        name: 'role',
        type: 'select',
        label: 'Role',
        required: false,
        placeholder: 'Select your role',
        options: ['Developer', 'Designer', 'Product Manager', 'Other'],
      },
    ],
    resendMapping: {
      email: 'email',
      firstName: 'firstName',
    },
    webhooks: [
      {
        url: 'https://webhook.site/your-success-endpoint',
        events: ['success'],
        includeAllFields: true,
        headers: {
          'X-Custom-Header': 'Success webhook',
        },
      },
      {
        url: 'https://webhook.site/your-analytics-endpoint',
        events: ['view', 'submit', 'success', 'error'],
        includeFields: ['email', 'role'],
        headers: {
          'X-Custom-Header': 'Analytics webhook',
        },
      },
    ],
  },
};

export const WebhookWithRetry: Story = {
  args: {
    apiKey: 'demo_api_key',
    audienceId: 'demo_audience_id',
    title: 'Join our waitlist with retry logic',
    description: 'This example includes retry logic for failed webhook requests.',
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        placeholder: 'your@email.com',
      },
    ],
    resendMapping: {
      email: 'email',
    },
    webhooks: [
      {
        url: 'https://webhook.site/your-unique-id',
        events: ['success'],
        includeAllFields: true,
        retry: true,
        maxRetries: 3,
      },
    ],
  },
}; 