import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './components/Context/AuthContext/AuthContext';
import AppRoutes from './utils/routes';

const App: React.FC = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
};

export default App; 