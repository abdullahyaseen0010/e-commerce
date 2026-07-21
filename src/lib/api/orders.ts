import type { Order, OrderItem, CheckoutPayload, OrderTrackingEvent, OrderStatus } from "@/types/order";
import type { Cart } from "@/types/cart";
import type { Address } from "@/types/user";
import { apiClient, mockDelay, USE_MOCK } from "./client";
import ordersData from "@/lib/mock-data/orders.json";

// Mutable copy so createOrder() can append new mock orders during the session.
let mockOrders: Order[] = [...(ordersData as Order[])];

const STATUS_SEQUENCE: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

function generateOrderNumber(): string {
  return `VS-${Math.floor(100000 + Math.random() * 899999)}`;
}

export async function getOrders(userId: string): Promise<Order[]> {
  if (!USE_MOCK) {
    return apiClient.get<Order[]>("/orders", { userId });
  }

  await mockDelay();
  return mockOrders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!USE_MOCK) {
    return apiClient.get<Order>(`/orders/${id}`);
  }

  await mockDelay();
  return mockOrders.find((o) => o.id === id) ?? null;
}

export async function createOrder(
  userId: string,
  cart: Cart,
  shippingAddress: Address,
  checkout: CheckoutPayload,
  billingAddress?: Address
): Promise<Order> {
  if (!USE_MOCK) {
    return apiClient.post<Order>("/orders", { userId, cart, shippingAddress, billingAddress, checkout });
  }

  await mockDelay(600);

  const items: OrderItem[] = cart.items.map((item) => ({
    id: item.id,
    productId: item.product.id,
    productName: item.product.name,
    productImageUrl: item.product.images.find((img) => img.isPrimary)?.url ?? item.product.images[0]?.url ?? "",
    variant: item.variant,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  const now = new Date().toISOString();
  const order: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: generateOrderNumber(),
    userId,
    items,
    shippingAddress,
    billingAddress,
    status: "pending",
    payment: {
      method: checkout.paymentMethod,
      status: checkout.paymentMethod === "cod" ? "pending" : "paid",
    },
    subtotal: cart.subtotal,
    shippingCost: cart.shippingEstimate ?? 0,
    tax: cart.tax ?? 0,
    discount: cart.discount,
    total: cart.total,
    currency: cart.currency,
    createdAt: now,
    updatedAt: now,
  };

  mockOrders = [order, ...mockOrders];
  return order;
}

export async function trackOrder(id: string): Promise<OrderTrackingEvent[]> {
  if (!USE_MOCK) {
    return apiClient.get<OrderTrackingEvent[]>(`/orders/${id}/tracking`);
  }

  await mockDelay();
  const order = mockOrders.find((o) => o.id === id);
  if (!order) return [];

  if (order.status === "cancelled" || order.status === "refunded") {
    return [
      {
        status: order.status,
        label: order.status === "cancelled" ? "Order cancelled" : "Order refunded",
        timestamp: order.updatedAt,
      },
    ];
  }

  const currentIndex = STATUS_SEQUENCE.indexOf(order.status);
  return STATUS_SEQUENCE.slice(0, currentIndex + 1).map((status, index) => ({
    status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
    timestamp: index === currentIndex ? order.updatedAt : order.createdAt,
  }));
}