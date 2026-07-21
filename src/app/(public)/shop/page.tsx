"use client";

import { useMemo, useState } from "react";

// Placeholder shape — swap for the shared Product type from src/types/product.ts
// and pull this list from src/lib/api/products.ts once that layer exists.
type Product = {
  id: string;
  name: string;
  category: "Outerwear" | "Knitwear" | "Bottoms" | "Accessories";
  price: number;
  status: "In stock" | "Low stock" | "Sold out";
};

const products: Product[] = [
  { id: "vc-001", name: "Waxed Field Jacket", category: "Outerwear", price: 320, status: "In stock" },
  { id: "vc-002", name: "Raglan Wool Coat", category: "Outerwear", price: 480, status: "Low stock" },
  { id: "vc-003", name: "Merino Crewneck", category: "Knitwear", price: 145, status: "In stock" },
  { id: "vc-004", name: "Cable Half-Zip", category: "Knitwear", price: 165, status: "In stock" },
  { id: "vc-005", name: "Straight Wool Trouser", category: "Bottoms", price: 210, status: "Sold out" },
  { id: "vc-006", name: "Cotton Twill Chino", category: "Bottoms", price: 150, status: "In stock" },
  { id: "vc-007", name: "Canvas Tote", category: "Accessories", price: 60, status: "In stock" },
  { id: "vc-008", name: "Leather Belt", category: "Accessories", price: 90, status: "Low stock" },
];

const categories = ["All", "Outerwear", "Knitwear", "Bottoms", "Accessories"] as const;

export default function ShopPage() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(
    () => (active === "All" ? products : products.filter((p) => p.category === active)),
    [active]
  );

  return (
    <main className="min-h-screen bg-[#16151A] text-[#F3F1EC]">
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-24 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] text-[#7FA99C] uppercase">
              Shop
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl">
              The full range.
            </h1>
          </div>
          <p className="text-xs tracking-[0.15em] text-[#9A968C] uppercase">
            {filtered.length.toString().padStart(2, "0")} pieces
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-[#34333B] pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-2 text-xs tracking-wide transition-colors ${
                active === cat
                  ? "border-[#3F7D6E] bg-[#3F7D6E]/15 text-[#F3F1EC]"
                  : "border-[#34333B] text-[#9A968C] hover:border-[#7FA99C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product index */}
        <div className="mt-4 divide-y divide-[#34333B]">
          {filtered.map((p, i) => (
            <a
              key={p.id}
              href={`/product/${p.id}`}
              className="group flex items-center justify-between gap-6 py-6 transition-colors hover:bg-[#1F1E24]/60"
            >
              <div className="flex min-w-0 items-baseline gap-6">
                <span className="font-serif text-sm italic text-[#7FA99C]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-serif text-lg tracking-tight group-hover:text-[#F3F1EC] sm:text-xl">
                    {p.name}
                  </p>
                  <p className="mt-1 text-xs tracking-[0.1em] text-[#9A968C] uppercase">
                    {p.category}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-6">
                <span
                  className={`hidden text-xs tracking-wide sm:inline ${
                    p.status === "Sold out"
                      ? "text-[#8A5A52]"
                      : p.status === "Low stock"
                      ? "text-[#C9A24A]"
                      : "text-[#7FA99C]"
                  }`}
                >
                  {p.status}
                </span>
                <span className="font-serif text-lg tracking-tight">
                  ${p.price}
                </span>
              </div>
            </a>
          ))}

          {filtered.length === 0 && (
            <p className="py-16 text-center text-sm text-[#9A968C]">
              Nothing in this category right now.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}