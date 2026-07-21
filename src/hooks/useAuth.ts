"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/context/AuthContext";

/**
 * Access auth state and actions. Must be used within an <AuthProvider>
 * (mounted in src/app/layout.tsx).
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}