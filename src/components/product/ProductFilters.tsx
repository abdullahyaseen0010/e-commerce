"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { ProductColor, ProductFilterState, SortOption } from "@/types/product";
import { cn } from "@/lib/utils";

export interface ProductFiltersProps {
  filters: ProductFilterState;
  onChange: (next: ProductFilterState) => void;
  availableCategories: string[];
  availableColors: ProductColor[];
  availableSizes: string[];
  resultCount?: number;
  /** Controls the mobile slide-in drawer; ignored on desktop, where the panel is static. */
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const PRICE_BANDS: { label: string; range: [number, number] }[] = [
  { label: "Under $150", range: [0, 150] },
  { label: "$150 – $350", range: [150, 350] },
  { label: "$350 – $600", range: [350, 600] },
  { label: "$600+", range: [600, 2000] },
];

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function ProductFilters({
  filters,
  onChange,
  availableCategories,
  availableColors,
  availableSizes,
  resultCount,
  isOpen = true,
  onClose,
  className,
}: ProductFiltersProps) {
  const activeCount =
    filters.categories.length + filters.colors.length + filters.sizes.length;

  useEffect(() => {
    if (!onClose) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleClearAll = () => {
    onChange({ ...filters, categories: [], colors: [], sizes: [], priceRange: [0, 2000] });
  };

  const panel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-stone-light pb-4">
        <div>
          <h2 className="text-sm uppercase tracking-[0.15em] text-ink">Filter</h2>
          {typeof resultCount === "number" && (
            <p className="mt-1 text-xs text-stone">{resultCount} results</p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-8 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 divide-y divide-stone-light overflow-y-auto">
        {/* Sort */}
        <fieldset className="py-5">
          <legend className="mb-3 text-xs uppercase tracking-[0.15em] text-stone">Sort by</legend>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortOption })}
            className="w-full border border-stone-light bg-paper px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Category */}
        {availableCategories.length > 0 && (
          <fieldset className="py-5">
            <legend className="mb-3 text-xs uppercase tracking-[0.15em] text-stone">Category</legend>
            <div className="flex flex-col gap-2.5">
              {availableCategories.map((category) => (
                <label key={category} className="flex items-center gap-2.5 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() =>
                      onChange({ ...filters, categories: toggleValue(filters.categories, category) })
                    }
                    className="h-4 w-4 border-stone-light accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* Color */}
        {availableColors.length > 0 && (
          <fieldset className="py-5">
            <legend className="mb-3 text-xs uppercase tracking-[0.15em] text-stone">Color</legend>
            <div className="flex flex-wrap gap-2.5">
              {availableColors.map((color) => {
                const isActive = filters.colors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    aria-pressed={isActive}
                    aria-label={color.name}
                    onClick={() => onChange({ ...filters, colors: toggleValue(filters.colors, color.name) })}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isActive ? "border-ink" : "border-transparent ring-1 ring-stone-light"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Size */}
        {availableSizes.length > 0 && (
          <fieldset className="py-5">
            <legend className="mb-3 text-xs uppercase tracking-[0.15em] text-stone">Size</legend>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const isActive = filters.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onChange({ ...filters, sizes: toggleValue(filters.sizes, size) })}
                    className={cn(
                      "min-w-[2.75rem] border px-2.5 py-1.5 text-xs uppercase tracking-[0.05em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isActive
                        ? "border-ink bg-ink text-bone"
                        : "border-stone-light text-ink hover:border-stone"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Price */}
        <fieldset className="py-5">
          <legend className="mb-3 text-xs uppercase tracking-[0.15em] text-stone">Price</legend>
          <div className="flex flex-col gap-2.5">
            {PRICE_BANDS.map((band) => {
              const isActive =
                filters.priceRange[0] === band.range[0] && filters.priceRange[1] === band.range[1];
              return (
                <label key={band.label} className="flex items-center gap-2.5 text-sm text-ink">
                  <input
                    type="radio"
                    name="price-band"
                    checked={isActive}
                    onChange={() => onChange({ ...filters, priceRange: band.range })}
                    className="h-4 w-4 border-stone-light accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  {band.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {activeCount > 0 && (
        <div className="border-t border-stone-light pt-4">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs uppercase tracking-[0.15em] text-stone underline-offset-4 hover:text-ink hover:underline"
          >
            Clear all ({activeCount})
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: static sidebar */}
      <aside className={cn("hidden w-64 shrink-0 md:block", className)}>{panel}</aside>

      {/* Mobile: slide-in drawer */}
      {onClose && (
        <div
          className={cn(
            "fixed inset-0 z-50 md:hidden",
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          )}
          aria-hidden={!isOpen}
        >
          <div
            className={cn(
              "absolute inset-0 bg-ink/40 transition-opacity",
              isOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={onClose}
          />
          <div
            className={cn(
              "absolute inset-y-0 right-0 w-[85%] max-w-sm bg-bone p-6 shadow-xl transition-transform duration-300",
              isOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            {panel}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductFilters;