import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route wrapper that ensures authentication and optional role-based authorization.
 * 
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string} [requiredRole] - Required role (e.g., 'admin', 'student')
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const userRole = (currentUser.role || '').toLowerCase().replace('role_', '');
    const targetRole = requiredRole.toLowerCase().replace('role_', '');

    if (userRole !== targetRole) {
      // If student tries to access admin route, redirect to dashboard; otherwise home
      return <Navigate to={userRole === 'student' ? '/dashboard' : '/'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
