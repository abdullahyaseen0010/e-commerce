"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import type { Order } from "@/types/order";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

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
            <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Thank you for your order!</h1>
        <p className="mt-2 text-gray-600">
          Your order <span className="font-medium">#{order.id}</span> has been placed
          successfully.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-gray-200 p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Order Summary</h2>

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

        <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{formatCurrency(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <h2 className="mb-2 text-lg font-medium text-gray-900">Shipping Address</h2>
        <p className="text-gray-600">
          {order.shippingAddress.fullName}
          <br />
          {order.shippingAddress.line1}
          {order.shippingAddress.line2 && (
            <>
              <br />
              {order.shippingAddress.line2}
            </>
          )}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
          {order.shippingAddress.postalCode}
          <br />
          {order.shippingAddress.country}
        </p>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href={`/dashboard/orders/${order.id}`}>
          <Button variant="outline">View Order Details</Button>
        </Link>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
