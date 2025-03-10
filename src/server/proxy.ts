/**
 * Configuration for the Resend proxy
 */
export interface ResendProxyConfig {
  /** Resend API key */
  apiKey: string;
  /** Allowed audience IDs (for security) */
  allowedAudiences?: string[];
  /** Rate limiting configuration */
  rateLimit?: {
    /** Maximum number of requests per window */
    max: number;
    /** Time window in seconds */
    windowSec: number;
  };
}

/**
 * Request handler type for different frameworks
 */
type RequestHandler = (req: any, res: any) => Promise<void>;

/**
 * Create a proxy handler for Resend API
 * This function returns a handler compatible with various server frameworks
 */
export function createResendProxy(config: ResendProxyConfig): RequestHandler {
  const { apiKey, allowedAudiences, rateLimit } = config;
  
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
      if (!body || !body.audienceId || !body.contact || !body.contact.email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Validate audience ID if allowedAudiences is specified
      if (allowedAudiences && allowedAudiences.length > 0) {
        if (!allowedAudiences.includes(body.audienceId)) {
          return res.status(403).json({ error: 'Audience ID not allowed' });
        }
      }
      
      // Prepare data for Resend API
      const contactData = {
        ...body.contact,
        audienceId: body.audienceId,
      };
      
      // Call Resend API
      const response = await fetch('https://api.resend.com/audiences/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(contactData),
      });
      
      // Get response data
      const data = await response.json();
      
      // Return response with same status code
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Resend proxy error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
} 