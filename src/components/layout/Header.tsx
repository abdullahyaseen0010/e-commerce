// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      {/* Top bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl tracking-widest font-semibold"
          >
            VISAC
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-wide text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="p-2 hover:text-neutral-500 transition-colors"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href={isLoading ? "#" : isAuthenticated ? "/profile" : "/login"}
              className="p-2 hover:text-neutral-500 transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            <Link
              href="/wishlist"
              className="relative p-2 hover:text-neutral-500 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 hover:text-neutral-500 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Expandable search bar */}
        {isSearchOpen && (
          <div className="border-t border-neutral-200 py-4">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-md border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile nav drawer */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-neutral-200 bg-white">
          <ul className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-3 text-sm uppercase tracking-wide text-neutral-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}