"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import type { Order, OrderStatus } from "@/types/order";

const TRACKING_STEPS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const STEP_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("No order ID was provided.");
      return;
    }

    let isMounted = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        if (isMounted) {
          setOrder(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("We couldn't find that order. Please check your order history.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Order not found"
          description={error ?? "Something went wrong while loading your order."}
          action={
            <Button onClick={() => router.push("/dashboard/orders")}>
              View All Orders
            </Button>
          }
        />
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentStepIndex = TRACKING_STEPS.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Track Order <span className="font-normal text-gray-500">#{order.id}</span>
        </h1>
        <p className="text-gray-600">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {isCancelled ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">This order has been cancelled.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {TRACKING_STEPS.map((step, index) => {
              const isComplete = index <= currentStepIndex;
              return (
                <div key={step} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                      isComplete
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isComplete ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p
                    className={`mt-2 text-xs ${
                      isComplete ? "font-medium text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {STEP_LABELS[step]}
                  </p>
                  {index < TRACKING_STEPS.length - 1 && (
                    <div
                      className={`absolute mt-4 h-0.5 w-full translate-x-1/2 ${
                        index < currentStepIndex ? "bg-green-600" : "bg-gray-100"
                      }`}
                      style={{ display: "none" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {order.trackingNumber && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Tracking number:{" "}
              <span className="font-medium text-gray-900">{order.trackingNumber}</span>
            </p>
          )}

          {order.estimatedDelivery && (
            <p className="mt-1 text-center text-sm text-gray-600">
              Estimated delivery:{" "}
              <span className="font-medium text-gray-900">
                {new Date(order.estimatedDelivery).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          )}
        </div>
      )}

      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Order Items</h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/dashboard/orders">
          <Button variant="outline">View All Orders</Button>
        </Link>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
