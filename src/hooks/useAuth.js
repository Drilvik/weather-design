import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuth') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username, password) => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userBadge', 'Premium'); 
        
        setIsAuthenticated(true);
        setIsLoading(false);
        resolve(true); 
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('username');
    localStorage.removeItem('userBadge');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout, isLoading };
};