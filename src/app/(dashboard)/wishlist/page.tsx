"use client";

import { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

export default function WishlistPage() {
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingId(productId);
      await addToCart(productId, 1);
    } finally {
      setAddingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Wishlist</h1>
        <p className="mt-1 text-gray-600">Products you've saved for later.</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save products you're interested in so you can find them easily later."
          action={
            <Link href="/shop">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-lg border border-gray-200 p-4"
            >
              <Link
                href={`/product/${product.id}`}
                className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
              >
                {product.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/product/${product.id}`}
                  className="font-medium text-gray-900 hover:underline"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-gray-600">
                  {formatCurrency(product.price)}
                </p>

                <div className="mt-auto flex gap-2 pt-3">
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingId === product.id}
                  >
                    {addingId === product.id ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemove(product.id)}
                    disabled={removingId === product.id}
                  >
                    {removingId === product.id ? "Removing..." : "Remove"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
