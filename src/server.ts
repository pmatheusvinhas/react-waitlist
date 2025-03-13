// Export server-specific components and utilities
import ServerWaitlist from './server/serverComponent';
import ClientWaitlist from './components/ClientWaitlist';
import { createResendProxy, ResendProxyConfig } from './server/proxy';
import { createWebhookProxy, WebhookProxyConfig } from './server/webhookProxy';
import { createRecaptchaProxy } from './server/recaptchaProxy';

// Export the server component
export { ServerWaitlist, ClientWaitlist };
export default ServerWaitlist;

// Export server-specific utilities
export { createResendProxy, createWebhookProxy, createRecaptchaProxy };
export type { ResendProxyConfig, WebhookProxyConfig }; 