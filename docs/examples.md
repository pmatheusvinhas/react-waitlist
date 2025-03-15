# Examples

This document provides various examples of how to use React Waitlist in different scenarios.

## Basic Usage

### Minimal Configuration

```jsx
import { WaitlistForm } from 'react-waitlist';

function BasicWaitlist() {
  return (
    <WaitlistForm
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
    />
  );
}
```

### Complete Configuration with Proxy

```jsx
import { WaitlistForm } from 'react-waitlist';

function CompleteWaitlist() {
  return (
    <WaitlistForm
      // Basic settings
      title="Join Our Exclusive Beta"
      description="Sign up to be among the first to access our product."
      submitText="Reserve My Spot"
      successTitle="You're In!"
      successDescription="Thanks for joining! We'll notify you when your access is ready."
      
      // Resend integration
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
      
      // Security features
      security={{
        enableHoneypot: true,
        checkSubmissionTime: true,
        minSubmissionTime: 2000,
        enableReCaptcha: true,
        reCaptchaSiteKey: "YOUR_RECAPTCHA_SITE_KEY",
        recaptchaProxyEndpoint: "/api/recaptcha-proxy"
      }}
      
      // Custom form fields
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
          required: true,
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
          placeholder: 'Select your role',
          options: ['Developer', 'Designer', 'Product Manager', 'Marketer', 'Other']
        },
        {
          name: 'newsletter',
          type: 'checkbox',
          label: 'Subscribe to our newsletter',
          required: false,
          defaultValue: true
        }
      ]}
      
      // Mapping to Resend fields
      resendMapping={{
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        metadata: ['company', 'role', 'newsletter']
      }}
      
      // Event handlers
      onFieldFocus={(data) => console.log('Field focus:', data)}
      onSubmit={(data) => console.log('Form submit:', data)}
      onSuccess={(data) => {
        console.log('Success:', data);
        return { success: true };
      }}
      onError={(data) => console.error('Error:', data)}
      onSecurityEvent={(data) => console.warn('Security event:', data)}
    />
  );
}
```

## Framework Integration Examples

### Tailwind CSS

```jsx
import { WaitlistForm, tailwindDefaultTheme } from 'react-waitlist';

function TailwindWaitlist() {
  return (
    <WaitlistForm
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
      
      // Use Tailwind theme
      theme={tailwindDefaultTheme}
      frameworkConfig={{ name: 'tailwind' }}
      
      // Add Tailwind classes
      className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto"
    />
  );
}
```

### Material UI

```jsx
import { WaitlistForm, materialUIDefaultTheme } from 'react-waitlist';

function MaterialUIWaitlist() {
  return (
    <WaitlistForm
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
      
      // Use Material UI theme
      theme={materialUIDefaultTheme}
      frameworkConfig={{ name: 'material-ui' }}
    />
  );
}
```

### Custom Theme

```jsx
import { WaitlistForm, mergeTheme, defaultTheme } from 'react-waitlist';

function CustomThemeWaitlist() {
  // Create a custom theme
  const customTheme = mergeTheme(defaultTheme, {
    colors: {
      primary: '#8B5CF6', // Purple
      secondary: '#C4B5FD',
      background: '#F5F3FF',
      text: '#4B5563',
      error: '#EF4444',
      success: '#10B981'
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      fontSizes: {
        md: '1rem',
        lg: '1.25rem'
      }
    },
    borders: {
      radius: {
        md: '0.5rem',
        full: '9999px'
      }
    },
    animation: {
      duration: '300ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    components: {
      button: {
        fontWeight: 600,
        textTransform: 'none',
        padding: '0.75rem 1.5rem'
      }
    }
  });

  return (
    <WaitlistForm
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
      
      // Apply custom theme
      theme={customTheme}
    />
  );
}
```

## Advanced Examples

### Handling Form Submission

```jsx
import { WaitlistForm } from 'react-waitlist';
import { useState } from 'react';

function CustomSubmissionWaitlist() {
  const [submissionId, setSubmissionId] = useState(null);
  
  // Function to save to your database
  const saveToDatabase = async (formData) => {
    // Example API call
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save to database');
    }
    
    return await response.json();
  };
  
  return (
    <div>
      <WaitlistForm
        title="Join Our Waitlist"
        description="Be the first to know when we launch."
        resendAudienceId="YOUR_AUDIENCE_ID"
        resendProxyEndpoint="/api/resend-proxy"
        
        // Custom success handler
        onSuccess={async (data) => {
          try {
            // Save to your database
            const result = await saveToDatabase(data.formData);
            
            // Store submission ID
            setSubmissionId(result.id);
            
            return { 
              success: true, 
              data: result
            };
          } catch (error) {
            console.error('Error saving data:', error);
            return { 
              success: false, 
              error: 'Failed to save your information. Please try again.'
            };
          }
        }}
      />
      
      {submissionId && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>Your submission ID: <strong>{submissionId}</strong></p>
          <p>Please save this for your reference.</p>
        </div>
      )}
    </div>
  );
}
```

### Using with Analytics

```jsx
import { WaitlistForm } from 'react-waitlist';

function AnalyticsWaitlist() {
  // Track form events
  const trackEvent = (eventName, data) => {
    // Example for Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, data);
    }
    
    // Example for Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track(eventName, data);
    }
  };
  
  return (
    <WaitlistForm
      title="Join Our Waitlist"
      description="Be the first to know when we launch."
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
      
      // Track form events with analytics
      onFieldFocus={(data) => {
        trackEvent('waitlist_field_focus', {
          field: data.field,
          timestamp: data.timestamp
        });
      }}
      
      onSubmit={(data) => {
        trackEvent('waitlist_form_submit', {
          timestamp: data.timestamp
        });
      }}
      
      onSuccess={(data) => {
        trackEvent('waitlist_submission_success', {
          timestamp: data.timestamp,
          email: data.formData.email
        });
        return { success: true };
      }}
      
      onError={(data) => {
        trackEvent('waitlist_submission_error', {
          timestamp: data.timestamp,
          error: data.error.message
        });
      }}
      
      onSecurityEvent={(data) => {
        trackEvent('waitlist_security_event', {
          type: data.securityType,
          timestamp: data.timestamp,
          details: data.details
        });
      }}
    />
  );
}
```

### Internationalization

```jsx
import { WaitlistForm } from 'react-waitlist';

function LocalizedWaitlist({ language = 'en' }) {
  // Define translations
  const translations = {
    en: {
      title: 'Join Our Waitlist',
      description: 'Be the first to know when we launch.',
      submitText: 'Join Now',
      successTitle: 'You\'re on the list!',
      successDescription: 'Thank you for joining our waitlist. We\'ll keep you updated.',
      fields: {
        email: {
          label: 'Email',
          placeholder: 'your@email.com'
        },
        firstName: {
          label: 'First Name',
          placeholder: 'John'
        },
        newsletter: {
          label: 'Subscribe to newsletter'
        }
      }
    },
    es: {
      title: 'Únete a Nuestra Lista de Espera',
      description: 'Sé el primero en saber cuando lancemos.',
      submitText: 'Unirse Ahora',
      successTitle: '¡Estás en la lista!',
      successDescription: 'Gracias por unirte a nuestra lista de espera. Te mantendremos informado.',
      fields: {
        email: {
          label: 'Correo Electrónico',
          placeholder: 'tu@correo.com'
        },
        firstName: {
          label: 'Nombre',
          placeholder: 'Juan'
        },
        newsletter: {
          label: 'Suscribirse al boletín'
        }
      }
    }
  };
  
  // Use the selected language or fall back to English
  const t = translations[language] || translations.en;
  
  return (
    <WaitlistForm
      title={t.title}
      description={t.description}
      submitText={t.submitText}
      successTitle={t.successTitle}
      successDescription={t.successDescription}
      resendAudienceId="YOUR_AUDIENCE_ID"
      resendProxyEndpoint="/api/resend-proxy"
      
      // Localized fields
      fields={[
        {
          name: 'email',
          type: 'email',
          label: t.fields.email.label,
          required: true,
          placeholder: t.fields.email.placeholder,
        },
        {
          name: 'firstName',
          type: 'text',
          label: t.fields.firstName.label,
          required: false,
          placeholder: t.fields.firstName.placeholder,
        },
        {
          name: 'newsletter',
          type: 'checkbox',
          label: t.fields.newsletter.label,
          required: false,
          defaultValue: true
        }
      ]}
    />
  );
}
``` 