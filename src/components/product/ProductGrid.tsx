"use client";

import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  /** Shown while fetching the next page; keeps existing products on screen. */
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  wishlistedIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  /** Called from the empty state's "clear filters" action, if provided. */
  onResetFilters?: () => void;
  className?: string;
  /** Number of skeleton tiles to render while `isLoading` is true. */
  skeletonCount?: number;
}

const GRID_CLASSES = "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function ProductGrid({
  products,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  wishlistedIds = [],
  onToggleWishlist,
  onResetFilters,
  className,
  skeletonCount = 8,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn(GRID_CLASSES, className)} aria-busy="true" aria-live="polite">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.15em] text-stone">No pieces match your selection</p>
        <p className="max-w-sm text-sm text-stone">
          Try widening your filters or clearing them to see the full collection.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-2 border-b border-ink pb-0.5 text-sm text-ink transition-colors hover:border-stone hover:text-stone"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={cn(GRID_CLASSES, className)}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistedIds.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
        {isLoadingMore &&
          Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={`more-${i}`} />)}
      </div>

      {hasMore && onLoadMore && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="border border-ink px-8 py-3 text-xs uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-bone disabled:opacity-50"
          >
            {isLoadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="aspect-[4/5] w-full animate-pulse bg-stone-light/50" />
      <div className="h-3 w-1/3 animate-pulse bg-stone-light/50" />
      <div className="h-4 w-2/3 animate-pulse bg-stone-light/50" />
      <div className="h-3 w-1/4 animate-pulse bg-stone-light/50" />
    </div>
  );
}

export default ProductGrid;