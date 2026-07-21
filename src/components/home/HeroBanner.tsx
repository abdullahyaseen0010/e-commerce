// src/components/home/HeroBanner.tsx
import Link from "next/link";
import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-neutral-900">
      {/* Background image */}
      <Image
        src="/images/banners/hero-main.jpg"
        alt="VISAC premium clothing collection"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-80"
      />

      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end sm:items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-0">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">
              New Season
            </p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              Timeless Style,
              <br />
              Refined for Today
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/90 max-w-md">
              Discover VISAC&apos;s premium collection — crafted for those who
              value quality and understated elegance.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-block bg-white px-8 py-3 text-sm uppercase tracking-wide text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="inline-block border border-white px-8 py-3 text-sm uppercase tracking-wide text-white hover:bg-white hover:text-neutral-900 transition-colors"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}