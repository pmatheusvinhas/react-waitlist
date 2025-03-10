import React from 'react';
import WaitlistForm from '../src/components/WaitlistForm';
import { Field } from '../src/types';

export default {
  title: 'React Waitlist/WaitlistForm',
  component: WaitlistForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# React Waitlist

A customizable waitlist component for React that integrates with Resend audiences.

## Features

- 🔒 **Secure Integration**: Seamlessly connects with Resend audiences while keeping your API keys safe
- 🎨 **Fully Customizable UI**: Complete theming support to match your brand
- 🤖 **Bot and Spam Protection**: Multiple layers of security to prevent spam submissions
- ♿ **Accessibility Built-in**: WCAG compliant with screen reader support
- 📊 **Analytics Ready**: Track conversions and user engagement
- 🔌 **Easy Integration**: Works with any React application

## Installation

\`\`\`bash
npm install react-waitlist
# or
yarn add react-waitlist
\`\`\`

## Basic Usage

\`\`\`jsx
import Waitlist from 'react-waitlist';

function App() {
  return (
    <Waitlist 
      audienceId="your_audience_id"
      proxyEndpoint="/api/resend-proxy"
    />
  );
}
\`\`\`

For more advanced usage and configuration options, explore the examples below.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    apiKey: { 
      control: 'text',
      description: 'Resend API key (only use server-side, never expose in client code)',
      table: {
        category: 'Authentication',
      }
    },
    audienceId: { 
      control: 'text',
      description: 'ID of the Resend audience to add contacts to',
      table: {
        category: 'Authentication',
      }
    },
    proxyEndpoint: { 
      control: 'text',
      description: 'Endpoint for the proxy API that securely handles Resend API calls',
      table: {
        category: 'Authentication',
      }
    },
    title: { 
      control: 'text',
      description: 'Main heading displayed above the form',
      table: {
        category: 'Content',
      }
    },
    description: { 
      control: 'text',
      description: 'Subheading or description text displayed below the title',
      table: {
        category: 'Content',
      }
    },
    submitText: { 
      control: 'text',
      description: 'Text displayed on the submit button',
      table: {
        category: 'Content',
      }
    },
    successTitle: { 
      control: 'text',
      description: 'Title displayed after successful submission',
      table: {
        category: 'Content',
      }
    },
    successDescription: { 
      control: 'text',
      description: 'Description displayed after successful submission',
      table: {
        category: 'Content',
      }
    },
    fields: { 
      control: 'object',
      description: 'Custom fields configuration for the form',
      table: {
        category: 'Form Configuration',
      }
    },
    theme: { 
      control: 'object',
      description: 'Theme configuration for customizing the appearance',
      table: {
        category: 'Styling',
      }
    },
    a11y: { 
      control: 'object',
      description: 'Accessibility configuration options',
      table: {
        category: 'Accessibility',
      }
    },
    security: { 
      control: 'object',
      description: 'Security configuration options for bot protection',
      table: {
        category: 'Security',
      }
    },
    analytics: { 
      control: 'object',
      description: 'Analytics configuration for tracking submissions',
      table: {
        category: 'Analytics',
      }
    },
    onSuccess: { 
      action: 'onSuccess',
      description: 'Callback function called after successful submission',
      table: {
        category: 'Callbacks',
      }
    },
    onError: { 
      action: 'onError',
      description: 'Callback function called when an error occurs',
      table: {
        category: 'Callbacks',
      }
    },
  },
};

// Basic example with minimal props
export const Basic = {
  args: {
    audienceId: 'demo-audience-id',
    proxyEndpoint: '/api/resend-proxy',
  },
  parameters: {
    docs: {
      description: {
        story: `
## Basic Usage

This is the simplest configuration of the React Waitlist component. It requires only two essential props:

- \`audienceId\`: The ID of your Resend audience
- \`proxyEndpoint\`: The endpoint for your proxy API that securely handles Resend API calls

The component automatically includes:
- Email validation
- Bot protection
- Accessible form elements
- Success/error states

### How to Test:

1. Enter a valid email address in the form
2. Click the "Join waitlist" button
3. You should see a success message

### Implementation:

\`\`\`jsx
import { Waitlist } from 'react-waitlist';

function App() {
  return (
    <Waitlist 
      audienceId="your-audience-id"
      proxyEndpoint="/api/resend-proxy"
    />
  );
}
\`\`\`

### Server-Side Implementation (Next.js App Router):

\`\`\`jsx
import { ServerWaitlist } from 'react-waitlist/server';

export default function Page() {
  return (
    <ServerWaitlist 
      apiKey={process.env.RESEND_API_KEY}
      audienceId="your-audience-id"
    />
  );
}
\`\`\`
        `,
      },
    },
  },
};

// Example with custom fields
const customFields: Field[] = [
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
];

export const WithCustomFields = {
  args: {
    audienceId: 'demo-audience-id',
    proxyEndpoint: '/api/resend-proxy',
    title: 'Join Our Private Beta',
    description: 'Sign up to get early access to our product.',
    submitText: 'Request Access',
    fields: customFields,
    resendMapping: {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      metadata: ['company', 'role'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
## Custom Fields

React Waitlist supports a wide range of custom fields to collect exactly the information you need from your users. You can configure:

- Text inputs
- Email inputs
- Select dropdowns
- Checkboxes
- And more!

Each field can be mapped to the appropriate Resend contact properties, including custom metadata.

### How to Test:

1. Fill out the various fields in the form
2. Try submitting without checking the required consent checkbox
3. Try submitting with an invalid email format
4. Fill all required fields correctly and submit
5. You should see a success message

### Implementation:

\`\`\`jsx
import { Waitlist } from 'react-waitlist';

function App() {
  return (
    <Waitlist 
      audienceId="your-audience-id"
      proxyEndpoint="/api/resend-proxy"
      title="Join Our Private Beta"
      description="Sign up to get early access to our product."
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
        // Additional fields...
      ]}
      resendMapping={{
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        metadata: ['company', 'role'],
      }}
    />
  );
}
\`\`\`
        `,
      },
    },
  },
};

// Example with custom theme
export const CustomTheme = {
  args: {
    audienceId: 'demo-audience-id',
    proxyEndpoint: '/api/resend-proxy',
    title: 'Get Early Access',
    description: 'Be the first to try our new product.',
    submitText: 'Join Now',
    theme: {
      colors: {
        primary: '#8B5CF6', // Purple
        secondary: '#EC4899', // Pink
        background: '#F9FAFB',
        text: '#1F2937',
        error: '#EF4444',
        success: '#10B981',
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          md: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
        },
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borders: {
        radius: {
          sm: '0.125rem',
          md: '0.375rem',
          lg: '0.5rem',
          full: '9999px',
        },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
## Custom Theme

React Waitlist is fully customizable to match your brand's visual identity. The theming system allows you to control:

- Colors (primary, secondary, background, text, error, success)
- Typography (font family, font sizes)
- Spacing
- Border radius
- And more!

### How to Test:

1. Notice the purple and pink color scheme (different from the default blue)
2. Observe the custom font sizes and spacing
3. Try interacting with the form to see the custom styling for hover and focus states
4. Submit the form to see the custom success styling

### Implementation:

\`\`\`jsx
import { Waitlist } from 'react-waitlist';

function App() {
  return (
    <Waitlist 
      audienceId="your-audience-id"
      proxyEndpoint="/api/resend-proxy"
      title="Get Early Access"
      description="Be the first to try our new product."
      submitText="Join Now"
      theme={{
        colors: {
          primary: '#8B5CF6', // Purple
          secondary: '#EC4899', // Pink
          background: '#F9FAFB',
          text: '#1F2937',
          error: '#EF4444',
          success: '#10B981',
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
          fontSizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
          },
        },
        // Additional theme options...
      }}
    />
  );
}
\`\`\`
        `,
      },
    },
  },
};

// Example with accessibility configuration
export const WithAccessibility = {
  args: {
    audienceId: 'demo-audience-id',
    proxyEndpoint: '/api/resend-proxy',
    a11y: {
      announceStatus: true,
      highContrast: true,
      reducedMotion: true,
      ariaLabels: {
        form: 'Waitlist signup form',
        emailField: 'Your email address',
        submitButton: 'Join the waitlist',
        successMessage: 'Successfully joined the waitlist',
        errorMessage: 'Error joining the waitlist',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
## Accessibility Features

React Waitlist is built with accessibility in mind, following WCAG guidelines to ensure your waitlist form is usable by everyone, including people with disabilities.

### Key Accessibility Features:

- **ARIA Labels**: All form elements have proper ARIA labels for screen readers
- **High Contrast Mode**: Improved visibility for users with visual impairments
- **Reduced Motion**: Respects user preferences for reduced motion
- **Status Announcements**: Screen readers announce form status changes
- **Keyboard Navigation**: All form elements are accessible via keyboard

### How to Test Accessibility Features:

1. **Check the Accessibility Tab**: 
   - Look at the bottom panel in Storybook
   - Click on the "Accessibility" tab
   - You'll see automated accessibility checks powered by axe-core
   - Any violations will be listed with details on how to fix them

2. **Test with Keyboard Navigation**:
   - Click somewhere outside the form, then press Tab repeatedly
   - Observe how focus moves through the form elements
   - You should be able to complete and submit the form using only the keyboard

3. **Inspect ARIA Attributes**:
   - Right-click on form elements and select "Inspect" in your browser
   - Look for attributes like aria-label, aria-required, etc.
   - These help screen readers properly announce the form elements

### Implementation:

\`\`\`jsx
import { Waitlist } from 'react-waitlist';

function App() {
  return (
    <Waitlist 
      audienceId="your-audience-id"
      proxyEndpoint="/api/resend-proxy"
      a11y={{
        announceStatus: true,
        highContrast: true,
        reducedMotion: true,
        ariaLabels: {
          form: 'Waitlist signup form',
          emailField: 'Your email address',
          submitButton: 'Join the waitlist',
          successMessage: 'Successfully joined the waitlist',
          errorMessage: 'Error joining the waitlist',
        },
      }}
    />
  );
}
\`\`\`
        `,
      },
    },
    a11y: {
      // Force enable accessibility checks for this story
      disable: false,
      config: {
        rules: [
          {
            // Make sure all rules are enabled for this story
            id: '*',
            enabled: true
          }
        ]
      }
    }
  },
};

// Example with security configuration
export const WithSecurity = {
  args: {
    audienceId: 'demo-audience-id',
    proxyEndpoint: '/api/resend-proxy',
    security: {
      enableHoneypot: true,
      checkSubmissionTime: true,
      enableReCaptcha: false,
      reCaptchaSiteKey: '6LcDemo-RecaptchaSiteKey',
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
## Security Features

React Waitlist includes multiple layers of protection against spam and bot submissions, helping you maintain a clean audience list without requiring CAPTCHAs that might frustrate legitimate users.

### Security Features:

1. **Honeypot Field**: A hidden field that bots tend to fill out but humans don't see
2. **Submission Time Check**: Detects submissions that happen too quickly to be from a human
3. **Optional reCAPTCHA**: Integration with Google reCAPTCHA for additional security
4. **API Key Protection**: Server-side proxy to keep your Resend API key secure

### How to Test Security Features:

1. **Test the Honeypot Field**:
   - Right-click on the form and select "Inspect" in your browser
   - Look for a hidden input field (it will have inline styles making it invisible)
   - It typically has a label like "Do not fill this field"
   - Try entering text in this field using the browser inspector
   - Submit the form - it should appear to succeed but actually detect you as a bot
   - Check the browser console for a warning message about bot detection

2. **Test Submission Time Check**:
   - Refresh the page to reset the form
   - Immediately fill out the email field and submit the form (within 1.5 seconds)
   - The form should appear to submit successfully
   - But check the browser console - you should see a warning about bot detection

### Implementation:

\`\`\`jsx
import { Waitlist } from 'react-waitlist';

function App() {
  return (
    <Waitlist 
      audienceId="your-audience-id"
      proxyEndpoint="/api/resend-proxy"
      security={{
        enableHoneypot: true,
        checkSubmissionTime: true,
        enableReCaptcha: false,
        reCaptchaSiteKey: 'your-recaptcha-site-key', // Only if enableReCaptcha is true
      }}
    />
  );
}
\`\`\`

### Proxy API Setup:

\`\`\`jsx
// pages/api/resend-proxy.js (Next.js)
import { createResendProxy } from 'react-waitlist/proxy';

export default createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your_audience_id'],
  // Additional security options
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
  },
});
\`\`\`
        `,
      },
    },
  },
};

// Example with analytics
export const WithAnalytics = {
  args: {
    audienceId: 'demo-audience-id',
    proxyEndpoint: '/api/resend-proxy',
    analytics: {
      enable: true,
      trackingId: 'UA-XXXXXXXXX-X',
      events: {
        formView: 'waitlist_view',
        formSubmit: 'waitlist_submit',
        formSuccess: 'waitlist_success',
        formError: 'waitlist_error',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
## Analytics Integration

React Waitlist includes built-in analytics tracking to help you measure conversions and understand user engagement with your waitlist form.

### Analytics Features:

- Track form views
- Track form submissions
- Track successful submissions
- Track submission errors
- Custom event naming
- Integration with Google Analytics, Segment, or custom analytics providers

### Implementation:

\`\`\`jsx
import { Waitlist } from 'react-waitlist';

function App() {
  return (
    <Waitlist 
      audienceId="your-audience-id"
      proxyEndpoint="/api/resend-proxy"
      analytics={{
        enable: true,
        trackingId: 'UA-XXXXXXXXX-X', // Your Google Analytics tracking ID
        events: {
          formView: 'waitlist_view',
          formSubmit: 'waitlist_submit',
          formSuccess: 'waitlist_success',
          formError: 'waitlist_error',
        },
        // Optional custom tracking function
        track: (eventName, eventData) => {
          // Your custom tracking logic
          console.log('Analytics event:', eventName, eventData);
        },
      }}
    />
  );
}
\`\`\`
        `,
      },
    },
  },
};

// Complete example with all options
export const CompleteExample = {
  args: {
    audienceId: 'demo-audience-id',
    proxyEndpoint: '/api/resend-proxy',
    title: 'Join Our Exclusive Beta',
    description: 'Get early access to our revolutionary product',
    submitText: 'Request Access',
    successTitle: 'You\'re on the list!',
    successDescription: 'Thank you for joining. We\'ll be in touch soon.',
    fields: customFields,
    resendMapping: {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      metadata: ['company', 'role'],
    },
    theme: {
      colors: {
        primary: '#3182CE',
        secondary: '#805AD5',
        background: '#F7FAFC',
        text: '#2D3748',
        error: '#E53E3E',
        success: '#38A169',
      },
      typography: {
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          md: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
        },
      },
    },
    a11y: {
      announceStatus: true,
      highContrast: false,
      reducedMotion: false,
    },
    security: {
      enableHoneypot: true,
      checkSubmissionTime: true,
    },
    analytics: {
      enable: true,
      events: {
        formView: 'waitlist_view',
        formSubmit: 'waitlist_submit',
        formSuccess: 'waitlist_success',
        formError: 'waitlist_error',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
## Complete Example

This example showcases all the available configuration options for React Waitlist, demonstrating how you can create a fully customized waitlist form that perfectly matches your needs.

### Features Demonstrated:

- Custom fields with validation
- Custom theming
- Accessibility features
- Security measures
- Analytics tracking
- Success/error handling

### Implementation:

\`\`\`jsx
import { Waitlist } from 'react-waitlist';

function App() {
  return (
    <Waitlist 
      audienceId="your-audience-id"
      proxyEndpoint="/api/resend-proxy"
      
      // Content
      title="Join Our Exclusive Beta"
      description="Get early access to our revolutionary product"
      submitText="Request Access"
      successTitle="You're on the list!"
      successDescription="Thank you for joining. We'll be in touch soon."
      
      // Custom fields
      fields={[
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
          placeholder: 'your@email.com',
        },
        // Additional fields...
      ]}
      
      // Resend mapping
      resendMapping={{
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        metadata: ['company', 'role'],
      }}
      
      // Theme
      theme={{
        colors: {
          primary: '#3182CE',
          secondary: '#805AD5',
          // Additional colors...
        },
        // Additional theme options...
      }}
      
      // Accessibility
      a11y={{
        announceStatus: true,
        highContrast: false,
        reducedMotion: false,
      }}
      
      // Security
      security={{
        enableHoneypot: true,
        checkSubmissionTime: true,
      }}
      
      // Analytics
      analytics={{
        enable: true,
        events: {
          formView: 'waitlist_view',
          formSubmit: 'waitlist_submit',
          formSuccess: 'waitlist_success',
          formError: 'waitlist_error',
        },
      }}
      
      // Callbacks
      onSuccess={(data) => console.log('Success:', data)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
\`\`\`
        `,
      },
    },
  },
}; 