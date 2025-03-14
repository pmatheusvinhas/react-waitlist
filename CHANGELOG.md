# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0-beta.3] - 2025-03-14

### Added
- Added dynamic loading of Google Fonts (Inter and Roboto) for better theme support
- Created a dedicated fonts module with dynamic font loading functionality
- Added font family constants for consistent typography across themes

### Changed
- Enhanced visual distinction between Tailwind and Material UI themes
- Updated Tailwind theme with brighter blue primary color (#2563EB) and more pronounced visual elements
- Updated Material UI theme with purple primary color (#9C27B0) and distinctive Material Design styling
- Improved component-specific styling for better framework differentiation
- Enhanced typography, spacing, and border styles to make themes more recognizable
- Switched from CSS imports to dynamic JavaScript font loading for better compatibility

### Fixed
- Resolved issue where themes appeared too similar, making it difficult to distinguish between them
- Improved visual feedback in form elements for better user experience
- Fixed font loading issues by implementing dynamic font loading that works in both client and server environments

## [1.1.0-beta.2] - 2025-03-14

### Changed
- Completed transition of style files to core module architecture
- Moved animations and adapters from styles directory to core module
- Improved theme merging algorithm to better prioritize user-defined properties
- Fixed issue with theme application where default theme was incorrectly overriding user themes
- Enhanced type safety in theme handling
- Removed legacy styles directory in favor of the new core module structure

### Fixed
- Fixed issue where tailwindDefaultTheme and other custom themes weren't properly applied
- Resolved ambiguity in exported animation utilities
- Improved handling of nested theme properties during theme merging

## [1.1.0-beta.1] - 2025-03-13

### Added
- New modular architecture with a centralized core module
- Added `field_focus` event to track when users interact with form fields
- Improved event system with a shared EventBus
- New hooks for easier event handling
- Better TypeScript types with centralized definitions

### Changed
- Major refactoring of the codebase for better maintainability
- Removed `view` event in favor of more specific events
- Updated event handling across all components
- Improved consistency between client and server components
- Enhanced webhook and analytics integrations with the new event system

### Fixed
- Fixed inconsistencies between client and server event handling
- Improved type safety throughout the codebase
- Better error handling for events

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