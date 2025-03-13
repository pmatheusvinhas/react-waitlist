import { 
  validateEmail, 
  validateRequired, 
  validateField,
  validateForm,
  isFormValid
} from '../../src/core/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('test.name@example.co.uk')).toBe(true);
      expect(validateEmail('test+label@example.com')).toBe(true);
      expect(validateEmail('test@subdomain.example.com')).toBe(true);
    });
    
    test('should invalidate incorrect email formats', () => {
      expect(validateEmail('test')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('test@example.')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });
  
  describe('validateRequired', () => {
    test('should validate non-empty values', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired(0)).toBe(true);
      expect(validateRequired(false)).toBe(true);
      expect(validateRequired([])).toBe(true);
      expect(validateRequired({})).toBe(true);
    });
    
    test('should invalidate empty values', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });
  
  describe('validateField', () => {
    test('should validate required fields', () => {
      const field = { name: 'name', label: 'Name', type: 'text', required: true };
      
      expect(validateField(field, 'John').valid).toBe(true);
      expect(validateField(field, '').valid).toBe(false);
      expect(validateField(field, null).valid).toBe(true);
    });
    
    test('should validate email fields', () => {
      const field = { name: 'email', label: 'Email', type: 'email', required: true };
      
      expect(validateField(field, 'test@example.com').valid).toBe(true);
      expect(validateField(field, 'invalid').valid).toBe(false);
    });
    
    test('should validate optional fields', () => {
      const field = { name: 'name', label: 'Name', type: 'text', required: false };
      
      expect(validateField(field, 'John').valid).toBe(true);
      expect(validateField(field, '').valid).toBe(true);
      expect(validateField(field, null).valid).toBe(true);
    });
    
    test('should validate optional email fields', () => {
      const field = { name: 'email', label: 'Email', type: 'email', required: false };
      
      expect(validateField(field, 'test@example.com').valid).toBe(true);
      expect(validateField(field, '').valid).toBe(true);
      expect(validateField(field, 'invalid').valid).toBe(false);
    });
  });
  
  describe('validateForm', () => {
    const fields = [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text', required: false }
    ];
    
    test('should validate valid form data', () => {
      const formData = {
        email: 'test@example.com',
        name: 'John Doe',
        company: 'Acme Inc'
      };
      
      const validationResults = validateForm(formData, fields);
      expect(isFormValid(validationResults)).toBe(true);
    });
    
    test('should validate valid form data with optional fields missing', () => {
      const formData = {
        email: 'test@example.com',
        name: 'John Doe'
      };
      
      const validationResults = validateForm(formData, fields);
      expect(isFormValid(validationResults)).toBe(true);
    });
    
    test('should invalidate form data with required fields missing', () => {
      const formData = {
        email: 'test@example.com'
      };
      
      const validationResults = validateForm(formData, fields);
      expect(isFormValid(validationResults)).toBe(false);
      expect(validationResults.name.valid).toBe(false);
    });
    
    test('should invalidate form data with invalid email', () => {
      const formData = {
        email: 'invalid',
        name: 'John Doe'
      };
      
      const validationResults = validateForm(formData, fields);
      expect(isFormValid(validationResults)).toBe(false);
      expect(validationResults.email.valid).toBe(false);
    });
    
    test('should return multiple errors', () => {
      const formData = {
        email: 'invalid'
      };
      
      const validationResults = validateForm(formData, fields);
      expect(isFormValid(validationResults)).toBe(false);
      expect(validationResults.email.valid).toBe(false);
      expect(validationResults.name.valid).toBe(false);
    });
    
    test('should handle empty form data', () => {
      const formData = {};
      
      const validationResults = validateForm(formData, fields);
      expect(isFormValid(validationResults)).toBe(false);
      expect(validationResults.email.valid).toBe(false);
      expect(validationResults.name.valid).toBe(false);
    });
    
    test('should handle empty fields array', () => {
      const formData = {
        email: 'test@example.com',
        name: 'John Doe'
      };
      
      const validationResults = validateForm(formData, []);
      expect(isFormValid(validationResults)).toBe(true);
    });
  });
}); 