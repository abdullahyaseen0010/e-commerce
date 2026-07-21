import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | VISAC",
  description: "The terms and conditions that govern your use of VISAC.",
};

const LAST_UPDATED = "July 21, 2026";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using VISAC's website, creating an account, or placing an order, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: [
      "You must be at least 18 years old, or the age of majority in your jurisdiction, to create an account or place an order. By using our site, you represent that you meet this requirement.",
    ],
  },
  {
    id: "accounts",
    title: "3. Accounts",
    content: [
      "You're responsible for keeping your account credentials secure and for all activity under your account. Notify us immediately if you suspect unauthorized access.",
      "We may suspend or terminate accounts that violate these terms or that we reasonably believe are being used fraudulently.",
    ],
  },
  {
    id: "orders-pricing",
    title: "4. Orders & Pricing",
    content: [
      "All orders are subject to acceptance and availability. Prices are listed in the currency shown at checkout and may change without notice, but the price you pay is the price confirmed at the time your order is placed.",
      "We reserve the right to cancel or refuse any order, including in cases of pricing errors, suspected fraud, or stock unavailability.",
    ],
  },
  {
    id: "payment",
    title: "5. Payment",
    content: [
      "Payment is processed at checkout through our third-party payment providers. You confirm that any payment information you provide is accurate and that you're authorized to use the payment method.",
    ],
  },
  {
    id: "shipping-delivery",
    title: "6. Shipping & Delivery",
    content: [
      "Estimated delivery times are provided at checkout and are not guaranteed. Risk of loss and title for items pass to you upon delivery to the shipping carrier.",
    ],
  },
  {
    id: "returns-refunds",
    title: "7. Returns & Refunds",
    content: [
      "Eligible items may be returned within the window stated on our returns page, in their original condition. Refunds are issued to the original payment method once the return is received and inspected.",
    ],
  },
  {
    id: "acceptable-use",
    title: "8. Acceptable Use",
    content: [
      "You agree not to misuse our site, including attempting unauthorized access, interfering with normal operation, scraping content without permission, or using the site for unlawful purposes.",
    ],
  },
  {
    id: "intellectual-property",
    title: "9. Intellectual Property",
    content: [
      "All content on this site, including text, graphics, logos, and images, is owned by or licensed to VISAC and is protected by applicable intellectual property laws. You may not reproduce or distribute it without our permission.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "10. Limitation of Liability",
    content: [
      "To the fullest extent permitted by law, VISAC is not liable for any indirect, incidental, or consequential damages arising from your use of the site or products purchased through it.",
    ],
  },
  {
    id: "changes-to-terms",
    title: "11. Changes to These Terms",
    content: [
      "We may update these Terms from time to time. Continued use of the site after changes take effect constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: "governing-law",
    title: "12. Governing Law",
    content: [
      "These Terms are governed by the laws of the jurisdiction in which VISAC operates, without regard to conflict-of-law principles.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact Us",
    content: [
      "If you have questions about these Terms, reach out to us through our contact page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-gray-800">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-800">Terms of Service</li>
        </ol>
      </nav>

      <header className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          These Terms of Service ("Terms") govern your access to and use of
          VISAC's website and services. Please read them carefully before
          using our site.
        </p>
      </header>

      <nav aria-label="Table of contents" className="mb-10">
        <p className="mb-3 text-sm font-medium text-gray-900">
          On this page
        </p>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-gray-600 sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="hover:text-gray-900 hover:underline"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-gray-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 rounded-lg bg-gray-50 p-6 text-sm text-gray-600">
        Questions about these Terms? Visit our{" "}
        <Link href="/contact" className="font-medium text-gray-900 underline">
          contact page
        </Link>{" "}
        and we'll get back to you.
      </footer>
    </main>
  );
}
