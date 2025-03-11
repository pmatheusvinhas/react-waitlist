import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WaitlistForm from '../../src/components/WaitlistForm';

// Mock dos hooks
jest.mock('../../src/hooks/useWaitlistEvents', () => ({
  useWaitlistEvents: () => ({
    subscribe: jest.fn(),
    subscribeToMany: jest.fn(),
    emit: jest.fn()
  })
}));

jest.mock('../../src/hooks/useReCaptcha', () => ({
  useReCaptcha: () => ({
    executeReCaptcha: jest.fn().mockResolvedValue('test-token'),
    verifyToken: jest.fn().mockResolvedValue({ success: true, score: 0.9 }),
    isLoaded: true,
    error: null
  })
}));

// Mock do fetch
global.fetch = jest.fn().mockImplementation(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 'test-id', email: 'test@example.com' })
  })
);

describe('WaitlistForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should render form with default fields', () => {
    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        security={{ botProtection: false }}
      />
    );
    
    // Check if form elements are rendered
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join the waitlist/i })).toBeInTheDocument();
  });
  
  test('should render form with custom fields', () => {
    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        fields={[
          { type: 'email', name: 'email', label: 'Email Address', required: true },
          { type: 'text', name: 'name', label: 'Full Name', required: true },
          { type: 'select', name: 'role', label: 'Role', options: ['Developer', 'Designer', 'Other'] }
        ]}
        security={{ botProtection: false }}
      />
    );
    
    // Check if custom fields are rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    
    // Check if select options are rendered
    const roleSelect = screen.getByLabelText(/role/i);
    expect(roleSelect.options.length).toBe(4);
    expect(roleSelect.options[1].text).toBe('Developer');
    expect(roleSelect.options[2].text).toBe('Designer');
    expect(roleSelect.options[3].text).toBe('Other');
  });
  
  test('should render form with custom content', () => {
    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        title="Custom Title"
        description="Custom Description"
        submitText="Join Now"
        security={{ botProtection: false }}
      />
    );
    
    // Check if custom content is rendered
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join the waitlist/i })).toBeInTheDocument();
  });
  
  test('should validate form fields', async () => {
    // Mock para capturar chamadas ao console.error
    const originalConsoleError = console.error;
    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;

    const mockSubmit = jest.fn();
    
    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true },
          { type: 'text', name: 'name', label: 'Name', required: true }
        ]}
        security={{ botProtection: false }}
        onSubmit={mockSubmit}
      />
    );

    // Submit form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));

    // Verificar que o formulário não foi submetido devido à validação
    await waitFor(() => {
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    // Fill email field with invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });

    // Submit form again
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));

    // Verificar que o formulário ainda não foi submetido devido à validação
    await waitFor(() => {
      expect(mockSubmit).not.toHaveBeenCalled();
    });
    
    // Restaurar console.error original
    console.error = originalConsoleError;
  });

  test('should submit form successfully', async () => {
    const mockSubmit = jest.fn();
    const mockSuccess = jest.fn();

    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        onSubmit={mockSubmit}
        onSuccess={mockSuccess}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true },
          { type: 'text', name: 'name', label: 'Name', required: true }
        ]}
        security={{ botProtection: false }}
      />
    );

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));

    // Check if callbacks are called
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      expect(mockSuccess).toHaveBeenCalled();

      // Check if form data is passed to onSubmit
      expect(mockSubmit.mock.calls[0][0].formData).toEqual({
        email: 'test@example.com',
        name: 'John Doe'
      });

      // Check if response is passed to onSuccess
      expect(mockSuccess.mock.calls[0][0].response).toEqual({
        id: 'test-id',
        email: 'test@example.com'
      });
    });

    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/you're on the list/i)).toBeInTheDocument();
    });
  });

  test('should handle submission error', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          error: 'Invalid email address'
        })
      })
    );

    const mockError = jest.fn();

    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        onError={mockError}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
        security={{ botProtection: false }}
      />
    );

    // Fill email field
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));

    // Check if error callback is called
    await waitFor(() => {
      expect(mockError).toHaveBeenCalled();
      expect(mockError.mock.calls[0][0].error).toBeTruthy();
    });

    // Verificar se a mensagem de erro é exibida (usando o texto real que aparece)
    await waitFor(() => {
      expect(screen.getByText(/failed to make request to resend api/i)).toBeInTheDocument();
    });
  });

  test('should handle network error', async () => {
    // Mock fetch to throw error
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    const mockError = jest.fn();

    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        onError={mockError}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
        security={{ botProtection: false }}
      />
    );

    // Fill email field
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));

    // Check if error callback is called
    await waitFor(() => {
      expect(mockError).toHaveBeenCalled();
      expect(mockError.mock.calls[0][0].error.message).toBe('Network error');
    });
  });
}); 