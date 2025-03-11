/**
 * Test constants for React Waitlist tests
 */

// reCAPTCHA test keys (public keys provided by Google for testing)
export const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
export const RECAPTCHA_SECRET_KEY = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

// Resend test values
export const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_b6xs1HcB_HfMcNnGCzkCLMjkf57XWqtRM';
export const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '2e4a7fc3-58a2-4ed7-b3ff-6d54dfbf7017';
export const AUTHORIZED_TEST_EMAIL = process.env.AUTHORIZED_TEST_EMAIL || 'paulomatheusvinhas@gmail.com';

// Test server configuration
export const TEST_SERVER_PORT = 3030;
export const TEST_SERVER_URL = `http://localhost:${TEST_SERVER_PORT}`;

// Test endpoints
export const RESEND_PROXY_ENDPOINT = `${TEST_SERVER_URL}/api/resend-proxy`;
export const RECAPTCHA_PROXY_ENDPOINT = `${TEST_SERVER_URL}/api/recaptcha-proxy`;
export const WEBHOOK_PROXY_ENDPOINT = `${TEST_SERVER_URL}/api/webhook-proxy`;

// Test form fields
export const TEST_FIELDS = [
  { type: 'email', name: 'email', label: 'Email', required: true },
  { type: 'text', name: 'firstName', label: 'First Name' },
  { type: 'text', name: 'company', label: 'Company' },
  { 
    type: 'select', 
    name: 'role', 
    label: 'Role',
    options: ['Developer', 'Designer', 'Product Manager', 'Other']
  }
];

// Test webhook configuration
export const TEST_WEBHOOK = {
  url: 'https://example.com/webhook',
  events: ['success'],
  includeAllFields: true
};

// Test theme
export const TEST_THEME = {
  colors: {
    primary: '#3182CE',
    secondary: '#805AD5',
    background: '#FFFFFF',
    text: '#1A202C',
    error: '#E53E3E',
    success: '#38A169'
  },
  typography: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '16px',
    lineHeight: 1.5
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px'
  },
  borderRadius: '4px'
}; 