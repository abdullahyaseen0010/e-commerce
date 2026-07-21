// src/components/product/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { ProductSummary } from "@/types/product";

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];

  const isOnSale =
    product.isOnSale && product.compareAtPrice
      ? product.compareAtPrice > product.price
      : false;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent the parent <Link> from navigating
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-neutral-900 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white">
              New
            </span>
          )}
          {isOnSale && (
            <span className="bg-red-600 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlistClick}
          aria-label={
            inWishlist ? "Remove from wishlist" : "Add to wishlist"
          }
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            className={inWishlist ? "fill-neutral-900 text-neutral-900" : "text-neutral-700"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm text-neutral-900 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-900">
            {formatCurrency(product.price, product.currency)}
          </span>
          {isOnSale && product.compareAtPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatCurrency(product.compareAtPrice, product.currency)}
            </span>
          )}
        </div>

        {product.rating !== undefined && (
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <span>★</span>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}