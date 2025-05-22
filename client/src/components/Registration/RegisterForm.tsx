import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../shared/FormInput';
import Button from '../shared/Button';
import ErrorMessage from '../shared/ErrorMessage';
import SuccessMessage from '../shared/SuccessMessage';
import { useAuth } from '../Context/AuthContext/AuthContext';
import { registerSchema, type RegisterFormData } from '../../schemas/auth';
import './RegisterForm.css';

const RegisterForm: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string>('');
  const { register: registerUser, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password, data.firstName, data.lastName);
      setSuccessMessage('Registration successful! You can now log in.');
      reset();
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      // Error handled in the auth context
    }
  };

  return (
    <div className="register-form-container" role="main">
      <div className="register-form-card">
        <h2 className="register-form-title">Create Account</h2>
        <p className="register-form-subtitle">Join Pink Friday Nails today</p>
        
        {authError && <ErrorMessage message={authError} />}
        {successMessage && <SuccessMessage message={successMessage} />}
        
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="register-form"
          noValidate
          aria-label="Registration form"
        >
          <div className="name-fields">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  id="firstName"
                  label="First Name"
                  type="text"
                  placeholder="Enter your first name"
                  error={errors.firstName?.message}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  className="name-field"
                />
              )}
            />
            
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  id="lastName"
                  label="Last Name"
                  type="text"
                  placeholder="Enter your last name"
                  error={errors.lastName?.message}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  className="name-field"
                />
              )}
            />
          </div>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                id="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            )}
          />
          
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                id="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                error={errors.password?.message}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
            )}
          />
          
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
            )}
          />
          
          <div className="password-requirements">
            <p>Password must be at least 6 characters long</p>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="register-form-footer">
          <p>
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="login-link"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;