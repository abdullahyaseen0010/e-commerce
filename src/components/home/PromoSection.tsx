import Image from "next/image";
import Link from "next/link";

interface PromoTile {
  eyebrow: string;
  heading: string;
  href: string;
  image: string;
  alt: string;
}

const promos: PromoTile[] = [
  {
    eyebrow: "New edit",
    heading: "The home collection",
    href: "/categories/home",
    image: "/images/banners/promo-home.jpg",
    alt: "Ceramic vases and linen textiles styled on a wooden shelf",
  },
  {
    eyebrow: "Everyday",
    heading: "Carry, considered",
    href: "/categories/bags",
    image: "/images/banners/promo-bags.jpg",
    alt: "A canvas tote and leather pouch resting on a stone ledge",
  },
  {
    eyebrow: "Value",
    heading: "Under $50",
    href: "/shop?max=50",
    image: "/images/banners/promo-value.jpg",
    alt: "A small selection of everyday essentials on a neutral backdrop",
  },
];

function PromoCard({
  promo,
  className = "",
}: {
  promo: PromoTile;
  className?: string;
}) {
  return (
    <Link
      href={promo.href}
      className={`group relative block overflow-hidden bg-[#171717] ${className}`}
    >
      <Image
        src={promo.image}
        alt={promo.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8C989]">
          {promo.eyebrow}
        </p>
        <h3 className="mt-2 font-serif text-2xl text-white md:text-3xl">
          {promo.heading}
        </h3>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white/90">
          Shop now
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function PromoSection() {
  const [large, ...rest] = promos;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="mb-10 border-b border-[#E4E2DC] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A5518]">
          Curated
        </p>
        <h2 className="mt-2 font-serif text-3xl text-[#171717] md:text-4xl">
          Shop by story
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:h-[36rem] md:grid-cols-2 md:grid-rows-2">
        <PromoCard
          promo={large}
          className="aspect-[4/3] md:row-span-2 md:aspect-auto"
        />
        {rest.map((promo) => (
          <PromoCard
            key={promo.href}
            promo={promo}
            className="aspect-[4/3] md:aspect-auto"
          />
        ))}
      </div>
    </section>
  );
}