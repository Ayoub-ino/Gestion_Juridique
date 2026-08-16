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

  const [adminOverrides, setAdminOverrides] = useState<Record<string, boolean>>({});

  const permissions = user?.permissions || [];

  // Enhanced permission validation with admin override check
  const hasPermission = useCallback((key: string): boolean => {
    if (!user) return false;
    
    // First check if user has the base permission
    if (!permissions.includes(key)) return false;
    
    // If user is admin, check if this permission is overridden
    if (user.role === "Admin") {
      // Check if this permission is in admin overrides (disabled)
      return !adminOverrides[key]; // If not in overrides, it's enabled
    }
    
    return true;
  }, [user, permissions, adminOverrides]);

  // Admin override validation - check if this permission is overridden for admin
  const isAdminOverrideDisabled = useCallback((key: string): boolean => {
    if (user?.role !== "Admin") return false;
    // Check if this permission is in admin overrides (disabled)
    return adminOverrides[key] === false;
  }, [user, adminOverrides]);

  // Fetch admin overrides from API
  const fetchAdminOverrides = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5200'}/api/rbac/permissions/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const overridesMap: Record<string, boolean> = {};
        data.permissions.forEach((perm: any) => {
          if (!perm.Enabled) {
            overridesMap[perm.Key] = false;
          }
        });
        setAdminOverrides(overridesMap);
      }
    } catch (error) {
      console.error('Error fetching admin overrides:', error);
    }
  };

  useEffect(() => {
    if (user?.role === "Admin" && token) {
      fetchAdminOverrides();
    }
  }, [user?.role, token]);

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
