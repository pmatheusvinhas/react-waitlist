import { 
  generateHoneypotFieldName, 
  getHoneypotStyles,
  isSuspiciousSubmissionTime,
  isLikelyBot
} from '../../src/core/security';

describe('Security Utils', () => {
  describe('generateHoneypotFieldName', () => {
    test('should generate a honeypot field name with default prefix', () => {
      const fieldName = generateHoneypotFieldName();
      
      expect(fieldName).toContain('hp_');
      expect(fieldName.length).toBeGreaterThan(3);
    });
  });
  
  describe('getHoneypotStyles', () => {
    test('should return styles for hiding honeypot field', () => {
      const styles = getHoneypotStyles();
      
      expect(styles).toHaveProperty('position', 'absolute');
      expect(styles).toHaveProperty('opacity', 0);
      expect(styles).toHaveProperty('pointerEvents', 'none');
    });
  });
  
  describe('isSuspiciousSubmissionTime', () => {
    test('should validate submission after minimum time', () => {
      const startTime = Date.now() - 5000; // 5 seconds ago
      const minTime = 3000; // 3 seconds
      
      expect(isSuspiciousSubmissionTime(startTime, minTime)).toBe(false);
    });
    
    test('should invalidate submission before minimum time', () => {
      const startTime = Date.now() - 1000; // 1 second ago
      const minTime = 3000; // 3 seconds
      
      expect(isSuspiciousSubmissionTime(startTime, minTime)).toBe(true);
    });
    
    test('should validate with default minimum time', () => {
      const startTime = Date.now() - 3000; // 3 seconds ago
      
      expect(isSuspiciousSubmissionTime(startTime)).toBe(false);
    });
    
    test('should handle invalid start time', () => {
      expect(isSuspiciousSubmissionTime(null)).toBe(false);
      expect(isSuspiciousSubmissionTime(undefined)).toBe(false);
      expect(isSuspiciousSubmissionTime('invalid')).toBe(false);
    });
  });
  
  describe('isLikelyBot', () => {
    test('should detect bot with filled honeypot', () => {
      const result = isLikelyBot('bot input', Date.now() - 5000);
      
      expect(result.isBot).toBe(true);
      expect(result.reason).toBe('honeypot_filled');
    });
    
    test('should detect bot with suspicious submission time', () => {
      const result = isLikelyBot('', Date.now() - 500, 1500);
      
      expect(result.isBot).toBe(true);
      expect(result.reason).toBe('too_fast');
    });
    
    test('should not detect bot with valid submission', () => {
      const result = isLikelyBot('', Date.now() - 2000, 1500);
      
      expect(result.isBot).toBe(false);
      expect(result.reason).toBeUndefined();
    });
  });
}); 