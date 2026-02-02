import React, { createContext, useContext, useState } from 'react';
import { login as loginApi } from '../services/api';

 
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('progres_user');
    return stored ? JSON.parse(stored) : null;
  });
 
  const login = async (username, password) => {
    const data = await loginApi(username, password);
    setUser(data);
    localStorage.setItem('progres_user', JSON.stringify(data));
  };
 
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