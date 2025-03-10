# Accessibility

React Waitlist is designed to be accessible to all users, including those with disabilities. This document outlines the accessibility features and best practices for using the component.

## Built-in Accessibility Features

### ARIA Attributes

The component uses appropriate ARIA attributes to ensure screen readers can properly interpret the form:

- `aria-required` for required fields
- `aria-invalid` for fields with validation errors
- `aria-describedby` to associate error messages with fields
- `aria-live` regions for dynamic content updates
- `role="alert"` for error messages

### Keyboard Navigation

All interactive elements are fully keyboard accessible:

- Tab navigation follows a logical order
- Focus states are clearly visible
- Form can be submitted with Enter key
- Select dropdowns can be navigated with arrow keys

### Screen Reader Announcements

Status changes are announced to screen readers:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  a11y={{
    announceStatus: true, // Default: true
  }}
/>
```

### Reduced Motion

The component respects the user's motion preferences:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  a11y={{
    reducedMotion: 'auto', // 'auto', true, or false
  }}
/>
```

When set to `'auto'` (default), the component will check the user's system preference (`prefers-reduced-motion`) and adjust animations accordingly.

### High Contrast

For users who need higher contrast:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  a11y={{
    highContrast: true, // Default: false
  }}
/>
```

### Custom ARIA Labels

You can customize the ARIA labels used by the component:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  a11y={{
    ariaLabels: {
      form: 'Waitlist signup form',
      emailField: 'Your email address',
      submitButton: 'Join the waitlist',
      successMessage: 'Successfully joined the waitlist',
      errorMessage: 'Error joining the waitlist',
    },
  }}
/>
```

## Accessibility Best Practices

### Color Contrast

When customizing the theme, ensure that text has sufficient contrast with its background:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  theme={{
    colors: {
      // Ensure these colors have sufficient contrast
      primary: '#0070f3',
      text: '#333333',
      background: '#ffffff',
      error: '#d32f2f',
    },
  }}
/>
```

The WCAG 2.1 AA standard requires a contrast ratio of at least:
- 4.5:1 for normal text
- 3:1 for large text (18pt or 14pt bold)

### Text Size

Ensure that text is readable by using appropriate font sizes:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  theme={{
    typography: {
      fontSizes: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        md: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
      },
    },
  }}
/>
```

### Form Labels

Always use clear and descriptive labels for form fields:

```jsx
<Waitlist 
  audienceId="your-audience-id"
  proxyEndpoint="/api/resend-proxy"
  fields={[
    {
      name: 'email',
      type: 'email',
      label: 'Email Address', // Clear and descriptive
      required: true,
      placeholder: 'your@email.com',
    },
  ]}
/>
```

### Error Messages

Error messages should be clear and provide guidance on how to fix the issue:

```jsx
// The component handles this automatically
// Example error message: "Please enter a valid email address"
```

## Testing Accessibility

We recommend testing your implementation with:

1. **Keyboard navigation**: Try using the form with only a keyboard
2. **Screen readers**: Test with VoiceOver (macOS), NVDA or JAWS (Windows), or TalkBack (Android)
3. **Automated tools**: Use tools like axe, Lighthouse, or WAVE to check for accessibility issues
4. **Reduced motion**: Test with `prefers-reduced-motion` enabled
5. **High contrast**: Test with high contrast mode enabled

## Compliance

React Waitlist is designed to help you build forms that comply with:

- Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
- Section 508 of the Rehabilitation Act
- Americans with Disabilities Act (ADA)

However, compliance ultimately depends on your implementation and customization. Always test your specific implementation with real users and accessibility tools. 