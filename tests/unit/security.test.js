import { 
  createHoneypotField, 
  validateHoneypot,
  validateSubmissionTime,
  sanitizeFormData
} from '../../src/utils/security';

describe('Security Utils', () => {
  describe('createHoneypotField', () => {
    test('should create a honeypot field with default name', () => {
      const honeypot = createHoneypotField();
      
      expect(honeypot).toHaveProperty('name');
      expect(honeypot.name).toContain('hp_');
      expect(honeypot.name.length).toBeGreaterThan(3);
      expect(honeypot).toHaveProperty('type', 'text');
      expect(honeypot).toHaveProperty('style');
      expect(honeypot.style).toHaveProperty('display', 'none');
    });
    
    test('should create a honeypot field with custom prefix', () => {
      const honeypot = createHoneypotField('custom_');
      
      expect(honeypot.name).toContain('custom_');
      expect(honeypot.name.length).toBeGreaterThan(7);
    });
  });
  
  describe('validateHoneypot', () => {
    test('should validate empty honeypot field', () => {
      const formData = {
        email: 'test@example.com',
        hp_123: ''
      };
      
      const honeypotField = { name: 'hp_123' };
      
      expect(validateHoneypot(formData, honeypotField)).toBe(true);
    });
    
    test('should invalidate filled honeypot field', () => {
      const formData = {
        email: 'test@example.com',
        hp_123: 'bot input'
      };
      
      const honeypotField = { name: 'hp_123' };
      
      expect(validateHoneypot(formData, honeypotField)).toBe(false);
    });
    
    test('should validate when honeypot field is missing', () => {
      const formData = {
        email: 'test@example.com'
      };
      
      const honeypotField = { name: 'hp_123' };
      
      expect(validateHoneypot(formData, honeypotField)).toBe(true);
    });
    
    test('should validate when honeypot field is null', () => {
      const formData = {
        email: 'test@example.com',
        hp_123: null
      };
      
      const honeypotField = { name: 'hp_123' };
      
      expect(validateHoneypot(formData, honeypotField)).toBe(true);
    });
  });
  
  describe('validateSubmissionTime', () => {
    test('should validate submission after minimum time', () => {
      const startTime = Date.now() - 5000; // 5 seconds ago
      const minTime = 3000; // 3 seconds
      
      expect(validateSubmissionTime(startTime, minTime)).toBe(true);
    });
    
    test('should invalidate submission before minimum time', () => {
      const startTime = Date.now() - 1000; // 1 second ago
      const minTime = 3000; // 3 seconds
      
      expect(validateSubmissionTime(startTime, minTime)).toBe(false);
    });
    
    test('should validate with default minimum time', () => {
      const startTime = Date.now() - 3000; // 3 seconds ago
      
      expect(validateSubmissionTime(startTime)).toBe(true);
    });
    
    test('should handle invalid start time', () => {
      expect(validateSubmissionTime(null)).toBe(false);
      expect(validateSubmissionTime(undefined)).toBe(false);
      expect(validateSubmissionTime('invalid')).toBe(false);
    });
  });
  
  describe('sanitizeFormData', () => {
    test('should remove honeypot fields', () => {
      const formData = {
        email: 'test@example.com',
        name: 'John Doe',
        hp_123: '',
        _hp_456: 'bot input'
      };
      
      const sanitized = sanitizeFormData(formData);
      
      expect(sanitized).toHaveProperty('email');
      expect(sanitized).toHaveProperty('name');
      expect(sanitized).not.toHaveProperty('hp_123');
      expect(sanitized).not.toHaveProperty('_hp_456');
    });
    
    test('should trim string values', () => {
      const formData = {
        email: ' test@example.com ',
        name: ' John Doe '
      };
      
      const sanitized = sanitizeFormData(formData);
      
      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.name).toBe('John Doe');
    });
    
    test('should handle non-string values', () => {
      const formData = {
        email: 'test@example.com',
        age: 30,
        isSubscribed: true,
        preferences: { theme: 'dark' }
      };
      
      const sanitized = sanitizeFormData(formData);
      
      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.age).toBe(30);
      expect(sanitized.isSubscribed).toBe(true);
      expect(sanitized.preferences).toEqual({ theme: 'dark' });
    });
    
    test('should handle empty object', () => {
      const sanitized = sanitizeFormData({});
      
      expect(sanitized).toEqual({});
    });
    
    test('should handle null or undefined', () => {
      expect(sanitizeFormData(null)).toEqual({});
      expect(sanitizeFormData(undefined)).toEqual({});
    });
  });
}); 