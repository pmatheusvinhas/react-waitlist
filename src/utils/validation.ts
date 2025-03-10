import { Field } from '../types';

/**
 * Validate an email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a field value based on its type and requirements
 */
export const validateField = (
  field: Field,
  value: string | boolean | undefined
): { valid: boolean; message?: string } => {
  // Check if required field is empty
  if (field.required && (value === undefined || value === '')) {
    return {
      valid: false,
      message: `${field.label} is required`,
    };
  }

  // Skip validation if field is empty and not required
  if (!field.required && (value === undefined || value === '')) {
    return { valid: true };
  }

  // Validate based on field type
  switch (field.type) {
    case 'email':
      if (typeof value === 'string' && !validateEmail(value)) {
        return {
          valid: false,
          message: 'Please enter a valid email address',
        };
      }
      break;
    case 'checkbox':
      if (field.required && value !== true) {
        return {
          valid: false,
          message: `${field.label} is required`,
        };
      }
      break;
  }

  return { valid: true };
};

/**
 * Validate all form fields
 */
export const validateForm = (
  fields: Field[],
  values: Record<string, string | boolean>
): Record<string, { valid: boolean; message?: string }> => {
  const result: Record<string, { valid: boolean; message?: string }> = {};

  fields.forEach((field) => {
    result[field.name] = validateField(field, values[field.name]);
  });

  return result;
};

/**
 * Check if the form is valid
 */
export const isFormValid = (
  validationResults: Record<string, { valid: boolean; message?: string }>
): boolean => {
  return Object.values(validationResults).every((result) => result.valid);
}; 