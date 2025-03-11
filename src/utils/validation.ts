import { Field } from '../types';

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
 * This is the version expected by the tests (returns boolean)
 */
export const validateField = (
  value: any,
  field: Field
): boolean => {
  // Check if required field is empty
  if (field.required && !validateRequired(value)) {
    return false;
  }

  // Skip validation if field is empty and not required
  if (!field.required && !validateRequired(value)) {
    return true;
  }

  // Validate based on field type
  switch (field.type) {
    case 'email':
      if (typeof value === 'string' && !validateEmail(value)) {
        return false;
      }
      break;
    case 'checkbox':
      if (field.required && value !== true) {
        return false;
      }
      break;
  }

  return true;
};

/**
 * Original validateField function that returns an object with valid and message
 */
export const validateFieldWithMessage = (
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
export const validateFormData = (
  formData: Record<string, any>,
  fields: Field[]
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // If no fields to validate, return valid
  if (!fields || fields.length === 0) {
    return { isValid: true, errors: {} };
  }
  
  // If no form data, mark all required fields as invalid
  if (!formData) {
    fields.forEach(field => {
      if (field.required) {
        errors[field.name] = `${field.label || field.name} is required`;
      }
    });
    return { isValid: Object.keys(errors).length === 0, errors };
  }
  
  // Validate each field
  fields.forEach(field => {
    const value = formData[field.name];
    
    // Check if required field is empty
    if (field.required && !validateRequired(value)) {
      errors[field.name] = `${field.label || field.name} is required`;
      return;
    }
    
    // Skip validation if field is empty and not required
    if (!field.required && !validateRequired(value)) {
      return;
    }
    
    // Validate based on field type
    if (field.type === 'email' && typeof value === 'string' && !validateEmail(value)) {
      errors[field.name] = 'Please enter a valid email address';
    }
  });
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate form fields
 */
export const validateForm = (
  fields: Field[],
  values: Record<string, string | boolean>
): Record<string, { valid: boolean; message?: string }> => {
  const validationResults: Record<string, { valid: boolean; message?: string }> = {};

  fields.forEach((field) => {
    validationResults[field.name] = validateFieldWithMessage(field, values[field.name]);
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