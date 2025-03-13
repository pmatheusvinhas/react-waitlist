# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.5-beta.1] - 2025-03-12

### Added
- True server-side rendering (SSR) support for Next.js App Router and similar frameworks
- New `ClientWaitlist` component for hydrating server-rendered forms
- Improved architecture documentation for SSR implementation

### Changed
- Refactored `ServerWaitlist` to be a genuine server component without client-side dependencies
- Updated examples to demonstrate the new SSR architecture
- Improved documentation to reflect the new component architecture

### Fixed
- Fixed issues with React hooks being used in server components
- Resolved compatibility issues with Next.js 15 server components

## [0.1.4-beta.1] - 2025-03-10

### Added
- Google reCAPTCHA v3 integration for enhanced bot protection
- New `useReCaptcha` hook for managing reCAPTCHA
- reCAPTCHA proxy endpoint for secure token verification
- Documentation and examples for reCAPTCHA integration

### Changed
- Expanded security options with reCAPTCHA configuration
- Updated documentation to reflect new security features

### Fixed
- Improved error handling for reCAPTCHA verification

## [0.1.3-beta.1] - 2025-03-10

### Added
- Centralized event system for handling analytics and webhooks
- New `useWaitlistEvents` hook for subscribing to events
- Webhook proxy for secure webhook delivery
- Comprehensive documentation for the events system
- Examples demonstrating event usage

### Changed
- Improved naming consistency with `resendAudienceId` and `resendProxyEndpoint`
- Made Resend integration truly optional
- Enhanced security with warnings for sensitive information in webhooks
- Updated documentation to reflect new features and best practices

### Fixed
- Fixed inconsistent component naming across the codebase
- Addressed potential security issues with webhook headers

## [0.1.2-beta.1] - 2025-03-10

### Added
- Webhook support for integration with external systems
- Documentation for webhook configuration and usage
- Examples of webhook integration with popular services

## [0.1.1-beta.1] - 2025-03-10

### Changed
- Integrated with official Resend SDK instead of direct API calls
- Improved error handling and response parsing

## [0.1.0-beta.1] - 2025-03-10

### Added
- Initial public beta release
- Core waitlist form functionality
- Integration with Resend audiences
- Customizable UI with theming support
- Accessibility features
- Bot and spam protection
- Analytics tracking 