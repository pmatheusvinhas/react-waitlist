# Testing Strategy

This document outlines the comprehensive testing strategy for the React Waitlist component library.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Types of Tests](#types-of-tests)
- [Test Environment Setup](#test-environment-setup)
- [Testing Tools](#testing-tools)
- [Testing Specific Features](#testing-specific-features)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)

## Overview

The React Waitlist testing strategy aims to ensure the reliability, functionality, and security of all components and features. Our approach combines unit tests, integration tests, and end-to-end tests to provide comprehensive coverage.

## Test Structure

```
/tests
  /unit          # Tests for individual components and functions
  /integration   # Tests for component interactions
  /e2e           # End-to-end tests with proxy servers
  /mocks         # Mock data and services
  /utils         # Test utilities
  /fixtures      # Test data
  /server        # Express server for proxy testing
```

## Types of Tests

### Unit Tests

Unit tests focus on testing individual components, hooks, and utility functions in isolation:

- **Component Tests**: Verify rendering, props handling, and state management
- **Hook Tests**: Validate custom hooks behavior
- **Utility Tests**: Ensure utility functions work correctly
- **Validation Tests**: Confirm form validation logic

### Integration Tests

Integration tests verify that different parts of the system work together correctly:

- **Form Flow Tests**: Test the complete form submission flow
- **Event System Tests**: Verify event propagation between components
- **Theme Integration**: Test theme application across components

### End-to-End Tests

E2E tests simulate real user scenarios with actual API integrations:

- **Resend Integration**: Test actual email submission (limited to authorized test email)
- **reCAPTCHA Integration**: Test verification using reCAPTCHA sandbox
- **Webhook Delivery**: Test webhook delivery through proxy endpoints

## Test Environment Setup

### Environment Variables

Create a `.env.test` file with the following variables:

```
RESEND_API_KEY=your_test_api_key
RESEND_AUDIENCE_ID=your_test_audience_id
AUTHORIZED_TEST_EMAIL=your_authorized_email@example.com
```

### reCAPTCHA Test Keys

For testing reCAPTCHA integration, use Google's test keys:

```javascript
// Test keys provided by Google for development environments
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
const RECAPTCHA_SECRET_KEY = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
```

### Express Test Server

For testing proxy endpoints, we use an Express server that simulates the backend:

```javascript
// Example server setup in tests/server/index.js
const express = require('express');
const app = express();

// Endpoints for Resend, Webhooks, and reCAPTCHA proxies
app.post('/api/resend-proxy', (req, res) => { /* ... */ });
app.post('/api/webhook-proxy', (req, res) => { /* ... */ });
app.post('/api/recaptcha-proxy', (req, res) => { /* ... */ });

// Export functions to start/stop the server during tests
```

## Testing Tools

- **Jest**: Primary testing framework
- **React Testing Library**: For testing React components
- **MSW (Mock Service Worker)**: For mocking HTTP requests
- **Supertest**: For testing API endpoints
- **Express**: For creating test proxy servers

## Testing Specific Features

### Core Form (v0.1.0-beta.1)

- Form rendering and accessibility
- Field validation
- Form submission
- Success/error states
- Bot protection (honeypot)

### Resend Integration (v0.1.1-beta.1)

- Mock API responses
- Real API integration (with authorized email)
- Error handling

### Webhooks (v0.1.2-beta.1)

- Webhook configuration validation
- Webhook proxy functionality
- Security headers and payload validation

### Event System (v0.1.3-beta.1)

- Event subscription and emission
- `useWaitlistEvents` hook functionality
- Event callback execution
- Event data structure validation

### reCAPTCHA Integration (v0.1.4-beta.1)

- reCAPTCHA loading and execution
- Token verification through proxy
- Error handling and fallbacks
- Integration with form submission

## Test Examples

### Unit Test Example: EventManager

```javascript
// tests/unit/EventManager.test.js
import { EventManager } from '../../src/utils/events';

describe('EventManager', () => {
  let eventManager;

  beforeEach(() => {
    eventManager = new EventManager();
  });

  test('should subscribe to events', () => {
    const mockHandler = jest.fn();
    eventManager.subscribe('view', mockHandler);
    
    expect(eventManager.subscribers.view).toHaveLength(1);
    expect(eventManager.subscribers.view[0]).toBe(mockHandler);
  });

  test('should emit events to subscribers', () => {
    const mockHandler = jest.fn();
    eventManager.subscribe('submit', mockHandler);
    
    const eventData = { formData: { email: 'test@example.com' } };
    eventManager.emit('submit', eventData);
    
    expect(mockHandler).toHaveBeenCalledWith(eventData);
  });
});
```

### Integration Test Example: Form with reCAPTCHA

```javascript
// tests/integration/WaitlistFormRecaptcha.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WaitlistForm } from '../../src/components/WaitlistForm';

// Mock reCAPTCHA hook
jest.mock('../../src/hooks/useReCaptcha', () => ({
  useReCaptcha: () => ({
    executeReCaptcha: jest.fn().mockResolvedValue('test-token'),
    isLoaded: true,
    error: null
  })
}));

describe('WaitlistForm with reCAPTCHA', () => {
  test('should verify reCAPTCHA on form submission', async () => {
    const mockSubmit = jest.fn();
    
    render(
      <WaitlistForm
        resendAudienceId="test-audience"
        resendProxyEndpoint="/api/resend-proxy"
        recaptchaSiteKey="test-site-key"
        recaptchaProxyEndpoint="/api/recaptcha-proxy"
        onSubmit={mockSubmit}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
      />
    );
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify reCAPTCHA was executed
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      expect(mockSubmit.mock.calls[0][0].formData).toHaveProperty('g-recaptcha-response');
    });
  });
});
```

### E2E Test Example: Resend Integration

```javascript
// tests/e2e/ResendIntegration.test.js
import { server } from '../server';
import { WaitlistForm } from '../../src/components/WaitlistForm';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

describe('Resend Integration', () => {
  let testServer;
  
  beforeAll(() => {
    testServer = server.start(3030);
  });
  
  afterAll(() => {
    server.stop();
  });
  
  test('should successfully add authorized email to waitlist', async () => {
    const mockSuccess = jest.fn();
    
    render(
      <WaitlistForm
        resendAudienceId={process.env.RESEND_AUDIENCE_ID}
        resendProxyEndpoint="http://localhost:3030/api/resend-proxy"
        onSuccess={mockSuccess}
        fields={[
          { type: 'email', name: 'email', label: 'Email', required: true }
        ]}
      />
    );
    
    // Use authorized test email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: process.env.AUTHORIZED_TEST_EMAIL }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
      expect(mockSuccess.mock.calls[0][0].response).toHaveProperty('id');
    });
  });
});
```

## Continuous Integration

We use GitHub Actions to automate testing:

- Run unit and integration tests on every pull request
- Run E2E tests on main branch commits
- Generate and publish test coverage reports
- Fail builds if coverage thresholds are not met

## Best Practices

1. **Test Coverage**: Aim for at least 80% coverage for all code
2. **Security Testing**: Prioritize testing of security-related features
3. **Mocking External Services**: Use mocks for external services in unit/integration tests
4. **Realistic Data**: Use realistic test data that mimics production scenarios
5. **Accessibility Testing**: Include tests for accessibility compliance
6. **Performance Testing**: Test component rendering performance
7. **Isolation**: Ensure tests are isolated and don't depend on each other
8. **Documentation**: Document test setup and special considerations 