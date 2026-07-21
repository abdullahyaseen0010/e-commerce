import type { Cart, CartItem } from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";
import { apiClient, mockDelay, USE_MOCK } from "./client";
import { DEFAULT_CURRENCY, DEFAULT_SHIPPING_COST, FREE_SHIPPING_THRESHOLD, TAX_RATE } from "@/lib/utils/constants";

// Mock coupon table. Swap for a real "/cart/validate-coupon" endpoint once USE_MOCK is false.
const MOCK_COUPONS: Record<string, number> = {
  WELCOME10: 0.1,
  VISAC20: 0.2,
};

function buildCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}::${variantId}` : productId;
}

export function resolveUnitPrice(product: Product, variant?: ProductVariant): number {
  return product.price + (variant?.priceModifier ?? 0);
}

/** Adds a product (with optional variant) to the item list, merging quantity if it's already present. */
export function addCartItem(
  items: CartItem[],
  product: Product,
  quantity: number,
  variant?: ProductVariant
): CartItem[] {
  const id = buildCartItemId(product.id, variant?.id);
  const existing = items.find((item) => item.id === id);

  if (existing) {
    return items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + quantity } : item));
  }

  return [...items, { id, product, variant, quantity, unitPrice: resolveUnitPrice(product, variant) }];
}

export function updateCartItemQuantity(items: CartItem[], itemId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeCartItem(items, itemId);
  return items.map((item) => (item.id === itemId ? { ...item, quantity } : item));
}

export function removeCartItem(items: CartItem[], itemId: string): CartItem[] {
  return items.filter((item) => item.id !== itemId);
}

/** Recomputes subtotal, discount, shipping, and tax for a set of cart items. Pure — safe to call on every render. */
export function calculateCartTotals(
  items: CartItem[],
  options: { couponCode?: string; currency?: string } = {}
): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountRate = options.couponCode ? MOCK_COUPONS[options.couponCode.toUpperCase()] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate * 100) / 100;
  const discountedSubtotal = subtotal - discount;
  const shippingEstimate =
    items.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
  const tax = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
  const total = Math.round((discountedSubtotal + shippingEstimate + tax) * 100) / 100;

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    shippingEstimate,
    tax,
    total,
    currency: options.currency ?? DEFAULT_CURRENCY,
    couponCode: options.couponCode,
  };
}

export async function validateCoupon(code: string): Promise<{ valid: boolean; discountRate?: number }> {
  if (!USE_MOCK) {
    return apiClient.post<{ valid: boolean; discountRate?: number }>("/cart/validate-coupon", { code });
  }

  await mockDelay(200);
  const rate = MOCK_COUPONS[code.toUpperCase()];
  return rate ? { valid: true, discountRate: rate } : { valid: false };
}

/** Persists the cart server-side. No-op in mock mode, where CartContext + localStorage are the source of truth. */
export async function syncCart(items: CartItem[]): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.put<void>("/cart", { items: items.map((i) => ({ id: i.id, quantity: i.quantity })) });
    return;
  }
  await mockDelay(150);
}