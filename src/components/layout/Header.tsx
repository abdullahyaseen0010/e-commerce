'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import MegaMenu from './MegaMenu';
import MobileNav from './MobileNav';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

export type NavCategory = {
  label: string;
  slug: string;
  subcategories: { label: string; slug: string }[];
  featured?: { label: string; slug: string; image: string };
};

export const NAV_CATEGORIES: NavCategory[] = [
  {
    label: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { label: 'Headphones', slug: 'headphones' },
      { label: 'Laptops', slug: 'laptops' },
      { label: 'Smart Home', slug: 'smart-home' },
      { label: 'Cameras', slug: 'cameras' },
    ],
    featured: { label: 'New arrivals', slug: 'electronics/new', image: '/images/categories/electronics.jpg' },
  },
  {
    label: 'Fashion',
    slug: 'fashion',
    subcategories: [
      { label: "Women's", slug: 'womens' },
      { label: "Men's", slug: 'mens' },
      { label: 'Footwear', slug: 'footwear' },
      { label: 'Accessories', slug: 'accessories' },
    ],
    featured: { label: 'Season edit', slug: 'fashion/edit', image: '/images/categories/fashion.jpg' },
  },
  {
    label: 'Home & Living',
    slug: 'home-living',
    subcategories: [
      { label: 'Furniture', slug: 'furniture' },
      { label: 'Kitchen', slug: 'kitchen' },
      { label: 'Decor', slug: 'decor' },
      { label: 'Lighting', slug: 'lighting' },
    ],
  },
  {
    label: 'Beauty',
    slug: 'beauty',
    subcategories: [
      { label: 'Skincare', slug: 'skincare' },
      { label: 'Fragrance', slug: 'fragrance' },
      { label: 'Makeup', slug: 'makeup' },
    ],
  },
];

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const wishlistCount = wishlistItems?.length ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F3]/95 backdrop-blur">
      {/* Utility strip */}
      <div className="hidden border-b border-dashed border-[#D8D4C8] bg-[#1F1E1C] py-1.5 text-center font-mono text-[11px] tracking-wide text-[#FAF8F3] sm:block">
        Free shipping on orders over $75 — no code needed
      </div>

      <div className="border-b border-[#E4E1D8]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="-ml-2 inline-flex items-center justify-center rounded-md p-2 text-[#1F1E1C] lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0 font-serif text-[1.4rem] tracking-tight text-[#1F1E1C]">
            VISAC
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:ml-4 lg:flex lg:items-center lg:gap-1"
            onMouseLeave={() => setOpenCategory(null)}
          >
            {NAV_CATEGORIES.map((category) => (
              <div
                key={category.slug}
                className="relative"
                onMouseEnter={() => setOpenCategory(category.slug)}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className={`inline-flex items-center px-3 py-2 text-sm tracking-wide transition-colors ${
                    openCategory === category.slug
                      ? 'text-[#0F5C55]'
                      : 'text-[#1F1E1C] hover:text-[#0F5C55]'
                  }`}
                >
                  {category.label}
                </Link>
                {openCategory === category.slug && (
                  <MegaMenu category={category} onClose={() => setOpenCategory(null)} />
                )}
              </div>
            ))}
          </nav>

          {/* Desktop search */}
          <div className="ml-auto hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-[#E4E1D8] bg-white px-4 py-2 md:flex">
            <Search size={16} strokeWidth={1.75} className="shrink-0 text-[#9A968C]" />
            <input
              type="search"
              placeholder="Search products"
              className="w-full bg-transparent text-sm text-[#1F1E1C] placeholder:text-[#9A968C] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 md:ml-4">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((open) => !open)}
              className="inline-flex items-center justify-center rounded-md p-2 text-[#1F1E1C] hover:text-[#0F5C55] md:hidden"
              aria-label="Toggle search"
            >
              {mobileSearchOpen ? (
                <X size={20} strokeWidth={1.75} />
              ) : (
                <Search size={20} strokeWidth={1.75} />
              )}
            </button>
            <Link
              href="/login"
              className="hidden items-center justify-center rounded-md p-2 text-[#1F1E1C] hover:text-[#0F5C55] sm:inline-flex"
              aria-label="Account"
            >
              <User size={20} strokeWidth={1.75} />
            </Link>
            <Link
              href="/wishlist"
              className="relative hidden items-center justify-center rounded-md p-2 text-[#1F1E1C] hover:text-[#0F5C55] sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.75} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E8785A] px-1 font-mono text-[10px] leading-none text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-[#1F1E1C] hover:text-[#0F5C55]"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0F5C55] px-1 font-mono text-[10px] leading-none text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="border-t border-[#E4E1D8] px-4 py-3 md:hidden">
            <div className="flex items-center gap-2 rounded-full border border-[#E4E1D8] bg-white px-4 py-2">
              <Search size={16} strokeWidth={1.75} className="shrink-0 text-[#9A968C]" />
              <input
                type="search"
                autoFocus
                placeholder="Search products"
                className="w-full bg-transparent text-sm text-[#1F1E1C] placeholder:text-[#9A968C] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        categories={NAV_CATEGORIES}
      />
    </header>
  );
}