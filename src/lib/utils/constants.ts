import type { OrderStatus } from "@/types/order";

export const APP_NAME = "VISAC";

export const DEFAULT_CURRENCY = "USD";
export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP"] as const;

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 48;

export const FREE_SHIPPING_THRESHOLD = 75; // in DEFAULT_CURRENCY units
export const DEFAULT_SHIPPING_COST = 5.99;
export const TAX_RATE = 0.08; // flat estimate; swap for real tax service later

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

// Tailwind-friendly badge tone per status, for order/cart UI
export const ORDER_STATUS_TONE: Record<OrderStatus, "gray" | "blue" | "amber" | "green" | "red"> = {
  pending: "gray",
  confirmed: "blue",
  processing: "amber",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
  refunded: "red",
};

export const ROUTES = {
  home: "/",
  shop: "/shop",
  category: (slug: string) => `/categories/${slug}`,
  product: (id: string) => `/product/${id}`,
  cart: "/cart",
  checkout: "/checkout",
  orderConfirmation: "/order-confirmation",
  orderTracking: (id: string) => `/order-tracking/${id}`,
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  profile: "/profile",
  addresses: "/addresses",
  orders: "/orders",
  wishlist: "/wishlist",
  notifications: "/notifications",
} as const;

export const PASSWORD_MIN_LENGTH = 8;
