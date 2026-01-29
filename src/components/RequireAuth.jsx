import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A route guard that renders its child routes only when the user is
 * authenticated.  If no user is present in context, the component
 * redirects to the login page and preserves the intended destination
 * in the navigation state.
 */
export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}