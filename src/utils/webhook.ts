import { WebhookConfig, WebhookEvent } from '../types';

/**
 * Payload for webhook requests
 */
export interface WebhookPayload {
  /** Event that triggered the webhook */
  event: WebhookEvent;
  /** Timestamp of the event */
  timestamp: string;
  /** Form data */
  formData: Record<string, any>;
  /** Response from Resend API (for success events) */
  resendResponse?: any;
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
  event: WebhookEvent,
  data: Record<string, any>,
  resendResponse?: any,
  error?: Error,
  webhookProxyEndpoint?: string
): Promise<Response | null> => {
  // Check if this webhook should be triggered for this event
  if (config.events && !config.events.includes(event)) {
    return null;
  }

  // Prepare the payload
  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    formData: {},
  };

  // Include form data based on configuration
  if (config.includeAllFields) {
    payload.formData = { ...data };
  } else if (config.includeFields && config.includeFields.length > 0) {
    config.includeFields.forEach((field) => {
      if (data[field] !== undefined) {
        payload.formData[field] = data[field];
      }
    });
  } else {
    // Default: include all fields
    payload.formData = { ...data };
  }

  // Add Resend response for success events
  if (event === 'success' && resendResponse) {
    payload.resendResponse = resendResponse;
  }

  // Add error information for error events
  if (event === 'error' && error) {
    payload.error = {
      message: error.message,
      code: (error as any).code,
    };
  }

  try {
    // In browser environments, webhookProxyEndpoint is required for security
    if (isBrowser) {
      if (!webhookProxyEndpoint) {
        console.error('webhookProxyEndpoint is required for client-side webhook delivery. Use server-side components or set up a webhook proxy.');
        return null;
      }

      const proxyPayload = {
        destination: config.url,
        headers: config.headers,
        payload,
      };

      const response = await fetch(webhookProxyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proxyPayload),
      });

      return response;
    } else {
      // Server-side direct webhook delivery
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify(payload),
      });

      // Handle retry logic if configured
      if (!response.ok && config.retry && config.maxRetries) {
        let retries = 0;
        while (!response.ok && retries < config.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (retries + 1)));
          const retryResponse = await fetch(config.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...config.headers,
            },
            body: JSON.stringify(payload),
          });
          
          if (retryResponse.ok) {
            return retryResponse;
          }
          
          retries++;
        }
      }

      return response;
    }
  } catch (err) {
    console.error('Failed to send webhook:', err);
    return null;
  }
};

/**
 * Send multiple webhooks for an event
 */
export const sendWebhooks = async (
  configs: WebhookConfig[] | undefined,
  event: WebhookEvent,
  data: Record<string, any>,
  resendResponse?: any,
  error?: Error,
  webhookProxyEndpoint?: string
): Promise<void> => {
  if (!configs || configs.length === 0) {
    return;
  }

  // Send all webhooks in parallel
  await Promise.all(
    configs.map((config) => sendWebhook(config, event, data, resendResponse, error, webhookProxyEndpoint))
  );
};