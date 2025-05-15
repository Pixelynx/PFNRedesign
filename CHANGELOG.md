# Changelog

## [Unreleased]

## [2025-14-05]
### Added
- API versioning for REST controllers (changed base paths from "/api/*" to "/api/v0/*")
- Added appropriate @Tag annotations to all controllers
- Added @Operation annotations for all controller methods
- Added @ApiResponses annotations for methods returning ResponseEntity
- PATCH endpoint support across all controllers:
  - Added @PatchMapping("/{id}") endpoints that accept Map<String, Object> for partial updates
  - Implemented service-layer methods for handling partial resource updates
  - Added consistent error handling for partial updates
- Added springdoc-openapi-starter-webmvc-ui dependency for API documentation
- Pagination and sorting support for collection endpoints:
  - Updated GET /api/v0/users to return Page<User> instead of List<User>
  - Added request parameters for page, size, and sort with sensible defaults
  - Added Pageable parameter to service methods
  - Implemented proper service methods to support pagination and sorting 
- Implemented DTO pattern across the application:
  - Created dedicated DTOs for all entities with proper validation annotations
  - Added ModelMapper configuration for entity-DTO conversions
  - Implemented mapper interfaces and their implementations for each entity type
  - Added support for paginated results with DTOs

### Changed
- Updated frontend API client to use new versioned endpoints
- Refactored controllers to work with DTOs instead of directly using entities:
  - Updated request body types to use appropriate request DTOs
  - Changed response types to return DTOs instead of entities
  - Enhanced documentation to reflect DTO usage
- Updated existing DTOs to use Lombok for cleaner code

## [2025-13-05]
### Changed
- Refactored Spring Boot controllers to follow modern best practices:
  - Removed redundant @Autowired annotations from constructors
  - Added @ResponseStatus(HttpStatus.CREATED) to POST endpoints
  - Added necessary imports for HttpStatus
- Improved User model with Lombok @Data annotation for automatic generation of:
  - Getters/setters
  - equals/hashCode methods
  - toString method
- Updated test classes to align with implementation changes:
  - Updated UserTest to work with new model structure
  - Updated UserServiceTest to use proper field names and methods
  - [TODO] Update database schema to reflect password field rename to passwordHash

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