"use client";

import { useContext } from "react";
import { CartContext, type CartContextValue } from "@/context/CartContext";

/**
 * Access cart state and actions. Must be used within a <CartProvider>
 * (mounted in src/app/layout.tsx).
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return context;
}