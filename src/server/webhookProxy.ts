/**
 * Configuration for the webhook proxy
 */
export interface WebhookProxyConfig {
  /** Allowed webhook destinations (for security) */
  allowedDestinations?: string[];
  /** Secret key for webhook authentication */
  secretKey?: string;
  /** Rate limiting configuration */
  rateLimit?: {
    /** Maximum number of requests per window */
    max: number;
    /** Time window in seconds */
    windowSec: number;
  };
  /** Custom headers to add to all webhook requests */
  defaultHeaders?: Record<string, string>;
}

/**
 * Request handler type for different frameworks
 */
type RequestHandler = (req: any, res: any) => Promise<void>;

/**
 * Create a proxy handler for webhooks
 * This function returns a handler compatible with various server frameworks
 */
export function createWebhookProxy(config: WebhookProxyConfig): RequestHandler {
  const { allowedDestinations, secretKey, rateLimit, defaultHeaders } = config;
  
  // Store IP addresses and their request timestamps for rate limiting
  const ipRequests: Record<string, number[]> = {};
  
  return async (req: any, res: any) => {
    try {
      // Only allow POST requests
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
      
      // Get client IP for rate limiting
      const clientIp = 
        req.headers['x-forwarded-for'] || 
        req.connection?.remoteAddress || 
        'unknown';
      
      // Apply rate limiting if configured
      if (rateLimit) {
        const now = Date.now();
        const windowMs = rateLimit.windowSec * 1000;
        
        // Initialize or update request history for this IP
        ipRequests[clientIp] = ipRequests[clientIp] || [];
        ipRequests[clientIp] = ipRequests[clientIp]
          .filter(time => now - time < windowMs)
          .concat(now);
        
        // Check if rate limit exceeded
        if (ipRequests[clientIp].length > rateLimit.max) {
          return res.status(429).json({ 
            error: 'Too many requests',
            retryAfter: Math.ceil(windowMs / 1000)
          });
        }
      }
      
      // Parse request body
      const body = req.body;
      
      // Validate required fields
      if (!body || !body.destination || !body.payload) {
        return res.status(400).json({ error: 'Missing required fields (destination, payload)' });
      }
      
      // Validate destination if allowedDestinations is specified
      if (allowedDestinations && allowedDestinations.length > 0) {
        const isAllowed = allowedDestinations.some(allowed => 
          body.destination.startsWith(allowed)
        );
        
        if (!isAllowed) {
          return res.status(403).json({ error: 'Destination not allowed' });
        }
      }
      
      // Validate secret key if provided
      if (secretKey && body.secretKey !== secretKey) {
        return res.status(401).json({ error: 'Invalid secret key' });
      }
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(defaultHeaders || {}),
        ...(body.headers || {})
      };
      
      // Forward the webhook - using global fetch which is available in modern environments
      const webhookResponse = await fetch(body.destination, {
        method: 'POST',
        headers,
        body: JSON.stringify(body.payload),
      });
      
      // Get response data
      const responseStatus = webhookResponse.status;
      let responseData;
      
      try {
        responseData = await webhookResponse.json();
      } catch (e) {
        responseData = { text: await webhookResponse.text() };
      }
      
      // Return response
      return res.status(200).json({
        success: responseStatus >= 200 && responseStatus < 300,
        statusCode: responseStatus,
        response: responseData
      });
    } catch (error) {
      console.error('Webhook proxy error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
} 