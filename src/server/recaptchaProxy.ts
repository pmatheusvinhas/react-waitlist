/**
 * Generic request interface
 */
interface Request {
  method?: string;
  body?: any;
}

/**
 * Generic response interface
 */
interface Response {
  status: (code: number) => {
    json: (data: any) => any;
  };
}

interface RecaptchaProxyOptions {
  secretKey: string;
  minScore?: number;
  allowedActions?: string[];
}

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  error?: string;
}

/**
 * Create a proxy handler for reCAPTCHA verification
 */
export const createRecaptchaProxy = ({
  secretKey,
  minScore = 0.5,
  allowedActions = ['submit_waitlist'],
}: RecaptchaProxyOptions) => {
  return async (req: Request, res: Response) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Get token from request body
    const { token, action } = req.body || {};

    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }

    try {
      // Verify token with Google reCAPTCHA API
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
        { method: 'POST' }
      );

      const data = await response.json();

      // Check if verification was successful
      if (!data.success) {
        return res.status(400).json({
          success: false,
          error: data['error-codes']?.join(', ') || 'Verification failed',
        });
      }

      // Check action if specified
      if (action && data.action !== action) {
        return res.status(400).json({
          success: false,
          score: data.score,
          action: data.action,
          error: `Action mismatch: expected ${action}, got ${data.action}`,
        });
      }

      // Check if action is allowed
      if (allowedActions.length > 0 && !allowedActions.includes(data.action)) {
        return res.status(400).json({
          success: false,
          score: data.score,
          action: data.action,
          error: `Action not allowed: ${data.action}`,
        });
      }

      // Check score
      if (data.score < minScore) {
        return res.status(400).json({
          success: false,
          score: data.score,
          action: data.action,
          error: `Score too low: ${data.score}`,
        });
      }

      // Return success response
      return res.status(200).json({
        success: true,
        score: data.score,
        action: data.action,
      });
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}; 