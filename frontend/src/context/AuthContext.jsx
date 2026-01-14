import React, { createContext, useState, useContext, useEffect } from 'react';
import { userAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const data = await userAPI.getMe();
      if (data.success) {
        setUser(data.user);
      } else {
        setToken(null);
        localStorage.removeItem('authToken');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setToken(null);
      localStorage.removeItem('authToken');
    }
  };

  // Signup
  const signup = async (name, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.signup({
        name,
        email,
        password,
        confirmPassword,
      });

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'An error occurred during signup';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.login({
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'An error occurred during login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};