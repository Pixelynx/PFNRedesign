import React, { forwardRef } from 'react';
import './FormInput.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fullWidth?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const inputId = props.id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className={`form-input ${fullWidth ? 'full-width' : ''} ${className}`}>
        <label htmlFor={inputId} className="form-label">
          {label}
          {error && <span className="required">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${error ? 'input-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
        {error && (
          <span id={errorId} className="error-message" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput; 