import { Field } from './types';

/**
 * Validate an email address
 */
export const validateEmail = (email: string): boolean => {
  if (email === null || email === undefined) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate that a value is not empty
 */
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  return true;
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
 * Validate form data against a set of field definitions
 */
export const validateForm = (
  values: Record<string, string | boolean>,
  fields: Field[]
): Record<string, { valid: boolean; message?: string }> => {
  const validationResults: Record<string, { valid: boolean; message?: string }> = {};

  fields.forEach((field) => {
    validationResults[field.name] = validateField(field, values[field.name]);
  });

  return validationResults;
};

/**
 * Check if all form fields are valid
 */
export const isFormValid = (
  validationResults: Record<string, { valid: boolean; message?: string }>
): boolean => {
  return Object.values(validationResults).every((result) => result.valid);
}; 