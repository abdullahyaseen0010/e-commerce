"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Your cart is empty"
          description="Items you add will show up here, ready to check out whenever you are."
          action={
            <Button onClick={() => router.push("/shop")}>
              Browse products
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

      <div className="mt-4 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Your cart
        </h1>
        <span className="text-sm text-zinc-500">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Line items */}
        <div className="lg:col-span-2">
          <ul
            role="list"
            className="divide-y divide-zinc-200 border-y border-zinc-200"
          >
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity) =>
                  updateQuantity(item.id, quantity)
                }
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <Link
              href="/shop"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              ← Continue shopping
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-red-600"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            onCheckout={() => router.push("/checkout")}
          />
        </div>
      </div>
    </div>
  );
}
