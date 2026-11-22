import { useState } from 'react';

const API_URL = 'http://localhost:5000/api/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuth') === 'true' && Boolean(localStorage.getItem('token'));
  });
  const [isLoading, setIsLoading] = useState(false);

  const saveSession = (data, fallbackName) => {
    localStorage.setItem('isAuth', 'true');
    if (data.token) localStorage.setItem('token', data.token);
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('username', data.user.name || fallbackName);
    } else {
      localStorage.setItem('username', fallbackName);
    }
    localStorage.setItem('userBadge', 'Premium');
    setIsAuthenticated(true);
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Помилка реєстрації');
        return false;
      }

      saveSession(data, name);
      return true;
    } catch (error) {
      alert('Не вдалося з’єднатися з сервером. Перевір, чи запущено node index.js');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Невірний email або пароль');
        return false;
      }

      saveSession(data, email.split('@')[0]);
      return true;
    } catch (error) {
      alert('Не вдалося з’єднатися з сервером. Перевір, чи запущено node index.js');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('userBadge');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, register, logout, isLoading };
};