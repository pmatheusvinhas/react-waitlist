import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WaitlistForm from '../../src/components/WaitlistForm';
const server = require('../server/index');

describe('Resend Integration', () => {
  let testServer;
  
  // Start the test server before all tests
  beforeAll(() => {
    testServer = server.start(3030);
  });
  
  // Stop the test server after all tests
  afterAll(() => {
    server.stop();
  });
  
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should successfully add authorized email to waitlist', async () => {
    const mockSuccess = jest.fn();
    
    // Set the authorized test email
    process.env.AUTHORIZED_TEST_EMAIL = 'paulomatheusvinhas@gmail.com';
    
    render(
      <WaitlistForm
        resendAudienceId="2e4a7fc3-58a2-4ed7-b3ff-6d54dfbf7017"
        resendProxyEndpoint="http://localhost:3030/api/resend-proxy"
        onSuccess={mockSuccess}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
        security={{ botProtection: false }}
      />
    );
    
    // Fill the form with the authorized test email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: process.env.AUTHORIZED_TEST_EMAIL }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    
    // Verify success callback was called
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
      expect(mockSuccess.mock.calls[0][0].response).toHaveProperty('id');
    });
  });
  
  test('should reject unauthorized email', async () => {
    const mockError = jest.fn();
    
    render(
      <WaitlistForm
        resendAudienceId="2e4a7fc3-58a2-4ed7-b3ff-6d54dfbf7017"
        resendProxyEndpoint="http://localhost:3030/api/resend-proxy"
        onError={mockError}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
        security={{ botProtection: false }}
      />
    );
    
    // Fill the form with an unauthorized email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'unauthorized@example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    
    // Verify error callback was called
    await waitFor(() => {
      expect(mockError).toHaveBeenCalled();
      expect(mockError.mock.calls[0][0].error.message).toContain('authorized test email');
    });
  });
  
  test('should handle server errors gracefully', async () => {
    // Mock fetch to simulate server error
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({
          error: 'Internal server error'
        })
      });
    });
    
    const mockError = jest.fn();
    
    render(
      <WaitlistForm
        resendAudienceId="2e4a7fc3-58a2-4ed7-b3ff-6d54dfbf7017"
        resendProxyEndpoint="http://localhost:3030/api/resend-proxy"
        onError={mockError}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
        security={{ botProtection: false }}
      />
    );
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: process.env.AUTHORIZED_TEST_EMAIL }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    
    // Verify error callback was called
    await waitFor(() => {
      expect(mockError).toHaveBeenCalled();
      expect(mockError.mock.calls[0][0].error).toBeTruthy();
    });
  });
  
  test('should include additional fields in the submission', async () => {
    // Reset fetch mock
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 'test-id',
          email: process.env.AUTHORIZED_TEST_EMAIL,
          fields: {
            firstName: 'Test',
            company: 'Test Company'
          }
        })
      });
    });
    
    const mockSuccess = jest.fn();
    
    render(
      <WaitlistForm
        resendAudienceId="2e4a7fc3-58a2-4ed7-b3ff-6d54dfbf7017"
        resendProxyEndpoint="http://localhost:3030/api/resend-proxy"
        onSuccess={mockSuccess}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true },
          { type: 'text', name: 'firstName', label: 'First Name' },
          { type: 'text', name: 'company', label: 'Company' }
        ]}
        security={{ botProtection: false }}
      />
    );
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: process.env.AUTHORIZED_TEST_EMAIL }
    });
    
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Test' }
    });
    
    fireEvent.change(screen.getByLabelText(/company/i), {
      target: { value: 'Test Company' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify success callback was called with all fields
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
      expect(mockSuccess.mock.calls[0][0].response.fields).toEqual({
        firstName: 'Test',
        company: 'Test Company'
      });
    });
  });
}); 