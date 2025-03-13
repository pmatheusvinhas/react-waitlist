'use client';

import React from 'react';
import { WaitlistProps } from '../core/types';
import WaitlistForm from './WaitlistForm';

/**
 * Client-side waitlist component for SSR
 * This component is designed to be used with ServerWaitlist in SSR frameworks
 * Import from 'react-waitlist/client'
 */
const ClientWaitlist: React.FC<WaitlistProps> = (props) => {
  return <WaitlistForm {...props} />;
};

export default ClientWaitlist; 