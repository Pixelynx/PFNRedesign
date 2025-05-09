# Changelog

## [Unreleased]

## [2025-09-05]
### Fixed
- Resolved issue with Maven failing to detect `mainClass` by moving `pom.xml` from `/src` to project root of server directory.
- Fixed PostgreSQL authentication error due to password encryption mismatch:
  - Updated DB user password to use `SCRAM-SHA-256` instead of `MD5` to match `pg_hba.conf` authentication method.
- Recreated missing `pfn_db` database after password update invalidated original DB reference.
- Fixed JWT signing key size issue for HS512 algorithm by implementing proper secure key generation
- Resolved CORS configuration issues preventing successful registration and login
- Fixed authorization header management in API calls
- Improved token storage and cleanup in AuthContext
- Enhanced registration endpoint security configuration
- Fixed login flow with proper error handling
- Resolved API URL configuration in frontend

## [[2025-28-05] - [2025-27-04]]
### Added
- User registration and authentication system with JWT token-based auth
- Login form component with validation and error handling
- Registration form component with validation and error handling
- Protected routes for authenticated users
- Responsive UI design with Pink Friday Nails branding
- TypeScript integration across all components
- Type-safe implementation with strict typing throughout the application
- Form validation with TypeScript interfaces

### Changed
- Converted JavaScript components to TypeScript
- Added TypeScript type definitions for all components
- Improved error handling with typed error interfaces
- Enhanced form validation with TypeScript types

### Fixed
- Added proper TypeScript declarations for all React components
- Fixed type-related linting errors in component implementations

### Security
- Implemented secure JWT authentication
- Password encryption with BCrypt
- Input validation on both client and server sides 