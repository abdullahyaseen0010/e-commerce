"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { cn, formatPrice, discountPercent } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  className?: string;
  /** Image sizes hint passed to next/image; tune per grid layout. */
  sizes?: string;
}

export function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: ProductCardProps) {
  const secondaryImage = product.images[1];
  const percentOff = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper">
        <Link
          href={`/product/${product.slug}`}
          aria-label={product.name}
          className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            fill
            sizes={sizes}
            className={cn(
              "object-cover transition-opacity duration-500",
              secondaryImage && "group-hover:opacity-0"
            )}
            priority={false}
          />
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt}
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Status badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-ink px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-bone">
              New
            </span>
          )}
          {percentOff > 0 && !product.isSoldOut && (
            <span className="bg-brick px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-bone">
              −{percentOff}%
            </span>
          )}
        </div>

        {/* Wishlist toggle */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            aria-pressed={isWishlisted}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-bone/90 opacity-0 transition-opacity duration-200 hover:bg-bone focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group-hover:opacity-100",
              isWishlisted && "opacity-100"
            )}
          >
            <Heart
              className={cn("h-4 w-4 stroke-ink", isWishlisted && "fill-accent stroke-accent")}
            />
          </button>
        )}

        {/* Sold out overlay */}
        {product.isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 bg-bone/95 py-2 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-ink">
            Sold out
          </div>
        )}
      </div>

      <Link href={`/product/${product.slug}`} className="mt-3 flex flex-col gap-1">
        {product.category && (
          <span className="text-[11px] uppercase tracking-[0.1em] text-stone">
            {product.category}
          </span>
        )}
        <span
          className="w-fit bg-gradient-to-r from-ink to-ink bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 text-sm text-ink transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]"
        >
          {product.name}
        </span>
        <span className="flex items-baseline gap-2 text-sm">
          <span className={cn("text-ink", percentOff > 0 && "text-brick")}>
            {formatPrice(product.price, product.currency)}
          </span>
          {product.compareAtPrice && (
            <span className="text-stone line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
        </span>
      </Link>

      {product.colors.length > 1 && (
        <div className="mt-2 flex items-center gap-1.5" aria-hidden="true">
          {product.colors.slice(0, 5).map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="h-3 w-3 rounded-full border border-stone-light"
              style={{ backgroundColor: color.hex }}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="text-[11px] text-stone">+{product.colors.length - 5}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductCard;