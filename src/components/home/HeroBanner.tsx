import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative bg-[#FAFAF8]">
      <div className="grid grid-cols-1 md:min-h-[32rem] md:grid-cols-12 md:items-stretch">
        {/* Copy */}
        <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:col-span-5 md:px-10 md:py-24 lg:pl-16">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A5518]">
              VISAC — new arrivals
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-[#171717] sm:text-5xl md:text-[3.25rem]">
              Objects worth
              <br className="hidden md:block" /> living with.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-[#5B5E57]">
              Thoughtfully made pieces for the home and everyday carry,
              sourced from independent makers and stocked in limited runs.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[#2F4A3D] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#263D33]"
              >
                Shop new arrivals
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium text-[#171717] underline decoration-[#E4E2DC] underline-offset-4 transition hover:decoration-[#171717]"
              >
                Explore categories
              </Link>
            </div>
          </div>
        </div>

        {/* Image bleeds to the viewport edge — the section's signature move */}
        <div className="relative order-1 aspect-[4/3] w-full md:order-2 md:col-span-7 md:aspect-auto">
          <Image
            src="/images/banners/hero.jpg"
            alt="A sunlit corner of the VISAC studio styled with new-season pieces"
            fill
            priority
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}