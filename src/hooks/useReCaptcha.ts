import { useState, useEffect, useCallback } from 'react';
import { loadReCaptchaScript, executeReCaptcha } from '../utils/recaptcha';

interface UseReCaptchaOptions {
  siteKey: string;
  action?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface UseReCaptchaReturn {
  loaded: boolean;
  loading: boolean;
  error: Error | null;
  executeReCaptcha: (action?: string) => Promise<string>;
}

/**
 * Hook to manage reCAPTCHA integration
 */
export const useReCaptcha = ({
  siteKey,
  action = 'submit_waitlist',
  onLoad,
  onError,
}: UseReCaptchaOptions): UseReCaptchaReturn => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load reCAPTCHA script
  useEffect(() => {
    if (!siteKey) {
      setError(new Error('reCAPTCHA site key is required'));
      setLoading(false);
      return;
    }

    const loadScript = async () => {
      try {
        await loadReCaptchaScript(siteKey);
        setLoaded(true);
        setLoading(false);
        if (onLoad) onLoad();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load reCAPTCHA');
        setError(error);
        setLoading(false);
        if (onError) onError(error);
      }
    };

    loadScript();
  }, [siteKey, onLoad, onError]);

  // Execute reCAPTCHA
  const execute = useCallback(
    async (customAction?: string) => {
      if (!loaded) {
        throw new Error('reCAPTCHA not loaded yet');
      }

      try {
        return await executeReCaptcha(siteKey, customAction || action);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to execute reCAPTCHA');
        if (onError) onError(error);
        throw error;
      }
    },
    [loaded, siteKey, action, onError]
  );

  return {
    loaded,
    loading,
    error,
    executeReCaptcha: execute,
  };
}; 