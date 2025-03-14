/**
 * Generic request interface
 */
interface Request {
  method?: string;
  body?: any;
  headers?: any;
}

/**
 * Generic response interface
 */
interface Response {
  status: (code: number) => Response;
  json: (data: any) => any;
  setHeader?: (name: string, value: string) => Response;
}

/**
 * Options for configuring the reCAPTCHA proxy
 */
export interface RecaptchaProxyOptions {
  secretKey: string;
  minScore?: number;
  allowedActions?: string[];
  debug?: boolean;
}

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  error?: string;
}

/**
 * Create a proxy handler for reCAPTCHA verification
 */
export const createRecaptchaProxy = ({
  secretKey,
  minScore = 0.5,
  allowedActions = ['submit_waitlist'],
  debug = false,
}: RecaptchaProxyOptions) => {
  return async (req: Request, res: Response) => {
    // Set CORS headers if setHeader is available
    if (res.setHeader) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ success: true });
    }

    // Only allow POST requests
    if (req.method && req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed',
        'error-codes': ['method-not-allowed']
      });
    }

    // Get token and action from request body
    const { token, action } = req.body || {};

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token is required',
        'error-codes': ['missing-token']
      });
    }

    if (debug) {
      console.log(`reCAPTCHA Proxy: Verifying token (length: ${token.length}) for action: ${action || 'not specified'}`);
    }

    try {
      // Import axios
      let axios;
      try {
        axios = require('axios');
      } catch (error) {
        console.error('reCAPTCHA Proxy: Failed to import axios, falling back to fetch');
        // We'll handle this case in the fetch fallback
      }
      
      // Verify token with Google reCAPTCHA API
      let data: RecaptchaVerifyResponse;
      
      if (axios) {
        // Use axios if available
        const response = await axios.post(
          'https://www.google.com/recaptcha/api/siteverify',
          null,
          {
            params: {
              secret: secretKey,
              response: token
            }
          }
        );
        data = response.data;
      } else {
        // Fallback to fetch
        const params = new URLSearchParams();
        params.append('secret', secretKey);
        params.append('response', token);
        
        const response = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?${params.toString()}`,
          { method: 'POST' }
        );
        
        data = await response.json();
      }

      if (debug) {
        console.log('reCAPTCHA Proxy: Verification response', data);
      }

      // Check if verification was successful
      if (!data.success) {
        return res.status(400).json({
          success: false,
          'error-codes': data['error-codes'] || ['verification-failed'],
          error: data['error-codes']?.join(', ') || 'Verification failed'
        });
      }

      // Check action if specified
      if (action && data.action !== action) {
        return res.status(400).json({
          success: false,
          score: data.score,
          action: data.action,
          error: `Action mismatch: expected ${action}, got ${data.action}`,
          'error-codes': ['action-mismatch']
        });
      }

      // Check if action is allowed
      if (allowedActions.length > 0 && !allowedActions.includes(data.action || '')) {
        return res.status(403).json({
          success: false,
          error: 'Action not allowed',
          'error-codes': ['action-not-allowed']
        });
      }

      // Check score
      if ((data.score || 0) < minScore) {
        return res.status(403).json({
          success: false,
          score: data.score,
          error: `reCAPTCHA score too low: ${data.score} (minimum: ${minScore})`,
          'error-codes': ['score-too-low']
        });
      }

      // Return success response
      return res.status(200).json({
        success: true,
        score: data.score,
        action: data.action,
        challenge_ts: data.challenge_ts,
        hostname: data.hostname
      });
    } catch (error) {
      console.error('reCAPTCHA Proxy: Verification error:', error);
      return res.status(500).json({
        success: false,
        error: `Failed to verify reCAPTCHA token: ${error instanceof Error ? error.message : String(error)}`,
        'error-codes': ['server-error']
      });
    }
  };
}; 