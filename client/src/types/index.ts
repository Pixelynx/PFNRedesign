// User-related types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
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
  error?: string;
  message?: string;
  status?: number;
  [key: string]: any;
} 