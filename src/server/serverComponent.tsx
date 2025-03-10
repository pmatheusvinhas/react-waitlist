import React from 'react';
import { WaitlistProps } from '../types';
import WaitlistForm from '../components/WaitlistForm';

/**
 * Server-side waitlist component for frameworks with SSR support
 * This component can safely use the API key directly since it runs on the server
 */
export interface ServerWaitlistProps extends Omit<WaitlistProps, 'proxyEndpoint'> {
  /** Resend API key (required for server component) */
  apiKey: string;
}

/**
 * Server-side waitlist component
 * Use this component in server-rendered contexts (Next.js App Router, Remix, etc.)
 */
const ServerWaitlist: React.FC<ServerWaitlistProps> = (props) => {
  // Pass all props directly to the WaitlistForm component
  return <WaitlistForm {...props} />;
};

export default ServerWaitlist; 