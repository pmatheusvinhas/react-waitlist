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
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Request handler type for different frameworks
 */
type RequestHandler = (req: any, res: any) => Promise<void>;

/**
 * Extended error interface for Resend API errors
 */
interface ResendApiError extends Error {
  statusCode?: number;
  name: string;
}

/**
 * Create a proxy handler for Resend API
 * This function returns a handler compatible with various server frameworks
 */
export function createResendProxy(config: ResendProxyConfig): RequestHandler {
  const { apiKey, allowedAudiences, rateLimit, debug } = config;
  
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
      
      // Validate API key
      if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing API key' });
      }
      
      // Initialize Resend client
      let resend: Resend;
      try {
        resend = new Resend(apiKey);
        if (debug) {
          console.log('Resend client initialized successfully');
        }
      } catch (initError) {
        console.error('Failed to initialize Resend client:', initError);
        return res.status(500).json({ 
          error: 'Failed to initialize Resend client',
          message: initError instanceof Error ? initError.message : 'Unknown error'
        });
      }
      
      // Execute the appropriate action
      let result;
      
      try {
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
              audience_id: body.audienceId,
            };
            
            // Add metadata if provided
            if (body.metadata) {
              createOptions.metadata = body.metadata;
            }
            
            if (debug) {
              console.log('Creating contact with:', {
                ...createOptions,
                audience_id: createOptions.audience_id
              });
            }
            
            result = await resend.contacts.create(createOptions);
            break;
            
          case 'update':
            if (!body.id && !body.email) {
              return res.status(400).json({ error: 'Missing id or email' });
            }
            
            // Update contact with basic fields
            const updateOptions: any = {
              audience_id: body.audienceId,
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
            
            if (debug) {
              console.log('Updating contact with:', {
                ...updateOptions,
                audience_id: updateOptions.audience_id
              });
            }
            
            result = await resend.contacts.update(updateOptions);
            break;
            
          case 'remove':
            if (!body.id && !body.email) {
              return res.status(400).json({ error: 'Missing id or email' });
            }
            
            const removeOptions = {
              id: body.id,
              audience_id: body.audienceId,
            };
            
            if (debug) {
              console.log('Removing contact with:', {
                ...removeOptions,
                audience_id: removeOptions.audience_id
              });
            }
            
            result = await resend.contacts.remove(removeOptions);
            break;
            
          case 'get':
            if (!body.id && !body.email) {
              return res.status(400).json({ error: 'Missing id or email' });
            }
            
            const getOptions = {
              id: body.id,
              audience_id: body.audienceId,
            };
            
            if (debug) {
              console.log('Getting contact with:', {
                ...getOptions,
                audience_id: getOptions.audience_id
              });
            }
            
            result = await resend.contacts.get(getOptions);
            break;
            
          case 'list':
            const listOptions = {
              audience_id: body.audienceId,
            };
            
            if (debug) {
              console.log('Listing contacts for audience:', listOptions.audience_id);
            }
            
            result = await resend.contacts.list(listOptions);
            break;
            
          default:
            return res.status(400).json({ error: 'Invalid action' });
        }
        
        if (debug) {
          console.log('Resend API response:', result);
        }
        
        // Check if there's an error in the response
        if (result && result.error) {
          console.error('Resend API error:', result.error);
          
          // Return the error with the appropriate status code
          // Use a safe approach to get the status code
          let statusCode = 500;
          if (result.error && typeof result.error === 'object' && 'statusCode' in result.error) {
            statusCode = (result.error as any).statusCode || 500;
          }
          
          return res.status(statusCode).json({ 
            error: result.error.message || 'Unknown error',
            code: result.error.name || 'unknown_error'
          });
        }
        
        // Return successful response
        return res.status(200).json(result.data || result);
      } catch (error) {
        // Cast error to ResendApiError to access statusCode
        const apiError = error as ResendApiError;
        console.error('Resend API error:', apiError);
        
        // Handle specific API errors
        if (apiError.name === 'restricted_api_key') {
          return res.status(401).json({
            error: 'API key is restricted. This operation requires a key with audience management permissions.',
            code: 'restricted_api_key',
            details: apiError.message
          });
        }
        
        // Return the error with appropriate status code
        const statusCode = apiError.statusCode || 500;
        return res.status(statusCode).json({ 
          error: apiError.message || 'Unknown error',
          code: apiError.name || 'unknown_error',
          details: debug ? (apiError.stack || '') : undefined
        });
      }
    } catch (error) {
      const genericError = error as Error;
      console.error('Resend proxy error:', genericError);
      
      return res.status(500).json({ 
        error: 'Internal server error',
        message: genericError.message || 'Unknown error',
        details: debug ? (genericError.stack || '') : undefined
      });
    }
  };
} 