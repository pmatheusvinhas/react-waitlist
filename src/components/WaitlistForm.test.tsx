import React, { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WaitlistForm from './WaitlistForm';
import { Field } from '../core/types';
import * as security from '../core/security';
import { axe, toHaveNoViolations } from 'jest-axe';

// Adicionar o matcher personalizado do jest-axe
expect.extend(toHaveNoViolations);

// Mock completo do AriaProvider
jest.mock('../a11y/AriaProvider', () => {
  const originalModule = jest.requireActual('../a11y/AriaProvider');
  
  return {
    __esModule: true,
    ...originalModule,
    AriaProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
    useAria: () => ({
      reducedMotion: false,
      highContrast: false,
      announceStatus: true,
      ariaLabels: {
        form: 'Waitlist signup form',
        emailField: 'Your email address',
        submitButton: 'Join the waitlist',
        successMessage: 'Successfully joined the waitlist',
        errorMessage: 'Error joining the waitlist',
      },
      announce: jest.fn(),
    }),
  };
});

// Mock do useA11y
jest.mock('../a11y/useA11y', () => ({
  useReducedMotion: () => false,
  useHighContrast: () => false,
  useAriaLabels: () => ({
    form: 'Waitlist signup form',
    emailField: 'Your email address',
    submitButton: 'Join the waitlist',
    successMessage: 'Successfully joined the waitlist',
    errorMessage: 'Error joining the waitlist',
  }),
  useAnnounce: () => jest.fn(),
}));

// Mock do security.ts para desativar a verificação de bot
jest.mock('../core/security', () => {
  return {
    isLikelyBot: jest.fn().mockReturnValue({ isBot: false, reason: null }),
    generateHoneypotFieldName: jest.fn().mockReturnValue('test_honeypot_field'),
    getHoneypotStyles: jest.fn().mockReturnValue({
      position: 'absolute',
      left: '-9999px',
      top: '-9999px',
      opacity: 0,
    }),
    isSuspiciousSubmissionTime: jest.fn().mockReturnValue(false),
    isReCaptchaEnabled: jest.fn().mockReturnValue(false),
  };
});

// Mock the fetch function
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
  
  // Configure fetch mock to return success by default
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ id: 'contact-id', email: 'test@example.com' }),
  });
});

describe('WaitlistForm', () => {
  const defaultProps = {
    resendAudienceId: 'test-audience-id',
    resendProxyEndpoint: '/api/resend-proxy',
  };

  test('renders the form with default props', () => {
    render(<WaitlistForm {...defaultProps} />);
    
    // Check if the title and description are rendered
    expect(screen.getByText('Join our waitlist')).toBeInTheDocument();
    expect(screen.getByText('Be the first to know when we launch')).toBeInTheDocument();
    
    // Check if the email field is rendered
    expect(screen.getByLabelText('Your email address')).toBeInTheDocument();
    
    // Check if the submit button is rendered
    expect(screen.getByRole('button', { name: 'Join the waitlist' })).toBeInTheDocument();
  });

  test('validates email field', async () => {
    render(<WaitlistForm {...defaultProps} />);
    
    // Get the email input and submit button
    const emailInput = screen.getByLabelText('Your email address');
    const submitButton = screen.getByRole('button', { name: 'Join the waitlist' });
    
    // Submit the form without entering an email
    fireEvent.click(submitButton);
    
    // Check if validation error is shown
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    
    // Enter an invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    // Check if validation error is shown
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
    
    // Enter a valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Check if validation error is no longer shown
    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });
  });

  test('renders custom fields', () => {
    const customFields: Field[] = [
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
      },
      {
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        required: false,
      },
      {
        name: 'role',
        type: 'select',
        label: 'Role',
        options: ['Developer', 'Designer', 'Product Manager'],
        required: false,
      },
      {
        name: 'consent',
        type: 'checkbox',
        label: 'I agree to receive updates',
        required: true,
      },
    ];
    
    render(<WaitlistForm {...defaultProps} fields={customFields} />);
    
    // Check if all custom fields are rendered by their text content
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    
    // Use getAllByText para o texto que aparece mais de uma vez
    const consentLabels = screen.getAllByText('I agree to receive updates');
    expect(consentLabels.length).toBeGreaterThan(0);
    
    // Check if select options are rendered
    const roleSelect = screen.getByLabelText('Role');
    fireEvent.click(roleSelect);
    
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });
  
  test('has proper accessibility attributes', () => {
    render(<WaitlistForm {...defaultProps} />);
    
    // Verificar se o formulário tem o atributo aria-label
    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('aria-label', 'Waitlist signup form');
    
    // Verificar se o campo de email tem os atributos de acessibilidade corretos
    const emailInput = screen.getByLabelText('Your email address');
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    
    // Verificar se o botão de envio tem o atributo aria-label
    const submitButton = screen.getByRole('button');
    expect(submitButton).toHaveAttribute('aria-label', 'Join the waitlist');
    
    // Verificar se o botão tem o atributo aria-busy
    expect(submitButton).toHaveAttribute('aria-busy', 'false');
  });
  
  test('should not have any accessibility violations', async () => {
    const { container } = render(<WaitlistForm {...defaultProps} />);
    
    // Verificar se não há violações de acessibilidade
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 