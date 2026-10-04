import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data?.success && res.data?.user) {
          setUser(res.data.user);
        }
      } catch (_) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, expectedRole) => {
    const payload = { email, password };
    if (expectedRole) payload.expectedRole = expectedRole;

    const res = await api.post('/auth/login', payload);
    if (res.data?.success && res.data?.user) {
      const loggedUser = res.data.user;

      // Double-check role matching on client side as an extra safeguard
      if (expectedRole && loggedUser.role !== expectedRole) {
        localStorage.removeItem('eventhub_token');
        setUser(null);
        throw new Error('This account does not belong to the selected role.');
      }

      if (res.data?.accessToken) {
        localStorage.setItem('eventhub_token', res.data.accessToken);
      }
      setUser(loggedUser);
      return loggedUser;
    }
  };

  const register = async ({ name, email, password, role = 'USER' }) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data?.success && res.data?.user) {
      if (res.data?.accessToken) {
        localStorage.setItem('eventhub_token', res.data.accessToken);
      }
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    localStorage.removeItem('eventhub_token');
    setUser(null);
  };

  const isOrganizer = user?.role === 'ORGANIZER' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isOrganizer,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
