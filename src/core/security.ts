import { SecurityConfig } from './types';

/**
 * Generate a random honeypot field name
 */
export const generateHoneypotFieldName = (): string => {
  const prefix = 'hp_';
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${prefix}${randomString}`;
};

/**
 * Get CSS styles for honeypot field
 */
export const getHoneypotStyles = (): React.CSSProperties => {
  return {
    position: 'absolute',
    left: '-9999px',
    top: '-9999px',
    opacity: 0,
    height: 0,
    width: 0,
    zIndex: -1,
    overflow: 'hidden',
    pointerEvents: 'none',
  };
};

/**
 * Check if the submission time is suspicious (too fast)
 */
export const isSuspiciousSubmissionTime = (
  startTime: number,
  minTimeInMs = 1500
): boolean => {
  const submissionTime = Date.now();
  const timeElapsed = submissionTime - startTime;
  return timeElapsed < minTimeInMs;
};

/**
 * Check if the submission is likely from a bot
 */
export const isLikelyBot = (
  honeypotValue: string | undefined,
  startTime: number,
  minTimeInMs = 1500
): { isBot: boolean; reason?: string } => {
  // Check honeypot
  if (honeypotValue && honeypotValue.length > 0) {
    return { isBot: true, reason: 'honeypot_filled' };
  }

  // Check submission time
  if (isSuspiciousSubmissionTime(startTime, minTimeInMs)) {
    return { isBot: true, reason: 'too_fast' };
  }

  return { isBot: false };
};

/**
 * Check if reCAPTCHA is enabled in the security config
 */
export const isReCaptchaEnabled = (security?: SecurityConfig): boolean => {
  return Boolean(security?.enableReCaptcha && security?.reCaptchaSiteKey);
}; 