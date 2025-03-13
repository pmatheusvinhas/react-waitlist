import { WaitlistEventType, WaitlistEventData } from './events';
import { WebhookConfig } from './types';

/**
 * Payload for webhook requests
 */
export interface WebhookPayload {
  /** Event that triggered the webhook */
  event: WaitlistEventType;
  /** Timestamp of the event */
  timestamp: string;
  /** Field name (for field_focus events) */
  field?: string;
  /** Form data */
  formData?: Record<string, any>;
  /** Response from API (for success events) */
  response?: any;
  /** Error information (for error events) */
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Determine if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Send a webhook request
 */
export const sendWebhook = async (
  config: WebhookConfig,
  eventData: WaitlistEventData,
  webhookProxyEndpoint?: string
): Promise<Response | null> => {
  // Check if this webhook should be triggered for this event
  if (config.events && !config.events.includes(eventData.type)) {
    return null;
  }

  // Prepare the payload
  const payload: WebhookPayload = {
    event: eventData.type,
    timestamp: eventData.timestamp,
  };

  // Include field for field_focus events
  if (eventData.type === 'field_focus' && eventData.field) {
    payload.field = eventData.field;
  }

  // Include form data if available
  if (eventData.formData) {
    if (config.includeAllFields) {
      payload.formData = eventData.formData;
    } else if (config.includeFields && config.includeFields.length > 0) {
      payload.formData = {};
      config.includeFields.forEach(field => {
        if (eventData.formData && eventData.formData[field] !== undefined) {
          payload.formData![field] = eventData.formData[field];
        }
      });
    }
  }

  // Include response for success events
  if (eventData.type === 'success' && eventData.response) {
    payload.response = eventData.response;
  }

  // Include error for error events
  if (eventData.type === 'error' && eventData.error) {
    payload.error = eventData.error;
  }

  // Determine the URL to send the webhook to
  let url = config.url;

  // If we're in a browser and a proxy endpoint is provided, use it
  if (isBrowser && webhookProxyEndpoint) {
    url = webhookProxyEndpoint;
  }

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  // Send the webhook
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(isBrowser && webhookProxyEndpoint ? {
        url: config.url,
        payload,
      } : payload),
    });

    return response;
  } catch (error) {
    console.error('Error sending webhook:', error);
    return null;
  }
};

/**
 * Send webhooks to configured endpoints
 */
export const sendWebhooks = async (
  webhooks: WebhookConfig[] | undefined,
  eventType: string,
  formData: Record<string, any>,
  response?: any,
  error?: Error,
  proxyEndpoint?: string
): Promise<void> => {
  if (!webhooks || webhooks.length === 0) {
    return;
  }

  // Filter webhooks that should be triggered for this event
  const relevantWebhooks = webhooks.filter(
    (webhook) => !webhook.events || webhook.events.includes(eventType as any)
  );

  if (relevantWebhooks.length === 0) {
    return;
  }

  // Prepare payload
  const payload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    data: formData,
    response,
    error: error ? { message: error.message } : undefined,
  };

  // Send webhooks
  await Promise.all(
    relevantWebhooks.map(async (webhook) => {
      try {
        // If proxy endpoint is provided, use it
        if (proxyEndpoint) {
          await fetch(proxyEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: webhook.url,
              payload,
              headers: webhook.headers,
            }),
          });
        } else {
          // Otherwise, send directly to webhook URL
          await fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...webhook.headers,
            },
            body: JSON.stringify(payload),
          });
        }
      } catch (err) {
        console.error(`Error sending webhook to ${webhook.url}:`, err);
      }
    })
  );
}; 