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
 * Create a honeypot field for bot detection
 */
export const createHoneypotField = (prefix = 'hp_'): { name: string; type: string; style: React.CSSProperties } => {
  const fieldName = `${prefix}${Date.now().toString(36)}`;
  return {
    name: fieldName,
    type: 'text',
    style: {
      display: 'none',
    }
  };
};

/**
 * Validate that the honeypot field is empty (indicating a human user)
 */
export const validateHoneypot = (formData: Record<string, any>, honeypotField: { name: string }): boolean => {
  if (!formData || !honeypotField) return true;
  
  const value = formData[honeypotField.name];
  return !value || value === '';
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
 * Validate that the submission time is reasonable (not too fast)
 */
export const validateSubmissionTime = (
  startTime: number | null | undefined,
  minTimeInMs = 1500
): boolean => {
  if (!startTime || typeof startTime !== 'number') return false;
  
  const submissionTime = Date.now() - startTime;
  return submissionTime >= minTimeInMs;
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

/**
 * Sanitize form data by removing honeypot fields and trimming string values
 */
export const sanitizeFormData = (formData: Record<string, any> | null | undefined): Record<string, any> => {
  if (!formData) return {};
  
  const sanitized: Record<string, any> = {};
  
  for (const key in formData) {
    // Skip honeypot fields
    if (key.includes('hp_') || key.includes('_hp_')) continue;
    
    // Trim string values
    const value = formData[key];
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}; 