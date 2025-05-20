import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../shared/FormInput';
import Button from '../shared/Button';
import ErrorMessage from '../shared/ErrorMessage';
import { useAuth } from '../Context/AuthContext/AuthContext';
import { loginSchema, type LoginFormData } from '../../schemas/auth';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const { login, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="login-form-container" role="main">
      <div className="login-form-card">
        <h2 className="login-form-title">Sign In</h2>
        <p className="login-form-subtitle">Welcome back to PFN</p>
        
        {authError && <ErrorMessage message={authError} />}
        
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="login-form"
          noValidate
          aria-label="Sign in form"
        >
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
                placeholder="Enter your password"
                error={errors.password?.message}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
            )}
          />
          
          <div className="login-form-options">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field: { value, onChange } }) => (
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    aria-label="Remember me"
                  />
                  <span>Remember me</span>
                </label>
              )}
            />
            
            <Link 
              to="/forgot-password" 
              className="forgot-password-link"
              aria-label="Forgot password?"
            >
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="login-form-footer">
          <p>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="register-link"
              aria-label="Sign up for a new account"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 