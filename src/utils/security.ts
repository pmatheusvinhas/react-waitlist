import React from 'react';

/**
 * Generate a honeypot field name that looks legitimate but is hidden from users
 */
export const generateHoneypotFieldName = (): string => {
  const names = [
    'fullName',
    'phoneNumber',
    'address',
    'website',
    'company',
    'position',
  ];
  const randomIndex = Math.floor(Math.random() * names.length);
  return `${names[randomIndex]}_hp_${Date.now().toString(36)}`;
};

/**
 * Check if a form submission is likely from a bot based on timing
 * Most bots fill forms instantly, while humans take at least a few seconds
 */
export const isSuspiciousSubmissionTime = (
  startTime: number,
  minTimeInMs = 1500
): boolean => {
  const submissionTime = Date.now() - startTime;
  return submissionTime < minTimeInMs;
};

/**
 * Create a hidden honeypot field style
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
    pointerEvents: 'none',
    overflow: 'hidden',
  };
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