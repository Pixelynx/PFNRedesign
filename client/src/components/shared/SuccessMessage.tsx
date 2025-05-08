import React from 'react';
import './MessageStyles.css';

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="message success-message-box">
      <span className="message-icon">✓</span>
      <span className="message-text">{message}</span>
    </div>
  );
};

export default SuccessMessage; 