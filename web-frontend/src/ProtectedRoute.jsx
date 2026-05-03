import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500">Access Denied: You do not have permission to view this page.</h1>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
