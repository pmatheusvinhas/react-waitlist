# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-beta.1] - 2025-03-13

### Added
- New advanced theming system with built-in support for design frameworks
- Integration with Tailwind CSS through `tailwindDefaultTheme` and framework adapter
- Integration with Material UI through `materialUIDefaultTheme` and framework adapter
- Component-specific styling options in theme configuration
- Animation configuration with support for reduced motion preferences
- Comprehensive documentation for the new theming system

### Changed
- Completely refactored theme architecture for better integration with design systems
- Enhanced component styling with more granular control
- Improved theme merging with deep object support
- Updated examples to demonstrate the new theming capabilities
- Renamed theme exports to be more descriptive (`tailwindDefaultTheme`, `materialUIDefaultTheme`)

### Fixed
- Fixed issues with CSS overriding theme settings
- Improved consistency between theme configuration and rendered styles
- Better type safety for theme configuration

## [0.1.5-beta.2] - 2025-03-13

### Changed
- Improved server component architecture to prevent React Context usage in server components
- Separated client and server exports into distinct entry points
- Added new `react-waitlist/client` entry point for client components
- Updated documentation to reflect the new import structure

### Fixed
- Fixed compatibility issues with Next.js 15 server components
- Resolved error with `createContext` being used in server components

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