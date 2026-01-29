import React, { createContext, useContext, useState } from 'react';
import { login as loginApi } from '../services/api';

// A context for managing authentication and user information.  The context
// exposes the current `user`, a `login` function that performs the login
// request and stores the returned token, and a `logout` function to clear
// stored credentials.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialise state from localStorage to preserve sessions across page
  // reloads.  The stored value contains the user data returned by the
  // backend on login, including the authentication token.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('progres_user');
    return stored ? JSON.parse(stored) : null;
  });

  /**
   * Authenticate the user against the backend.  On success the returned
   * data is stored in both localStorage and state.  If the call fails
   * an error is propagated to the caller.
   *
   * @param {string} username
   * @param {string} password
   */
  const login = async (username, password) => {
    const data = await loginApi(username, password);
    setUser(data);
    localStorage.setItem('progres_user', JSON.stringify(data));
  };

  /**
   * Clear any stored authentication information.  This resets the
   * context state and removes the user from localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('progres_user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Convenience hook to access the authentication context.  Components
 * consuming this hook will re-render whenever the user state changes.
 */
export function useAuth() {
  return useContext(AuthContext);
}