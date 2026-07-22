"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import type { Order, OrderStatus } from "@/types/order";

const PAGE_SIZE = 5;

type FilterOption = "all" | OrderStatus;

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError("We couldn't load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  const handleFilterChange = (option: FilterOption) => {
    setFilter(option);
    setCurrentPage(1);
  };

  const filterOptions: { label: string; value: FilterOption }[] = [
    { label: "All", value: "all" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Your Orders</h1>
        <p className="mt-1 text-gray-600">Track, review, and manage your past orders.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilterChange(option.value)}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${
              filter === option.value
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="When you place an order, it will show up here."
          action={
            <Link href="/shop">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-gray-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                  {formatCurrency(order.total)}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/order-tracking/${order.id}`}>
                    <Button variant="outline">Track Order</Button>
                  </Link>
                  <Link href={`/order-confirmation?orderId=${order.id}`}>
                    <Button variant="ghost">View Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
