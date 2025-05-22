# Pink Friday Nails
...

## Features

- User registration with email, password, first name, and last name
- User login with JWT authentication
- Form validation for both client and server side
- Protected routes requiring authentication
- Responsive design following the Pink Friday Nails branding
- Complete TypeScript implementation with strict typing

## Feature Roadmaps
[AR Try-On Feature Roadmap](./docs/ARTryOnRoadmap.md)

## Technology Stack

### Frontend
- React with TypeScript
- React Router for routing
- Axios for API requests
- CSS for styling
- Type-safe component architecture

### Backend
- Spring Boot
- Spring Security with JWT
- JPA/Hibernate for database access
- BCrypt for password hashing

## Getting Started

### Prerequisites
- Node.js and npm
- Java 11 or higher
- Maven
- TypeScript (automatically installed with the project dependencies)

### Installation

1. Clone the repository
2. Backend setup:
   ```
   cd server/ecommerce
   mvn clean install
   mvn spring-boot:run
   ```
3. Frontend setup:
   ```
   cd client
   npm install
   npm start
   ```

The frontend will be available at http://localhost:3000 and the backend at http://localhost:8080.

## Running Tests

### Backend Tests
```
cd server/ecommerce
mvn test
```

### Frontend Tests
```
cd client
npm test
```

## Testing Architecture

The project uses a modern testing approach with the following structure:

### Test Organization
- `__tests__/unit/`: Unit tests for individual components
- `__tests__/integration/`: Integration tests for component interactions

### Testing Technologies
- Jest as the test runner
- React Testing Library for component testing
- @testing-library/user-event v14 for simulating user interactions
- Mock Service Worker for API mocking

## Project Structure

### Backend
- `model`: Database entities
- `repository`: Data access layer
- `service`: Business logic layer
- `controller`: API endpoints
- `dto`: Data transfer objects
- `exception`: Custom exceptions and handlers
- `security`: JWT and authentication configuration

### Frontend
- `components`: Reusable UI components with TypeScript interfaces
- `utils`: Helper functions and context with TypeScript typing
- `__tests__`: Unit and integration tests
- `types`: Type definitions and interfaces

## Security Features

- Passwords are hashed using BCrypt
- JWT tokens for stateless authentication
- CSRF protection
- Input validation on both client and server side
- Type-safe requests and responses
