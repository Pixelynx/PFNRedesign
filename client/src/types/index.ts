// User-related types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  message: string;
  user: User;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Form-related types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegistrationFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface RegistrationFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

// API Request/Response related types
export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
} 