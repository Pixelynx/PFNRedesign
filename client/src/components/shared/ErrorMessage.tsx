import React from 'react';
import './MessageStyles.css';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="message error-message-box">
      <span className="message-icon">!</span>
      <span className="message-text">{message}</span>
    </div>
  );
};

export default ErrorMessage; 