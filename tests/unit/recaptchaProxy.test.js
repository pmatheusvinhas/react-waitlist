import { createRecaptchaProxy } from '../../src/server/recaptchaProxy';

// Mock do axios
jest.mock('axios', () => ({
  post: jest.fn()
}));

// Mock do console para evitar logs durante os testes
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

describe('reCAPTCHA Proxy', () => {
  let req, res;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      body: {
        token: 'test-token'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mock axios response
    const axios = require('axios');
    axios.post.mockResolvedValue({
      data: {
        success: true,
        score: 0.9,
        action: 'submit_waitlist',
        challenge_ts: '2025-03-10T12:00:00Z',
        hostname: 'localhost'
      }
    });
  });
  
  test('should verify token successfully', async () => {
    const proxyHandler = createRecaptchaProxy({
      secretKey: 'test-secret-key'
    });
    
    await proxyHandler(req, res);
    
    // Check if axios was called with correct params
    const axios = require('axios');
    expect(axios.post).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: 'test-secret-key',
          response: 'test-token'
        }
      }
    );
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      score: 0.9,
      action: 'submit_waitlist',
      challenge_ts: '2025-03-10T12:00:00Z',
      hostname: 'localhost'
    });
  });
  
  test('should reject if token is missing', async () => {
    const proxyHandler = createRecaptchaProxy({
      secretKey: 'test-secret-key'
    });
    
    req.body = {}; // No token
    
    await proxyHandler(req, res);
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Token is required'
    });
  });
  
  test('should reject if score is too low', async () => {
    const proxyHandler = createRecaptchaProxy({
      secretKey: 'test-secret-key',
      minScore: 0.7
    });
    
    // Mock low score response
    const axios = require('axios');
    axios.post.mockResolvedValue({
      data: {
        success: true,
        score: 0.3,
        action: 'submit_waitlist'
      }
    });
    
    await proxyHandler(req, res);
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'reCAPTCHA score too low'
    });
  });
  
  test('should reject if action is not allowed', async () => {
    const proxyHandler = createRecaptchaProxy({
      secretKey: 'test-secret-key',
      allowedActions: ['login', 'register']
    });
    
    // Mock response with different action
    const axios = require('axios');
    axios.post.mockResolvedValue({
      data: {
        success: true,
        score: 0.9,
        action: 'submit_waitlist'
      }
    });
    
    await proxyHandler(req, res);
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Action not allowed'
    });
  });
  
  test('should handle reCAPTCHA verification failure', async () => {
    const proxyHandler = createRecaptchaProxy({
      secretKey: 'test-secret-key'
    });
    
    // Mock verification failure
    const axios = require('axios');
    axios.post.mockResolvedValue({
      data: {
        success: false,
        'error-codes': ['invalid-input-response']
      }
    });
    
    await proxyHandler(req, res);
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      'error-codes': ['invalid-input-response']
    });
  });
  
  test('should handle network errors', async () => {
    const proxyHandler = createRecaptchaProxy({
      secretKey: 'test-secret-key'
    });
    
    // Mock network error
    const axios = require('axios');
    axios.post.mockRejectedValue(new Error('Network error'));
    
    await proxyHandler(req, res);
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Failed to verify reCAPTCHA token'
    });
  });
  
  test('should use default minScore if not provided', async () => {
    const proxyHandler = createRecaptchaProxy({
      secretKey: 'test-secret-key'
    });
    
    // Mock score at default threshold
    const axios = require('axios');
    axios.post.mockResolvedValue({
      data: {
        success: true,
        score: 0.5,
        action: 'submit_waitlist'
      }
    });
    
    await proxyHandler(req, res);
    
    // Check response (should pass with default minScore of 0.5)
    expect(res.status).toHaveBeenCalledWith(200);
  });
}); 