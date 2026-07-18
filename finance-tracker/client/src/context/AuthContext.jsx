import { createContext, useEffect, useState } from 'react';

import * as authApi from '../api/auth.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .getCurrentUser()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('accessToken'))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
