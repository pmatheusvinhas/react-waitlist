import { useState, useEffect, useCallback } from 'react';
import { loadReCaptchaScript, executeReCaptcha, verifyReCaptchaToken } from '../core/recaptcha';

interface UseReCaptchaOptions {
  siteKey: string;
  proxyEndpoint?: string;
  secretKey?: string;
  action?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  debug?: boolean;
}

interface UseReCaptchaReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  executeReCaptcha: (action?: string) => Promise<string>;
  verifyToken: (token: string, action?: string) => Promise<{
    valid: boolean;
    score?: number;
    error?: string;
  }>;
}

/**
 * Hook to manage reCAPTCHA integration
 */
export const useReCaptcha = ({
  siteKey,
  proxyEndpoint,
  secretKey,
  action = 'submit_waitlist',
  onLoad,
  onError,
  debug = false,
}: UseReCaptchaOptions): UseReCaptchaReturn => {
  // Check if grecaptcha is already available
  const initialLoaded = typeof window !== 'undefined' && 
                       window.grecaptcha !== undefined;
  
  const [isLoaded, setIsLoaded] = useState(initialLoaded);
  const [isLoading, setIsLoading] = useState(!initialLoaded);
  const [error, setError] = useState<Error | null>(null);

  // Log function that respects debug flag
  const log = useCallback((message: string, ...args: any[]) => {
    if (debug) {
      console.info(`reCAPTCHA Hook: ${message}`, ...args);
    }
  }, [debug]);

  // Warning for secret key usage in client-side code
  useEffect(() => {
    if (typeof window !== 'undefined' && secretKey) {
      console.warn('reCAPTCHA Hook: Using secretKey in client-side code is not recommended for security reasons');
    }
  }, [secretKey]);

  // Load reCAPTCHA script
  useEffect(() => {
    if (!siteKey) {
      const error = new Error('reCAPTCHA site key is required');
      setError(error);
      setIsLoading(false);
      if (onError) onError(error);
      return;
    }

    log(`Initializing with site key ${siteKey.substring(0, 5)}...`);

    // If grecaptcha is already available, no need to load the script
    if (initialLoaded) {
      log('grecaptcha already available in window');
      
      // Still need to check if it's ready
      if (window.grecaptcha && window.grecaptcha.ready) {
        try {
          window.grecaptcha.ready(() => {
            log('grecaptcha is ready');
            setIsLoaded(true);
            setIsLoading(false);
            if (onLoad) onLoad();
          });
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          log(`Error in grecaptcha.ready: ${errorMsg}`);
          const error = new Error(`Failed to initialize reCAPTCHA: ${errorMsg}`);
          setError(error);
          setIsLoading(false);
          if (onError) onError(error);
        }
      } else {
        log('grecaptcha available but ready method not found');
        setIsLoaded(true);
        setIsLoading(false);
        if (onLoad) onLoad();
      }
      return;
    }

    const loadScript = async () => {
      log('Loading reCAPTCHA script');
      try {
        await loadReCaptchaScript(siteKey);
        log('Script loaded successfully');
        setIsLoaded(true);
        setIsLoading(false);
        if (onLoad) onLoad();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        log(`Script loading failed: ${errorMsg}`);
        const error = err instanceof Error ? err : new Error(`Failed to load reCAPTCHA: ${errorMsg}`);
        setError(error);
        setIsLoading(false);
        if (onError) onError(error);
      }
    };

    try {
      // Handle the case where grecaptcha.ready throws an error
      if (window.grecaptcha && window.grecaptcha.ready) {
        log('grecaptcha found in window, checking if ready');
        try {
          window.grecaptcha.ready(() => {
            log('grecaptcha is ready after check');
            setIsLoaded(true);
            setIsLoading(false);
            if (onLoad) onLoad();
          });
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          log(`Error in grecaptcha.ready check: ${errorMsg}`);
          const error = new Error(`Failed to initialize reCAPTCHA: ${errorMsg}`);
          setError(error);
          setIsLoading(false);
          if (onError) onError(error);
        }
      } else {
        log('grecaptcha not found or ready method not available, loading script');
        loadScript();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      log(`Unexpected error during initialization: ${errorMsg}`);
      const error = new Error(`Failed to initialize reCAPTCHA: ${errorMsg}`);
      setError(error);
      setIsLoading(false);
      if (onError) onError(error);
    }
  }, [siteKey, onLoad, onError, initialLoaded, log]);

  // Execute reCAPTCHA
  const execute = useCallback(
    async (customAction?: string) => {
      const actionToUse = customAction || action;
      log(`Executing reCAPTCHA for action "${actionToUse}"`);
      
      if (!isLoaded) {
        const errorMsg = 'reCAPTCHA not loaded yet';
        log(errorMsg);
        throw new Error(errorMsg);
      }

      try {
        const token = await executeReCaptcha(siteKey, actionToUse);
        
        if (!token) {
          const errorMsg = 'Received null or empty token from reCAPTCHA';
          log(errorMsg);
          throw new Error(errorMsg);
        }
        
        log(`Token received successfully (length: ${token.length})`);
        return token;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        log(`Execution failed: ${errorMsg}`);
        const error = err instanceof Error ? err : new Error(`Failed to execute reCAPTCHA: ${errorMsg}`);
        if (onError) onError(error);
        throw error;
      }
    },
    [isLoaded, siteKey, action, onError, log]
  );

  // Verify reCAPTCHA token
  const verifyToken = useCallback(
    async (token: string, customAction?: string) => {
      const actionToUse = customAction || action;
      log(`Verifying token for action "${actionToUse}" (token length: ${token.length})`);
      
      if (!token) {
        const errorMsg = 'Cannot verify null or empty token';
        log(errorMsg);
        return { valid: false, error: errorMsg };
      }

      try {
        // If we have a proxy endpoint, use it (preferred for client-side)
        if (proxyEndpoint) {
          log(`Using proxy endpoint for verification: ${proxyEndpoint}`);
          
          const response = await fetch(proxyEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              token,
              action: actionToUse
            }),
          });

          const data = await response.json();
          log('Proxy verification response:', data);
          
          if (!data.success) {
            const errorMsg = data['error-codes']?.join(', ') || data.error || 'Verification failed';
            log(`Verification failed: ${errorMsg}`);
            return { valid: false, error: errorMsg };
          }
          
          log(`Verification successful, score: ${data.score}`);
          return { valid: true, score: data.score };
        }
        
        // If we have a secretKey, use direct verification
        if (secretKey) {
          log('Using direct verification with secret key');
          
          // Use verifyReCaptchaToken from core/recaptcha
          const result = await verifyReCaptchaToken(
            token,
            secretKey,
            undefined, // No proxy endpoint in this case
            actionToUse,
            0.5 // Default minimum score
          );
          
          log('Direct verification result:', result);
          return result;
        }
        
        // No verification method available
        const errorMsg = 'No verification method available (provide proxyEndpoint or secretKey)';
        log(errorMsg);
        return { valid: false, error: errorMsg };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        log(`Verification error: ${errorMsg}`);
        const error = err instanceof Error ? err : new Error(`Failed to verify token: ${errorMsg}`);
        if (onError) onError(error);
        return { valid: false, error: errorMsg };
      }
    },
    [proxyEndpoint, secretKey, action, onError, log]
  );

  return {
    isLoaded,
    isLoading,
    error,
    executeReCaptcha: execute,
    verifyToken,
  };
}; 