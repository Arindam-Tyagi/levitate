import React, { createContext, useState, useContext, useEffect } from 'react';
import { Dataset } from '../types';
import { API_ENDPOINTS } from '../config/api';

interface AuthContextType {
  user: Dataset | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Dataset | null>(() => {
    try {
      const storedUser = localStorage.getItem('levitate-user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Could also check token validity with backend here
    setLoading(false);
  }, []);

  // Corrected code for useAuth.tsx
const login = async (credentials: any) => {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const userData = await response.json();
    setUser(userData);
    localStorage.setItem('levitate-user', JSON.stringify(userData));
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const register = async (credentials: any) => {
  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    const userData = await response.json();
    setUser(userData);
    localStorage.setItem('levitate-user', JSON.stringify(userData));
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

  const logout = async () => {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('levitate-user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
