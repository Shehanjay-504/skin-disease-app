import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage on mount
    const stored = localStorage.getItem('skindx_user');
    const token = localStorage.getItem('skindx_token');
    if (stored && token) {
      setCurrentUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('skindx_token', token);
    localStorage.setItem('skindx_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('skindx_token');
    localStorage.removeItem('skindx_user');
  };

  const getToken = () => localStorage.getItem('skindx_token');

  const value = {
    currentUser,
    login,
    logout,
    getToken,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
