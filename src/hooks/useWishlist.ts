"use client";

import { useContext } from "react";
import { WishlistContext, type WishlistContextValue } from "@/context/WishlistContext";

/**
 * Access wishlist state and actions. Must be used within a <WishlistProvider>
 * (mounted in src/app/layout.tsx).
 */
export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider.");
  }
  return context;
}