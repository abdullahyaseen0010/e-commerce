import type { Product, ProductVariant } from "./product";

export interface CartItem {
  id: string;            // unique cart line id (product + variant combo)
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;     // resolved price at time of add (base + variant modifier)
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount?: number;
  shippingEstimate?: number;
  tax?: number;
  total: number;
  currency: string;
  couponCode?: string;
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}
