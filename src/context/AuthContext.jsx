import React, { createContext, useContext, useState } from 'react';
import { login as loginApi } from '../services/api';

// The authentication context holds the current user and exposes
// login/logout methods.  User information is persisted to
// localStorage so sessions survive page reloads.  The login
// function authenticates against the backend and stores the returned
// payload, while logout clears all stored data.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('progres_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Authenticate the user against the backend.  On success the
  // returned data is stored in both localStorage and React state.
  const login = async (username, password) => {
    const data = await loginApi(username, password);
    setUser(data);
    localStorage.setItem('progres_user', JSON.stringify(data));
  };

  // Clear any stored authentication information.  This resets the
  // context state and removes the user from localStorage.
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

// Convenience hook to access the authentication context.
export function useAuth() {
  return useContext(AuthContext);
}