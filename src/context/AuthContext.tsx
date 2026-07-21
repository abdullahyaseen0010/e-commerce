"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthCredentials, AuthSession, RegisterPayload, User } from "@/types/user";
import { login as loginRequest, logout as logoutRequest, register as registerRequest } from "@/lib/api/auth";
import { seedMockUser } from "@/lib/api/user";

const AUTH_STORAGE_KEY = "visac:auth-session";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (new Date(session.expiresAt).getTime() < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

function persistSession(session: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rehydrate on mount: restore a non-expired session and re-seed the mock API's
  // in-memory user store, which otherwise resets on every page reload.
  useEffect(() => {
    const session = loadStoredSession();
    if (session) {
      seedMockUser(session.user);
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await loginRequest(credentials);
      persistSession(session);
      setUser(session.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await registerRequest(payload);
      persistSession(session);
      setUser(session.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
    } finally {
      persistSession(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isLoading, error, login, register, logout, clearError }),
    [user, isLoading, error, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}