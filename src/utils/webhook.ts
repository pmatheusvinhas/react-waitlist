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
    // In browser environments, check for webhookProxyEndpoint
    if (isBrowser) {
      if (!webhookProxyEndpoint) {
        // Show warning but continue with direct call
        console.warn(
          'SECURITY WARNING: Calling webhooks directly from the client-side exposes your headers and credentials. ' +
          'Consider using webhookProxyEndpoint for better security. ' +
          'See https://github.com/pmatheusvinhas/react-waitlist/blob/main/docs/webhooks.md for more information.'
        );

        // Check for sensitive headers
        if (config.headers) {
          const sensitiveHeaderPatterns = [
            /api[-_]?key/i,
            /auth/i,
            /token/i,
            /secret/i,
            /password/i,
            /credential/i,
          ];
          
          const hasSensitiveHeaders = Object.keys(config.headers).some(header => 
            sensitiveHeaderPatterns.some(pattern => pattern.test(header))
          );
          
          if (hasSensitiveHeaders) {
            console.error(
              'SECURITY RISK: Your webhook contains headers that appear to contain sensitive information. ' +
              'These will be visible to anyone using your application. ' +
              'Use webhookProxyEndpoint to secure these credentials.'
            );
          }
        }

        // Direct webhook delivery (not recommended for client-side)
        const response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          body: JSON.stringify(payload),
        });

        return response;
      }

      // Use proxy (recommended for client-side)
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