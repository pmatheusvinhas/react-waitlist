// Export server-specific components and utilities
import ServerWaitlist from './server/serverComponent';
import { createResendProxy, ResendProxyConfig } from './server/proxy';
import { createWebhookProxy, WebhookProxyConfig } from './server/webhookProxy';
import { createRecaptchaProxy } from './server/recaptchaProxy';

// Export the server component
export { ServerWaitlist };
export default ServerWaitlist;

// Export server-specific utilities
export { createResendProxy, createWebhookProxy, createRecaptchaProxy };
export type { ResendProxyConfig, WebhookProxyConfig };

// Note: ClientWaitlist is intentionally not exported from this file
// to prevent it from being imported in a server context.
// It should be imported from 'react-waitlist/client' instead. 