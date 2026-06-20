// src/auth/AuthContext.tsx
import { tokenStorage } from '@/auth/tokenStorage';
import { registerAuthCallbacks } from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  currentUserId: string | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function applyToken(token: string): string {
  const decoded: any = jwtDecode(token);
  return decoded.sub ?? decoded.userId;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registerAuthCallbacks(
      (accessToken) => {
        setCurrentUserId(applyToken(accessToken));
        setIsAuthenticated(true);
      },
      () => {
        setIsAuthenticated(false);
        setCurrentUserId(null);
      }
    );

    (async () => {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        setCurrentUserId(applyToken(token));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    await tokenStorage.setTokens(accessToken, refreshToken);
    setCurrentUserId(applyToken(accessToken));
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await tokenStorage.clearTokens();
    setIsAuthenticated(false);
    setCurrentUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUserId, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}