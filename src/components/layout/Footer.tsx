// src/components/layout/Footer.tsx
import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

const FOOTER_LINKS = {
  shop: [
    { label: "New Arrivals", href: "/shop?sortBy=newest" },
    { label: "Best Sellers", href: "/shop?sortBy=popular" },
    { label: "Categories", href: "/categories" },
    { label: "Sale", href: "/shop?onSale=true" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Order Tracking", href: "/order-tracking" },
    { label: "Shipping & Returns", href: "/faq#shipping" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-serif text-xl tracking-widest font-semibold"
            >
              VISAC
            </Link>
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
              Timeless, refined clothing crafted for the modern wardrobe.
            </p>
            <div className="mt-4 flex gap-4">
              
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <Instagram size={18} />
              </a>
              
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <Facebook size={18} />
              </a>
              
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />

          {/* Support links */}
          <FooterColumn title="Support" links={FOOTER_LINKS.support} />

          {/* Company links */}
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-neutral-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {year} VISAC. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-neutral-500">
            <Link href="/privacy-policy" className="hover:text-neutral-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Small internal component — keeps the three link columns from repeating markup
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}