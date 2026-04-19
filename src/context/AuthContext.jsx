import React, { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null); // Extend to fetch user details if API available

  const loginAuth = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    if(userData) setUser(userData);
  };

  const logoutAuth = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loginAuth, logoutAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
