// src/app/(public)/page.tsx
import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoSection from "@/components/home/PromoSection";
import { getFeaturedProducts } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "VISAC — Timeless Premium Clothing",
  description:
    "Shop VISAC's premium collection of timeless, refined clothing crafted for the modern wardrobe.",
};

// Server component — fetches data at request time, no client-side loading state needed
export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <>
      <HeroBanner />
      <FeaturedProducts products={featuredProducts} />
      <PromoSection />
    </>
  );
}