import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/Login/LoginForm';
import RegisterForm from '../components/Registration/RegisterForm';
import { useAuth } from '../components/Context/AuthContext/AuthContext';
import SideNav from '../layouts/SideNav';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Temp Dash component
const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <div className="dashboard-container">
      <h1>Welcome, {currentUser?.firstName}!</h1>
      <p>You've successfully logged in to Pink Friday Nails.</p>
      <button onClick={logout} className="logout-button">Logout</button>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <div className="app">
      {!isAuthPage && <SideNav />}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/products" element={<div className="dashboard-container"><h1>Products</h1><p>All available products.</p></div>} />
        <Route path="/length/:type" element={<div className="dashboard-container"><h1>Length Category</h1><p>Products filtered by length.</p></div>} />
        <Route path="/style/:type" element={<div className="dashboard-container"><h1>Style Category</h1><p>Products filtered by style.</p></div>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
};

export default AppRoutes; 