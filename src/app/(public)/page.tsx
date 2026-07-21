// src/app/(public)/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoSection from "@/components/home/PromoSection";
import CategoryCard from "@/components/category/CategoryCard";

import { getFeaturedProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

export const metadata: Metadata = {
  title: "VISAC | Shop the Latest Collection",
  description:
    "Discover VISAC's curated collection — everyday essentials and standout pieces, shipped fast.",
};

export default async function HomePage() {
  // Runs on the server. Both calls hit lib/api/*, which wraps
  // lib/mock-data/*.json for now and can swap to a real backend later
  // without this page changing.
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <main>
      <HeroBanner
        heading="New arrivals, made to last"
        subheading="Shop the season's essentials, curated for everyday wear."
        ctaLabel="Shop now"
        ctaHref="/shop"
        imageSrc="/images/banners/home-hero.jpg"
      />

      <section className="container py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-neutral-900">
            Shop by category
          </h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            Categories are on their way — check back soon.
          </p>
        )}
      </section>

      <FeaturedProducts products={featuredProducts} />

      <PromoSection
        heading="Free shipping over $75"
        body="Fast, reliable delivery on every order — no code needed."
      />
    </main>
  );
}