import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A simple route guard.  If the user is not authenticated the
 * component redirects to the login page preserving the current
 * location in state so we can return to it after logging in.  If
 * authenticated it simply renders the nested routes via <Outlet />.
 */
export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
