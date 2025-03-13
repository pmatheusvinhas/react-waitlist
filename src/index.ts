import { WaitlistForm } from './components';
import ClientWaitlist from './components/ClientWaitlist';
import { WaitlistProps } from './types';

// Export the main component as both default and named export
export default WaitlistForm;
export { WaitlistForm, ClientWaitlist };

// Export types and utilities
export * from './types';
export * from './utils';
export * from './styles';
export * from './hooks'; 