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

// Store widget IDs for multiple reCAPTCHA instances
let widgetId: number | null = null;

/**
 * Check if code is running in a browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/**
 * Load the reCAPTCHA script dynamically
 */
export const loadReCaptchaScript = (siteKey: string): Promise<void> => {
  // Return a resolved promise in SSR environment
  if (!isBrowser()) {
    console.info('reCAPTCHA: Running in SSR environment, skipping script loading');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      // Check if script is already loaded
      if (document.querySelector(`script[src*="recaptcha"]`)) {
        console.info('reCAPTCHA: Script already loaded');
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            console.info('reCAPTCHA: API ready');
            resolve();
          });
        } else {
          console.info('reCAPTCHA: Script loaded but API not ready yet, waiting...');
          // Wait for grecaptcha to be available
          const checkInterval = setInterval(() => {
            if (window.grecaptcha && window.grecaptcha.ready) {
              clearInterval(checkInterval);
              console.info('reCAPTCHA: API now ready');
              window.grecaptcha.ready(() => {
                resolve();
              });
            }
          }, 100);
          
          // Set a timeout to prevent infinite waiting
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!window.grecaptcha) {
              console.error('reCAPTCHA: Timed out waiting for API');
              reject(new Error('reCAPTCHA API not available after timeout'));
            } else {
              resolve();
            }
          }, 5000);
        }
        return;
      }

      // Create script element
      console.info(`reCAPTCHA: Loading script for site key ${siteKey.substring(0, 5)}...`);
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
      script.async = true;
      script.defer = true;

      // Set up callbacks
      script.onload = () => {
        console.info('reCAPTCHA: Script loaded successfully');
        if (window.grecaptcha) {
          // Check if we need to wait for ready
          if (window.grecaptcha.ready) {
            window.grecaptcha.ready(() => {
              console.info('reCAPTCHA: API ready after script load');
              resolve();
            });
          } else {
            console.info('reCAPTCHA: API available after script load');
            resolve();
          }
        } else {
          console.error('reCAPTCHA: Script loaded but grecaptcha not available');
          reject(new Error('reCAPTCHA not available after script load'));
        }
      };
      script.onerror = (error) => {
        console.error('reCAPTCHA: Failed to load script', error);
        reject(new Error('Failed to load reCAPTCHA script'));
      };

      // Add script to document
      document.head.appendChild(script);
    } catch (error) {
      console.error('reCAPTCHA: Error during script loading:', error);
      reject(error);
    }
  });
};

/**
 * Ensure reCAPTCHA is rendered with invisible badge
 */
const ensureReCaptchaRendered = (siteKey: string, action: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      // If already rendered, return the widget ID
      if (widgetId !== null && window.grecaptcha) {
        console.info('reCAPTCHA: Widget already rendered, using existing widget ID:', widgetId);
        resolve(widgetId);
        return;
      }

      // Check if grecaptcha is available
      if (!window.grecaptcha || !window.grecaptcha.render) {
        console.error('reCAPTCHA: grecaptcha.render not available');
        reject(new Error('reCAPTCHA API not properly initialized'));
        return;
      }

      // Create a container for the invisible reCAPTCHA
      let container = document.getElementById('g-recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'g-recaptcha-container';
        container.style.display = 'none';
        document.body.appendChild(container);
      }

      // Define the callback function that will be called when reCAPTCHA is completed
      const callbackName = `recaptchaCallback_${Date.now()}`;
      (window as any)[callbackName] = (token: string) => {
        console.info(`reCAPTCHA: Callback executed with token length: ${token ? token.length : 0}`);
        // Store the token in a global variable to retrieve it later
        (window as any).recaptchaToken = token;
      };

      // Render the reCAPTCHA widget
      console.info(`reCAPTCHA: Rendering widget with site key ${siteKey.substring(0, 5)}...`);
      widgetId = window.grecaptcha.render(container, {
        'sitekey': siteKey,
        'callback': callbackName,
        'size': 'invisible',
        'badge': 'bottomright',
        'action': action
      });

      console.info('reCAPTCHA: Widget rendered with ID:', widgetId);
      resolve(widgetId);
    } catch (error) {
      console.error('reCAPTCHA: Error rendering widget:', error);
      reject(new Error(`Failed to render reCAPTCHA: ${error instanceof Error ? error.message : String(error)}`));
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
  // Return a dummy token in SSR environment
  if (!isBrowser()) {
    console.info('reCAPTCHA: Running in SSR environment, returning dummy token');
    return 'ssr-dummy-token';
  }

  try {
    // Make sure the script is loaded
    if (!window.grecaptcha) {
      console.info('reCAPTCHA: Loading script before execution');
      await loadReCaptchaScript(siteKey);
    }

    // Ensure the widget is rendered
    const widgetId = await ensureReCaptchaRendered(siteKey, action);

    // Clear any previous token
    (window as any).recaptchaToken = null;

    // Execute the reCAPTCHA challenge
    console.info(`reCAPTCHA: Executing for action "${action}" with widget ID ${widgetId}`);
    window.grecaptcha.execute(widgetId);

    // Wait for the token to be set by the callback
    const token = await new Promise<string>((resolve, reject) => {
      const checkToken = () => {
        const token = (window as any).recaptchaToken;
        if (token) {
          resolve(token);
        } else {
          // Check again after a short delay
          setTimeout(checkToken, 100);
        }
      };

      // Start checking for the token
      checkToken();

      // Set a timeout to prevent infinite waiting
      setTimeout(() => {
        if (!(window as any).recaptchaToken) {
          console.error('reCAPTCHA: Timed out waiting for token');
          reject(new Error('reCAPTCHA token not received after timeout'));
        }
      }, 10000); // 10 seconds timeout
    });

    // Check if token is null or undefined
    if (!token) {
      console.error('reCAPTCHA: Received null or undefined token');
      
      // Check if site key is valid (first few characters for security)
      console.error(`reCAPTCHA: Site key used: ${siteKey.substring(0, 5)}...`);
      
      // Check if grecaptcha is in expected state
      console.error('reCAPTCHA: grecaptcha state:', {
        defined: typeof window.grecaptcha !== 'undefined',
        hasExecute: typeof window.grecaptcha?.execute === 'function',
        hasReady: typeof window.grecaptcha?.ready === 'function',
        widgetId: widgetId
      });
      
      throw new Error('reCAPTCHA returned null token');
    }
    
    console.info(`reCAPTCHA: Token received (length: ${token.length})`);
    return token;
  } catch (error) {
    console.error('reCAPTCHA: Execution failed:', error);
    // Rethrow with more descriptive message
    throw new Error(`reCAPTCHA execution failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Verify reCAPTCHA token on the server or via proxy
 */
export const verifyReCaptchaToken = async (
  token: string,
  secretKey?: string,
  proxyEndpoint?: string,
  expectedAction: string = 'submit_waitlist',
  minScore: number = 0.5
): Promise<{ valid: boolean; score?: number; error?: string }> => {
  // Check if we're in a browser environment
  const isClientSide = isBrowser();
  
  // Warning for secret key usage in client-side code (but allow it)
  if (isClientSide && secretKey) {
    console.warn('reCAPTCHA: Using secretKey in client-side code is not recommended for security reasons');
  }

  // Skip verification in SSR environment without secretKey or proxyEndpoint
  if (!isClientSide && !secretKey) {
    console.info('reCAPTCHA: Running in SSR environment without secretKey, skipping verification');
    return { valid: true, score: 1.0 };
  }

  try {
    // If we have a proxy endpoint, use it (preferred for client-side)
    if (proxyEndpoint) {
      console.info(`reCAPTCHA: Verifying token via proxy endpoint (length: ${token.length})`);
      const response = await fetch(proxyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          action: expectedAction,
        }),
      });
      
      const data = await response.json();
      console.info('reCAPTCHA: Proxy verification response', data);
      
      if (!data.success) {
        console.error('reCAPTCHA: Proxy verification failed', data['error-codes'] || data.error);
        return { 
          valid: false, 
          error: data['error-codes']?.join(', ') || data.error || 'Verification failed' 
        };
      }
      
      return { valid: true, score: data.score };
    }
    
    // If we have a secretKey, verify directly (works in both client and server)
    if (secretKey) {
      console.info(`reCAPTCHA: Verifying token directly (length: ${token.length})`);
      
      // Use axios if available (server-side), otherwise fetch
      let data: ReCaptchaResponse;
      
      if (!isClientSide && typeof require !== 'undefined') {
        try {
          const axios = require('axios');
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
        } catch (error) {
          console.error('reCAPTCHA: Axios verification failed:', error);
          throw error;
        }
      } else {
        // Client-side or server-side without axios
        const params = new URLSearchParams();
        params.append('secret', secretKey);
        params.append('response', token);
        
        const response = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?${params.toString()}`,
          { method: 'POST' }
        );
        
        data = await response.json();
      }
      
      console.info('reCAPTCHA: Direct verification response', data);
      
      if (!data.success) {
        console.error('reCAPTCHA: Verification failed', data['error-codes']);
        return { 
          valid: false, 
          error: data['error-codes']?.join(', ') || 'Verification failed' 
        };
      }
      
      // Check action
      if (data.action !== expectedAction) {
        console.error(`reCAPTCHA: Action mismatch: expected ${expectedAction}, got ${data.action}`);
        return { 
          valid: false, 
          score: data.score,
          error: `Action mismatch: expected ${expectedAction}, got ${data.action}` 
        };
      }
      
      // Check score
      if (data.score < minScore) {
        console.error(`reCAPTCHA: Score too low: ${data.score} (minimum: ${minScore})`);
        return { 
          valid: false, 
          score: data.score,
          error: `Score too low: ${data.score}` 
        };
      }
      
      console.info(`reCAPTCHA: Verification successful, score: ${data.score}`);
      return { valid: true, score: data.score };
    }
    
    // If we don't have a secretKey or proxyEndpoint, we can't verify
    console.warn('reCAPTCHA: No secretKey or proxyEndpoint provided for verification');
    return { 
      valid: false, 
      error: 'reCAPTCHA configuration error: No verification method available (provide secretKey or proxyEndpoint)' 
    };
  } catch (error) {
    console.error('reCAPTCHA: Verification request failed:', error);
    return { valid: false, error: `Verification request failed: ${error instanceof Error ? error.message : String(error)}` };
  }
};

/**
 * Check if reCAPTCHA is enabled in security config
 */
export const isReCaptchaEnabled = (security?: SecurityConfig): boolean => {
  return !!security?.enableReCaptcha && !!security?.reCaptchaSiteKey;
};

// Add type definition for window object
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (widgetIdOrSiteKey: number | string, options?: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, parameters: {
        sitekey: string;
        callback?: string;
        size?: string;
        badge?: string;
        action?: string;
      }) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
  }
} 