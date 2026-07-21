// src/components/home/FeaturedProducts.tsx
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types/product";

interface FeaturedProductsProps {
  products: ProductSummary[];
  title?: string;
}

export default function FeaturedProducts({
  products,
  title = "Featured Pieces",
}: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Section header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Curated Selection
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-neutral-900">
            {title}
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:block text-sm uppercase tracking-wide text-neutral-700 hover:text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile "View All" link */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/shop"
          className="inline-block text-sm uppercase tracking-wide text-neutral-700 border-b border-neutral-900 pb-0.5"
        >
          View All
        </Link>
      </div>
    </section>
  );
}