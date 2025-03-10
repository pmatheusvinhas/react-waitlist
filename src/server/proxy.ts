import { Resend } from 'resend';

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
  
  // Initialize Resend client
  const resend = new Resend(apiKey);
  
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
      
      // Handle different actions
      const action = body.action || 'create';
      
      // Validate required fields
      if (!body || !body.audienceId) {
        return res.status(400).json({ error: 'Missing audienceId' });
      }
      
      // Validate audience ID if allowedAudiences is specified
      if (allowedAudiences && allowedAudiences.length > 0) {
        if (!allowedAudiences.includes(body.audienceId)) {
          return res.status(403).json({ error: 'Audience ID not allowed' });
        }
      }
      
      // Execute the appropriate action
      let result;
      
      switch (action) {
        case 'create':
          if (!body.email) {
            return res.status(400).json({ error: 'Missing email' });
          }
          
          // Create contact with basic fields
          const createOptions: any = {
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            unsubscribed: body.unsubscribed,
            audienceId: body.audienceId,
          };
          
          // Add metadata if provided
          if (body.metadata) {
            createOptions.metadata = body.metadata;
          }
          
          result = await resend.contacts.create(createOptions);
          break;
          
        case 'update':
          if (!body.id && !body.email) {
            return res.status(400).json({ error: 'Missing id or email' });
          }
          
          // Update contact with basic fields
          const updateOptions: any = {
            audienceId: body.audienceId,
          };
          
          // Add id or email
          if (body.id) {
            updateOptions.id = body.id;
          } else {
            updateOptions.email = body.email;
          }
          
          // Add optional fields if provided
          if (body.firstName !== undefined) updateOptions.firstName = body.firstName;
          if (body.lastName !== undefined) updateOptions.lastName = body.lastName;
          if (body.unsubscribed !== undefined) updateOptions.unsubscribed = body.unsubscribed;
          if (body.metadata) updateOptions.metadata = body.metadata;
          
          result = await resend.contacts.update(updateOptions);
          break;
          
        case 'remove':
          if (!body.id && !body.email) {
            return res.status(400).json({ error: 'Missing id or email' });
          }
          
          result = await resend.contacts.remove({
            id: body.id,
            email: body.email,
            audienceId: body.audienceId,
          });
          break;
          
        case 'get':
          if (!body.id && !body.email) {
            return res.status(400).json({ error: 'Missing id or email' });
          }
          
          result = await resend.contacts.get({
            id: body.id,
            audienceId: body.audienceId,
          });
          break;
          
        case 'list':
          result = await resend.contacts.list({
            audienceId: body.audienceId,
          });
          break;
          
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
      
      // Return response
      return res.status(200).json(result);
    } catch (error) {
      console.error('Resend proxy error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
} 