import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAccessToken } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Resume admin session from refresh token cookie on boot
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          const userRes = await api.get('/auth/me');
          if (userRes.data?.success) {
            setUser(userRes.data.user);
            setIsAdmin(true);
          }
        }
      } catch (err) {
        // Safe to ignore on initial load (not logged in)
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for axios authorization errors triggering logout
    const handleLogoutEvent = () => {
      setUser(null);
      setIsAdmin(false);
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        setIsAdmin(true);
        return { success: true };
      }
      return { success: false, message: 'Access token missing' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Incorrect credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err.message);
    } finally {
      setAccessToken('');
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
