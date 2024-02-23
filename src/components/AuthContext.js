// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        jwtToken: localStorage.getItem('jwtToken') || '',
        user_id: localStorage.getItem('user_id') || '',
    });
  
    const login = (jwtToken, user_id) => {
      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('user_id', user_id);
      setAuthData({ jwtToken, user_id });
    };
  
    const logout = () => {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user_id');
      setAuthData({ jwtToken: null, user_id: null });
    };

  return (
    <AuthContext.Provider value={{ ...authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
