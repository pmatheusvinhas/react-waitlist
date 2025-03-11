import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useReCaptcha } from '../../src/hooks/useReCaptcha';

// Mock global grecaptcha
const mockExecute = jest.fn().mockResolvedValue('test-token');
global.grecaptcha = {
  ready: jest.fn(callback => callback()),
  execute: mockExecute
};

describe('useReCaptcha', () => {
  const siteKey = 'test-site-key';
  const proxyEndpoint = '/api/recaptcha-proxy';
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock fetch for verification
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, score: 0.9 })
      })
    );
    
    // Reset document head
    document.head.innerHTML = '';
  });
  
  test('should load reCAPTCHA script', () => {
    renderHook(() => useReCaptcha({ siteKey }));
    
    // Check if script was added to head
    const script = document.querySelector('script[src*="recaptcha"]');
    expect(script).toBeTruthy();
    expect(script.src).toContain(siteKey);
  });
  
  test('should not load script twice', () => {
    // First render
    renderHook(() => useReCaptcha({ siteKey }));
    
    // Second render
    renderHook(() => useReCaptcha({ siteKey }));
    
    // Check if only one script was added
    const scripts = document.querySelectorAll('script[src*="recaptcha"]');
    expect(scripts.length).toBe(1);
  });
  
  test('should execute reCAPTCHA and return token', async () => {
    const { result } = renderHook(() => useReCaptcha({ siteKey }));
    
    // Initial state
    expect(result.current.isLoaded).toBe(true); // Because we mocked grecaptcha.ready
    expect(result.current.error).toBeNull();
    
    // Execute reCAPTCHA
    let token;
    await act(async () => {
      token = await result.current.executeReCaptcha('submit_waitlist');
    });
    
    // Check if grecaptcha.execute was called
    expect(mockExecute).toHaveBeenCalledWith(siteKey, { action: 'submit_waitlist' });
    expect(token).toBe('test-token');
  });
  
  test('should verify token with proxy endpoint', async () => {
    const { result } = renderHook(() => useReCaptcha({ siteKey, proxyEndpoint }));
    
    // Verify token
    let verificationResult;
    await act(async () => {
      verificationResult = await result.current.verifyToken('test-token');
    });
    
    // Check if fetch was called with correct params
    expect(global.fetch).toHaveBeenCalledWith(
      proxyEndpoint,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ token: 'test-token' })
      })
    );
    
    // Check result
    expect(verificationResult).toEqual({ success: true, score: 0.9 });
  });
  
  test('should handle verification failure', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ 
          success: false, 
          'error-codes': ['invalid-input-response'] 
        })
      })
    );
    
    const { result } = renderHook(() => useReCaptcha({ siteKey, proxyEndpoint }));
    
    // Verify token
    let verificationResult;
    await act(async () => {
      verificationResult = await result.current.verifyToken('test-token');
    });
    
    // Check result
    expect(verificationResult).toEqual({ 
      success: false, 
      'error-codes': ['invalid-input-response'] 
    });
  });
  
  test('should handle network errors during verification', async () => {
    // Mock fetch to throw error
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.reject(new Error('Network error'))
    );
    
    const { result } = renderHook(() => useReCaptcha({ siteKey, proxyEndpoint }));
    
    // Verify token
    let error;
    await act(async () => {
      try {
        await result.current.verifyToken('test-token');
      } catch (e) {
        error = e;
      }
    });
    
    // Check error
    expect(error).toBeDefined();
    expect(error.message).toBe('Network error');
  });
  
  test('should handle reCAPTCHA loading error', () => {
    // Mock grecaptcha to be undefined to simulate loading error
    const originalGrecaptcha = global.grecaptcha;
    global.grecaptcha = undefined;
    
    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Render the hook with a non-existent site key to force an error
    const { result } = renderHook(() => useReCaptcha({ 
      siteKey: 'invalid-key'
    }));
    
    // Restore mocks
    global.grecaptcha = originalGrecaptcha;
    console.error = originalConsoleError;
    
    // Check if the hook is not loaded
    expect(result.current.isLoaded).toBe(false);
  });
}); 