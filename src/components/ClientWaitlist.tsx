'use client';

import React, { useEffect, useState } from 'react';
import WaitlistForm from './WaitlistForm';
import { Field, ThemeConfig, SecurityConfig, AnalyticsConfig, ResendMapping, WebhookConfig } from '../types';

interface ClientWaitlistProps {
  apiKey: string;
  resendAudienceId: string;
  recaptchaSiteKey?: string;
  title?: string;
  description?: string;
  submitText?: string;
  successTitle?: string;
  successDescription?: string;
  fields?: string;
  theme?: string;
  security?: string;
  analytics?: string;
  resendMapping?: string;
  webhooks?: string;
  className?: string;
  style?: string;
}

/**
 * Client-side waitlist component
 * This component is responsible for hydrating the server-rendered placeholder
 * with the actual client-side form
 */
const ClientWaitlist: React.FC = () => {
  const [props, setProps] = useState<ClientWaitlistProps | null>(null);

  useEffect(() => {
    // Find all waitlist placeholders on the page
    const placeholders = document.querySelectorAll('[data-waitlist-placeholder="true"]');
    
    if (placeholders.length === 0) {
      console.warn('No waitlist placeholders found on the page');
      return;
    }

    // Get the first placeholder
    const placeholder = placeholders[0];
    
    // Get the JSON data from the script tag
    const script = placeholder.querySelector('script');
    
    if (!script) {
      console.warn('No script tag found in waitlist placeholder');
      return;
    }

    try {
      // Parse the JSON data
      const jsonData = JSON.parse(script.innerHTML);
      setProps(jsonData);
    } catch (error) {
      console.error('Failed to parse waitlist props:', error);
    }
  }, []);

  if (!props) {
    return null;
  }

  // Parse the JSON strings back into objects
  const parsedProps = {
    ...props,
    fields: props.fields ? JSON.parse(props.fields) as Field[] : undefined,
    theme: props.theme ? JSON.parse(props.theme) as ThemeConfig : undefined,
    security: props.security ? JSON.parse(props.security) as SecurityConfig : undefined,
    analytics: props.analytics ? JSON.parse(props.analytics) as AnalyticsConfig : undefined,
    resendMapping: props.resendMapping ? JSON.parse(props.resendMapping) as ResendMapping : undefined,
    webhooks: props.webhooks ? JSON.parse(props.webhooks) as WebhookConfig[] : undefined,
    style: props.style ? JSON.parse(props.style) : undefined,
  };

  // Extract reCAPTCHA site key from security config if available
  const security = parsedProps.security || {};
  
  // Render the actual form
  return (
    <WaitlistForm
      apiKey={parsedProps.apiKey}
      resendAudienceId={parsedProps.resendAudienceId}
      title={parsedProps.title}
      description={parsedProps.description}
      submitText={parsedProps.submitText}
      successTitle={parsedProps.successTitle}
      successDescription={parsedProps.successDescription}
      fields={parsedProps.fields}
      theme={parsedProps.theme}
      security={{
        ...security,
        enableReCaptcha: !!parsedProps.recaptchaSiteKey,
        reCaptchaSiteKey: parsedProps.recaptchaSiteKey,
      }}
      analytics={parsedProps.analytics}
      resendMapping={parsedProps.resendMapping}
      webhooks={parsedProps.webhooks}
      className={parsedProps.className}
      style={parsedProps.style}
    />
  );
};

export default ClientWaitlist; 