import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // If not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;