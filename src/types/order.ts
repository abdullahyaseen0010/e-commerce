import type { Address } from "./user";
import type { CartItem } from "./cart";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem extends Omit<CartItem, "product"> {
  productId: string;
  productName: string;
  productImageUrl: string;
}

export interface PaymentInfo {
  method: "card" | "cod" | "paypal" | "bank_transfer";
  status: "pending" | "paid" | "failed" | "refunded";
  transactionId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  status: OrderStatus;
  payment: PaymentInfo;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount?: number;
  total: number;
  currency: string;
  trackingNumber?: string;
  estimatedDelivery?: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: PaymentInfo["method"];
  couponCode?: string;
}

export interface OrderTrackingEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note?: string;
}
