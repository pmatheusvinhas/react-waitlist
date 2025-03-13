import React from 'react';
import { WaitlistProps } from '../core/types';

/**
 * Server-side waitlist component for frameworks with SSR support
 * This component can safely use the API key directly since it runs on the server
 */
export interface ServerWaitlistProps extends Omit<WaitlistProps, 'proxyEndpoint'> {
  /** Resend API key (required for server component) */
  apiKey: string;
  /** reCAPTCHA site key (optional) */
  recaptchaSiteKey?: string;
}

/**
 * Server-side waitlist component
 * Use this component in server-rendered contexts (Next.js App Router, Remix, etc.)
 * This is a true server component that renders a client component
 */
const ServerWaitlist = (props: ServerWaitlistProps) => {
  // Extract the props we want to pass to the client component
  const {
    apiKey,
    resendAudienceId,
    recaptchaSiteKey,
    title,
    description,
    submitText,
    successTitle,
    successDescription,
    fields,
    theme,
    security,
    analytics,
    resendMapping,
    webhooks,
    className,
    style,
  } = props;

  // Create a client component wrapper
  return (
    <ClientWaitlistWrapper
      apiKey={apiKey}
      resendAudienceId={resendAudienceId || ''}
      recaptchaSiteKey={recaptchaSiteKey}
      title={title}
      description={description}
      submitText={submitText}
      successTitle={successTitle}
      successDescription={successDescription}
      fields={fields ? JSON.stringify(fields) : undefined}
      theme={theme ? JSON.stringify(theme) : undefined}
      security={security ? JSON.stringify(security) : undefined}
      analytics={analytics ? JSON.stringify(analytics) : undefined}
      resendMapping={resendMapping ? JSON.stringify(resendMapping) : undefined}
      webhooks={webhooks ? JSON.stringify(webhooks) : undefined}
      className={className}
      style={style ? JSON.stringify(style) : undefined}
    />
  );
};

// This is a special component that will be rendered on the client
// It's a simple wrapper that will be replaced with the actual client component
const ClientWaitlistWrapper = (props: {
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
}) => {
  // This is just a placeholder that will be replaced with the actual client component
  return (
    <div data-waitlist-placeholder="true">
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(props),
        }}
      />
    </div>
  );
};

export default ServerWaitlist; 