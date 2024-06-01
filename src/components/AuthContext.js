import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected named import

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Auth state initialization effect
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      try {
        const decodedToken = jwtDecode(jwtToken);
        setCurrentUser({
          jwtToken,
          id: decodedToken.user_id,
          name: decodedToken.name || 'Guest'
        });

      } catch (error) {
        console.error('Error decoding JWT token:', error);
        localStorage.removeItem('jwtToken'); // Clear the invalid token
      }
    }
  }, []);

  const login = (jwtToken, userId, navigate) => {
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('user_id', userId);
    try {
      const decodedToken = jwtDecode(jwtToken); // Decode the token
      localStorage.setItem('user_id', decodedToken.user_id);
      setCurrentUser({
        jwtToken,
        id: decodedToken.user_id,
        name: decodedToken.name
      });
      navigate(`/users/${decodedToken.user_id}`);
    } catch (error) {
      console.error('Error during login:', error);
      console.error('ログイン中にエラーが発生しました:', error);
      logout(); // エラーがある場合はログアウト
    }
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user_id');
    setCurrentUser(null);

  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
