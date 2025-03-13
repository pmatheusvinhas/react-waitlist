import { SecurityConfig } from './types';

/**
 * Interface for reCAPTCHA response
 */
export interface ReCaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

/**
 * Load the reCAPTCHA script dynamically
 */
export const loadReCaptchaScript = (siteKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (typeof document !== 'undefined' && document.querySelector(`script[src*="recaptcha"]`)) {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          resolve();
        });
      } else {
        resolve();
      }
      return;
    }

    // Create script element
    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      // Set up callbacks
      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            resolve();
          });
        } else {
          reject(new Error('reCAPTCHA not available'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load reCAPTCHA'));
      };

      // Add script to document
      document.head.appendChild(script);
    } else {
      reject(new Error('Document not available'));
    }
  });
};

/**
 * Execute reCAPTCHA and get a token
 */
export const executeReCaptcha = async (
  siteKey: string,
  action: string = 'submit_waitlist'
): Promise<string> => {
  if (typeof window === 'undefined' || !window.grecaptcha) {
    throw new Error('reCAPTCHA not loaded');
  }

  try {
    const token = await window.grecaptcha.execute(siteKey, { action });
    return token;
  } catch (error) {
    console.error('reCAPTCHA execution failed:', error);
    throw error;
  }
};

/**
 * Verify reCAPTCHA token on the server
 */
export const verifyReCaptchaToken = async (
  token: string,
  secretKey: string,
  expectedAction: string = 'submit_waitlist',
  minScore: number = 0.5
): Promise<{ valid: boolean; score?: number; error?: string }> => {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      { method: 'POST' }
    );
    
    const data: ReCaptchaResponse = await response.json();
    
    if (!data.success) {
      return { 
        valid: false, 
        error: data['error-codes']?.join(', ') || 'Verification failed' 
      };
    }
    
    // Check action
    if (data.action !== expectedAction) {
      return { 
        valid: false, 
        score: data.score,
        error: `Action mismatch: expected ${expectedAction}, got ${data.action}` 
      };
    }
    
    // Check score
    if (data.score < minScore) {
      return { 
        valid: false, 
        score: data.score,
        error: `Score too low: ${data.score}` 
      };
    }
    
    return { valid: true, score: data.score };
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return { valid: false, error: 'Verification request failed' };
  }
};

// Add type definition for window object
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
} 