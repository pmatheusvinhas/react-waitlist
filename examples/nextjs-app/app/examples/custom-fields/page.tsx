import React from 'react';
import ExampleLayout from '../../../components/ExampleLayout';
import CustomFieldsExample from './client';

export default function CustomFieldsExamplePage() {
  return (
    <ExampleLayout
      title="Custom Fields"
      description="Waitlist form with custom fields and validation"
      clientCode={`import React from 'react';
import { WaitlistForm } from 'react-waitlist';

export default function CustomFieldsExample() {
  return (
    <WaitlistForm
      resendAudienceId="your-audience-id"
      resendProxyEndpoint="/api/resend-proxy"
      title="Join our private beta"
      description="Sign up to get early access to our product"
      submitText="Request Access"
      fields={[
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
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
          placeholder: 'Acme Inc.',
        },
        {
          name: 'role',
          type: 'select',
          label: 'Role',
          required: false,
          options: ['Developer', 'Designer', 'Product Manager', 'Other'],
        },
        {
          name: 'consent',
          type: 'checkbox',
          label: 'I agree to receive updates about the product',
          required: true,
        },
      ]}
      resendMapping={{
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        metadata: ['company', 'role'],
      }}
    />
  );
}`}
      previousExample="/examples/basic"
      nextExample="/examples/styling"
    >
      <CustomFieldsExample />
    </ExampleLayout>
  );
} 