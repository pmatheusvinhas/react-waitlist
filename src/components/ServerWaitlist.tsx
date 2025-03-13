import React from 'react';
import { WaitlistProps, ThemeConfig } from '../core/types';
import ClientWaitlist from './ClientWaitlist';

/**
 * Props for the ServerWaitlist component
 */
export interface ServerWaitlistProps extends WaitlistProps {
  /**
   * Whether to serialize the theme for client-side rendering
   * @default true
   */
  serializeTheme?: boolean;
}

/**
 * Server-side waitlist component
 * This component is designed to be used in server components of SSR frameworks (e.g. Next.js App Router)
 * It works together with ClientWaitlist to provide a seamless SSR experience
 * Import from 'react-waitlist/server'
 */
const ServerWaitlist: React.FC<ServerWaitlistProps> = ({
  apiKey,
  resendAudienceId,
  resendProxyEndpoint,
  webhookProxyEndpoint,
  recaptchaProxyEndpoint,
  title,
  description,
  submitText,
  successTitle,
  successDescription,
  fields,
  theme,
  frameworkConfig,
  security,
  analytics,
  resendMapping,
  webhooks,
  className,
  style,
  a11y,
  serializeTheme = true,
}) => {
  // Serialize props for client component
  const serializedProps = {
    // Don't pass apiKey to client
    resendAudienceId,
    resendProxyEndpoint,
    webhookProxyEndpoint,
    recaptchaProxyEndpoint,
    title,
    description,
    submitText,
    successTitle,
    successDescription,
    fields,
    // Serialize theme if needed
    theme: serializeTheme ? theme : undefined,
    frameworkConfig,
    security,
    analytics,
    resendMapping,
    webhooks,
    className,
    style,
    a11y,
  };

  return (
    <ClientWaitlist
      {...serializedProps}
      apiKey={apiKey} // This will only be used server-side
    />
  );
};

export default ServerWaitlist; 