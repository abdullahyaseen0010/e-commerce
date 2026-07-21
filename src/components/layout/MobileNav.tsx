'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, User, Heart, ShoppingBag } from 'lucide-react';
import type { NavCategory } from './Header';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  categories: NavCategory[];
}

export default function MobileNav({ isOpen, onClose, categories }: MobileNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className={`fixed inset-0 z-[60] lg:hidden ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#1F1E1C]/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        className={`absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-[#FAF8F3] shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-dashed border-[#D8D4C8] px-5 py-4">
          <span className="font-serif text-lg text-[#1F1E1C]">VISAC</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#1F1E1C]"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {categories.map((category) => (
            <div key={category.slug} className="border-b border-[#EDEAE0]">
              <button
                type="button"
                onClick={() => setExpanded(expanded === category.slug ? null : category.slug)}
                className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-medium text-[#1F1E1C]"
              >
                {category.label}
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`text-[#9A968C] transition-transform ${
                    expanded === category.slug ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expanded === category.slug && (
                <ul className="pb-2 pl-3">
                  {category.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/categories/${category.slug}/${sub.slug}`}
                        onClick={onClose}
                        className="block px-3 py-2 text-sm text-[#6B6B76] hover:text-[#0F5C55]"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center justify-around border-t border-dashed border-[#D8D4C8] px-5 py-4">
          <Link href="/login" onClick={onClose} className="flex flex-col items-center gap-1 text-xs text-[#1F1E1C]">
            <User size={20} strokeWidth={1.75} />
            Account
          </Link>
          <Link href="/wishlist" onClick={onClose} className="flex flex-col items-center gap-1 text-xs text-[#1F1E1C]">
            <Heart size={20} strokeWidth={1.75} />
            Wishlist
          </Link>
          <Link href="/cart" onClick={onClose} className="flex flex-col items-center gap-1 text-xs text-[#1F1E1C]">
            <ShoppingBag size={20} strokeWidth={1.75} />
            Cart
          </Link>
        </div>
      </div>
    </div>
  );
}