import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WaitlistForm from '../../src/components/WaitlistForm';

// Mock do reCAPTCHA hook
const mockExecuteReCaptcha = jest.fn();
jest.mock('../../src/hooks/useReCaptcha', () => ({
  useReCaptcha: () => ({
    executeReCaptcha: mockExecuteReCaptcha,
    isLoaded: true,
    error: null
  })
}));

// Mock do fetch para simular chamadas de API
global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes('/api/resend-proxy')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 'test-id',
        email: 'test@example.com'
      })
    });
  }
  
  if (url.includes('/api/recaptcha-proxy')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        score: 0.9
      })
    });
  }

  return Promise.reject(new Error(`Unhandled fetch to ${url}`));
});

describe('WaitlistForm with reCAPTCHA', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockExecuteReCaptcha.mockReset();
    mockExecuteReCaptcha.mockResolvedValue('test-recaptcha-token');
    global.fetch.mockClear();
  });
  
  test('should render form with reCAPTCHA enabled', () => {
    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        recaptchaSiteKey="test-site-key"
        recaptchaProxyEndpoint="/api/recaptcha-proxy"
        security={{ 
          botProtection: false,
          enableReCaptcha: true,
          reCaptchaSiteKey: "test-site-key"
        }}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
      />
    );
    
    // Form should be rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join the waitlist/i })).toBeInTheDocument();
  });
  
  test('should verify reCAPTCHA on form submission', async () => {
    const mockSubmit = jest.fn();
    const mockSuccess = jest.fn();
    
    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        recaptchaSiteKey="test-site-key"
        recaptchaProxyEndpoint="/api/recaptcha-proxy"
        security={{ 
          botProtection: false,
          enableReCaptcha: true,
          reCaptchaSiteKey: "test-site-key"
        }}
        onSubmit={mockSubmit}
        onSuccess={mockSuccess}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
      />
    );
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    
    // Verify reCAPTCHA was executed and form was submitted
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      expect(mockExecuteReCaptcha).toHaveBeenCalled();
      
      // Verificar que o fetch foi chamado duas vezes
      expect(global.fetch).toHaveBeenCalledTimes(2);
      
      // Verificar a primeira chamada para o endpoint do reCAPTCHA
      expect(global.fetch.mock.calls[0][0]).toContain('/api/recaptcha-proxy');
      expect(global.fetch.mock.calls[0][1]).toEqual(expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('test-recaptcha-token')
      }));
      
      // Verificar a segunda chamada para o endpoint do Resend
      expect(global.fetch.mock.calls[1][0]).toContain('/api/resend-proxy');
      expect(global.fetch.mock.calls[1][1]).toEqual(expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('test@example.com')
      }));
    });
  });
  
  test('should handle reCAPTCHA verification failure', async () => {
    const mockError = jest.fn();
    
    // Configure mock to reject
    mockExecuteReCaptcha.mockRejectedValue(new Error('reCAPTCHA verification failed'));
    
    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        recaptchaSiteKey="test-site-key"
        recaptchaProxyEndpoint="/api/recaptcha-proxy"
        security={{ 
          botProtection: false,
          enableReCaptcha: true,
          reCaptchaSiteKey: "test-site-key"
        }}
        onError={mockError}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
      />
    );
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    
    // Verify error callback was called
    await waitFor(() => {
      expect(mockError).toHaveBeenCalled();
      expect(mockError.mock.calls[0][0].error).toBeTruthy();
    });
  });
}); 