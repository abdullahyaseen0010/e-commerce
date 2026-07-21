import Link from "next/link";
import { getFeaturedProducts } from "@/lib/api/products";
import ProductGrid from "@/components/product/ProductGrid";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="flex items-end justify-between gap-6 border-b border-[#E4E2DC] pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A5518]">
            Fresh in
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[#171717] md:text-4xl">
            Featured pieces
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden shrink-0 text-sm font-medium text-[#171717] underline decoration-[#E4E2DC] underline-offset-4 transition hover:decoration-[#171717] md:inline-block"
        >
          View all products
        </Link>
      </div>

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-block text-sm font-medium text-[#171717] underline decoration-[#E4E2DC] underline-offset-4 md:hidden"
      >
        View all products
      </Link>
    </section>
  );
}