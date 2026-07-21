"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Cart, CartItem } from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";
import {
  addCartItem,
  calculateCartTotals,
  removeCartItem,
  syncCart,
  updateCartItemQuantity,
  validateCoupon,
} from "@/lib/api/cart";

const CART_STORAGE_KEY = "visac:cart-items";

export interface CartContextValue {
  cart: Cart;
  isLoading: boolean;
  couponError: string | null;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadStoredItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage once on mount (client only — avoids SSR mismatch).
  useEffect(() => {
    setItems(loadStoredItems());
    setIsHydrated(true);
  }, []);

  // Persist + fire a background sync whenever items change, after hydration.
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    syncCart(items).catch(() => {
      // Non-fatal — the cart still works locally even if the sync call fails.
    });
  }, [items, isHydrated]);

  const addItem = useCallback((product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems((current) => addCartItem(current, product, quantity, variant));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((current) => updateCartItemQuantity(current, itemId, quantity));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((current) => removeCartItem(current, itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode(undefined);
    setCouponError(null);
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    setIsLoading(true);
    setCouponError(null);
    try {
      const result = await validateCoupon(code);
      if (!result.valid) {
        setCouponError("That coupon code isn't valid.");
        return;
      }
      setCouponCode(code.toUpperCase());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(undefined);
    setCouponError(null);
  }, []);

  const cart = useMemo(() => calculateCartTotals(items, { couponCode }), [items, couponCode]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isLoading,
      couponError,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [cart, isLoading, couponError, addItem, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}