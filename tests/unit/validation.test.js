import { 
  validateEmail, 
  validateRequired, 
  validateField,
  validateFormData
} from '../../src/utils/validation';

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
      const field = { name: 'name', required: true };
      
      expect(validateField('John', field)).toBe(true);
      expect(validateField('', field)).toBe(false);
      expect(validateField(null, field)).toBe(false);
    });
    
    test('should validate email fields', () => {
      const field = { name: 'email', type: 'email', required: true };
      
      expect(validateField('test@example.com', field)).toBe(true);
      expect(validateField('invalid', field)).toBe(false);
    });
    
    test('should validate optional fields', () => {
      const field = { name: 'name', required: false };
      
      expect(validateField('John', field)).toBe(true);
      expect(validateField('', field)).toBe(true);
      expect(validateField(null, field)).toBe(true);
    });
    
    test('should validate optional email fields', () => {
      const field = { name: 'email', type: 'email', required: false };
      
      expect(validateField('test@example.com', field)).toBe(true);
      expect(validateField('', field)).toBe(true);
      expect(validateField('invalid', field)).toBe(false);
    });
  });
  
  describe('validateFormData', () => {
    const fields = [
      { name: 'email', type: 'email', required: true },
      { name: 'name', type: 'text', required: true },
      { name: 'company', type: 'text', required: false }
    ];
    
    test('should validate valid form data', () => {
      const formData = {
        email: 'test@example.com',
        name: 'John Doe',
        company: 'Acme Inc'
      };
      
      const result = validateFormData(formData, fields);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    test('should validate valid form data with optional fields missing', () => {
      const formData = {
        email: 'test@example.com',
        name: 'John Doe'
      };
      
      const result = validateFormData(formData, fields);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    test('should invalidate form data with required fields missing', () => {
      const formData = {
        email: 'test@example.com'
      };
      
      const result = validateFormData(formData, fields);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('name');
    });
    
    test('should invalidate form data with invalid email', () => {
      const formData = {
        email: 'invalid',
        name: 'John Doe'
      };
      
      const result = validateFormData(formData, fields);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('email');
    });
    
    test('should return multiple errors', () => {
      const formData = {
        email: 'invalid'
      };
      
      const result = validateFormData(formData, fields);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('email');
      expect(result.errors).toHaveProperty('name');
    });
    
    test('should handle empty form data', () => {
      const formData = {};
      
      const result = validateFormData(formData, fields);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('email');
      expect(result.errors).toHaveProperty('name');
    });
    
    test('should handle empty fields array', () => {
      const formData = {
        email: 'test@example.com',
        name: 'John Doe'
      };
      
      const result = validateFormData(formData, []);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
}); 