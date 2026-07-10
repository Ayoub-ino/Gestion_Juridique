"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type User = {
  id: number;
  login: string;
  nom: string;
  role: string;
  service: string;
  serviceId?: number;
  permissions?: string[];
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (key: string) => boolean;
  permissions: string[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const login = async (login: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5200'}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Login: login, Password: password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Échec de la connexion');
    }
    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const permissions = user?.permissions || [];

  const hasPermission = useCallback((key: string): boolean => {
    if (!user) return false;
    // Admin always has all permissions
    if (user.role === "Admin") return true;
    return permissions.includes(key);
  }, [user, permissions]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, hasPermission, permissions }}>
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
