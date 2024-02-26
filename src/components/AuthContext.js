import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    jwtToken: localStorage.getItem('jwtToken'),
    id: localStorage.getItem('user_id'),
  });
  
  useEffect(() => {
    // Auth state initialization effect
    const jwtToken = localStorage.getItem('jwtToken');
    const user_id = localStorage.getItem('user_id');
    if (jwtToken && user_id) {
      setCurrentUser({ jwtToken, id: user_id });
    }
  }, []);

  const login = (jwtToken, user_id) => {
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('user_id', user_id);
    setCurrentUser({ jwtToken, id: user_id });
  };
  
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user_id');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
