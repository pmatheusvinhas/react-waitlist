# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1-beta.11] - 2024-03-15

### Changed
- Completely redesigned `createResendProxy` implementation for better error handling
- Added proper detection and reporting of Resend API errors
- Added debug mode option to `createResendProxy` for detailed logging
- Improved validation of API keys and request parameters

### Fixed
- Fixed critical issue where Resend API errors weren't properly reported to clients
- Added specific handling for restricted API key errors
- Improved error messages to provide more helpful feedback
- Enhanced type safety throughout the proxy implementation

## [1.1.1-beta.10] - 2024-03-14

### Changed
- Removed `allowedAudiences` restriction from Resend proxy to allow client-side audience specification
- Updated proxy to accept any audience ID from the client for better flexibility
- Improved error handling and logging in Resend proxy

### Fixed
- Fixed parameter naming in useResendAudience hook to match proxy expectations (audience_id -> audienceId)
- Added better validation and error messages in Resend proxy
- Improved error handling to provide more helpful feedback

## [1.1.1-beta.9] - 2024-03-14

### Fixed
- Fixed missing export of `createRecaptchaProxy` in server entry point
- Added proper export of `RecaptchaProxyOptions` interface for better TypeScript support
- Resolved issue where reCAPTCHA proxy was not accessible in server-side environments
- Improved server-side module exports for better compatibility with proxy handlers

## [1.1.1-beta.8] - 2024-03-14

### Changed
- Reduced spacing in Material UI default theme for a more compact form layout
- Decreased margins between form elements for better visual density
- Optimized padding values in Material UI components
- Adjusted font sizes for better proportions in the Material UI default theme

## [1.1.1-beta.7] - 2024-03-14

### Added
- Clear warning banner in example application about CORS limitations with reCAPTCHA and Resend
- Link to client-side proxy example repository for proper production implementation
- Improved error visualization in Event Log and API Calls sections

### Changed
- Enhanced error styling in example application for better visibility of security failures
- Updated documentation to clarify expected CORS errors when using direct verification

### Fixed
- Improved error handling for CORS errors in reCAPTCHA verification
- Better visual feedback for security check failures in the UI

## [1.1.1-beta.6] - 2024-03-14

### Added
- Completely redesigned reCAPTCHA implementation to follow Google's official approach
- Added support for invisible reCAPTCHA with explicit rendering
- Improved callback handling for reCAPTCHA tokens

### Changed
- Refactored security event emission to ensure all events are properly logged
- Enhanced debugging output for security events
- Updated example application with better event logging

### Fixed
- Fixed critical issue with null tokens in reCAPTCHA implementation
- Resolved issue where security events weren't appearing in the Event Log
- Improved reliability of reCAPTCHA in client-side environments

## [1.1.1-beta.4] - 2024-03-14

### Changed
- Modified reCAPTCHA verification to allow using the secret key on the client-side (with warning)
- Improved error handling for reCAPTCHA token execution and verification
- Enhanced diagnostic logging for reCAPTCHA issues, especially for null tokens
- Added more detailed security events for better debugging of reCAPTCHA problems

### Fixed
- Fixed issue where client-side verification with secret key was being blocked
- Improved handling of null tokens from reCAPTCHA execution
- Added graceful fallback when no verification method is available
- Enhanced error reporting with more context about the reCAPTCHA state

## [1.1.1-beta.3] - 2024-03-14

### Added
- Added `onSecurityEvent` callback to WaitlistProps for handling security events
- Added `recaptchaProxyEndpoint` property to SecurityConfig for verifying reCAPTCHA tokens via proxy
- Added `reCaptchaSecretKey` property to SecurityConfig for server-side verification
- Enhanced security event logging with detailed information in the Event Log
- Added support for all three reCAPTCHA verification scenarios: client-side, proxy, and server-side

### Fixed
- Fixed reCAPTCHA implementation to properly handle token verification
- Improved error handling for reCAPTCHA script loading and execution
- Enhanced reCAPTCHA proxy implementation with better error reporting
- Fixed CORS issues in reCAPTCHA verification by adding proper headers
- Improved SSR compatibility for reCAPTCHA

## [1.1.1-beta.2] - 2024-03-14

### Fixed
- Improved reCAPTCHA error handling to properly detect and report null tokens
- Enhanced security event logging with additional console output for debugging
- Fixed issue where security check failures were silently treated as success
- Added proper error messages for security verification failures
- Improved user feedback when security checks fail

## [1.1.1-beta.1] - 2024-03-14

### Fixed
- Fixed typing issue in the EventBus emit method
- Added proper support for reCAPTCHA token in the metadata object
- Fixed usage of loadingText and spinner properties in the theme
- Updated ThemeConfig interface to include new style properties

## [1.1.1-beta.1] - 2024-03-14

### Added
- Enhanced logging for security features (honeypot, submission time check, reCAPTCHA)
- Added detailed security events to the Event Log for better debugging
- Improved SSR compatibility for all security features

### Changed
- Refactored reCAPTCHA module to better handle server-side rendering
- Added `minSubmissionTime` property to SecurityConfig interface with documentation

## [1.1.0-beta.9] - 2025-03-14

### Fixed
- Completely redesigned form state management to fix persistent issue with form values being lost
- Added state-reference synchronization to ensure values are properly retained between fields
- Implemented bidirectional sync between state and reference to prevent data loss
- Optimized form value updates using functional state updates for improved reliability
- Fixed issue where form values were not properly persisted during navigation between fields

## [1.1.0-beta.8] - 2025-03-14

### Fixed
- Fixed critical issue where form field values were lost when navigating between fields
- Implemented reference system to ensure form values persist during re-rendering
- Improved form state management to prevent data loss during user interaction
- Optimized state update flow to ensure consistency between form fields

## [1.1.0-beta.7] - 2025-03-14

### Fixed
- Removed unnecessary event emissions that were interfering with normal form behavior
- Added debug logging to help troubleshoot form value updates
- Fixed order of conditions in package.json exports to ensure TypeScript types are properly resolved

## [1.1.0-beta.6] - 2025-03-14

### Fixed
- Fixed critical issue in the form submission process that caused the form to be cleared without registering events
- Improved submission state management (isSubmitting) to prevent inconsistent states
- Fixed submission button logic to allow multiple submission attempts
- Added proper error handling during form validation

## [1.1.0-beta.5] - 2025-03-14

### Fixed
- Removed reference to analytics module in core/index.ts
- Cleaned up legacy type definition files from dist/styles directory
- Fixed package.json repository URL

## [1.1.0-beta.4] - 2025-03-14

### Changed
- Completely removed analytics integration

### Fixed
- Fixed issue with onFieldFocus callback preventing typing in form fields
- Resolved event duplication in form input handling
- Improved form field interaction by removing redundant event emissions

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
- New `