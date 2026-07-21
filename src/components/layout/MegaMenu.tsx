'use client';

import Link from 'next/link';
import type { NavCategory } from './Header';

interface MegaMenuProps {
  category: NavCategory;
  onClose: () => void;
}

export default function MegaMenu({ category, onClose }: MegaMenuProps) {
  return (
    <div
      role="menu"
      className="absolute left-1/2 top-full z-40 w-[560px] -translate-x-1/2 rounded-b-xl border border-t-0 border-[#E4E1D8] bg-[#FAF8F3] p-6 shadow-xl"
    >
      <div className="grid grid-cols-[1fr_auto] gap-8">
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#9A968C]">
            Shop {category.label}
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {category.subcategories.map((sub) => (
              <li key={sub.slug}>
                <Link
                  href={`/categories/${category.slug}/${sub.slug}`}
                  onClick={onClose}
                  className="block py-1 text-sm text-[#1F1E1C] transition-colors hover:text-[#0F5C55]"
                >
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/categories/${category.slug}`}
            onClick={onClose}
            className="mt-4 inline-block border-t border-dashed border-[#D8D4C8] pt-3 text-sm font-medium text-[#0F5C55]"
          >
            View all {category.label} →
          </Link>
        </div>

        {category.featured && (
          <Link
            href={`/${category.featured.slug}`}
            onClick={onClose}
            className="group block w-40 overflow-hidden rounded-lg border border-[#E4E1D8]"
          >
            <div
              className="h-28 w-full bg-[#EDEAE0] bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${category.featured.image})` }}
            />
            <p className="px-3 py-2 text-xs font-medium text-[#1F1E1C]">{category.featured.label}</p>
          </Link>
        )}
      </div>
    </div>
  );
}