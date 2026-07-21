"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/types/product";
import type { WishlistItem } from "@/types/cart";

const WISHLIST_STORAGE_KEY = "visac:wishlist-items";

export interface WishlistContextValue {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function loadStoredItems(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(loadStoredItems());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  const toggleItem = useCallback((product: Product) => {
    setItems((current) => {
      const exists = current.some((item) => item.product.id === product.id);
      if (exists) return current.filter((item) => item.product.id !== product.id);
      return [...current, { id: `wish-${product.id}`, product, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, isInWishlist, toggleItem, removeItem, clearWishlist }),
    [items, isInWishlist, toggleItem, removeItem, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}