// levitate/src/hooks/useAuth.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '../config/api';
import { API_ENDPOINTS } from '../config/api';

interface User {
  _id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.GET_ME, {
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            setUser(data);
        } else {
            setUser(null)
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw the error to be caught in the component
    }
  };

  const register = async (credentials: any) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
        console.error("Registration failed:", error);
        throw error; // Re-throw the error
    }
  };

  const logout = async () => {
    await apiRequest(API_ENDPOINTS.LOGOUT, { 
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
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