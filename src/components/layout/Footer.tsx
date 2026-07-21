import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Electronics', href: '/categories/electronics' },
      { label: 'Fashion', href: '/categories/fashion' },
      { label: 'Home & Living', href: '/categories/home-living' },
      { label: 'Beauty', href: '/categories/beauty' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Order tracking', href: '/order-tracking' },
      { label: 'Returns', href: '/returns' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy policy', href: '/privacy-policy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#E4E1D8] bg-[#FAF8F3]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <span className="font-serif text-xl text-[#1F1E1C]">VISAC</span>
            <p className="mt-3 max-w-xs text-sm text-[#6B6B76]">
              Considered goods for everyday life, picked over and stocked with care.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="text-[#1F1E1C] hover:text-[#0F5C55]">
                <Instagram size={18} strokeWidth={1.75} />
              </a>
              <a href="#" aria-label="Twitter" className="text-[#1F1E1C] hover:text-[#0F5C55]">
                <Twitter size={18} strokeWidth={1.75} />
              </a>
              <a href="#" aria-label="Facebook" className="text-[#1F1E1C] hover:text-[#0F5C55]">
                <Facebook size={18} strokeWidth={1.75} />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#9A968C]">{col.heading}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#1F1E1C] hover:text-[#0F5C55]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#9A968C]">Stay in touch</p>
            <p className="mt-3 text-sm text-[#6B6B76]">Get news on drops and restocks.</p>
            <form className="mt-3 flex overflow-hidden rounded-full border border-[#E4E1D8] bg-white">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-4 py-2 text-sm text-[#1F1E1C] placeholder:text-[#9A968C] focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-[#1F1E1C] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0F5C55]"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-[#D8D4C8]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 font-mono text-[11px] text-[#9A968C] sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} VISAC. All rights reserved.</span>
          <span>Visa · Mastercard · Amex · PayPal</span>
        </div>
      </div>
    </footer>
  );
}