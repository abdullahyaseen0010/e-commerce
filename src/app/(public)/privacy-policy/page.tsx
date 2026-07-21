import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | VISAC",
  description:
    "Learn how VISAC collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "July 21, 2026";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      "We collect information you give us directly, such as your name, email address, shipping address, phone number, and payment details when you create an account, place an order, or contact support.",
      "We also collect information automatically, including your IP address, browser type, device information, and how you interact with our site, through cookies and similar technologies.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    content: [
      "We use your information to process orders, deliver products, manage your account, and provide customer support.",
      "We may also use it to send order updates, respond to inquiries, personalize your shopping experience, and, where you've opted in, send marketing communications.",
    ],
  },
  {
    id: "sharing-your-information",
    title: "3. How We Share Your Information",
    content: [
      "We share information with service providers who help us operate our business, such as payment processors, shipping carriers, and hosting providers, only to the extent necessary for them to perform their services.",
      "We do not sell your personal information. We may disclose information if required by law or to protect the rights, property, or safety of VISAC, our customers, or others.",
    ],
  },
  {
    id: "cookies",
    title: "4. Cookies & Tracking",
    content: [
      "We use cookies and similar technologies to keep you signed in, remember items in your cart, and understand how our site is used.",
      "You can control cookies through your browser settings, though disabling them may affect certain site features, such as your cart or saved preferences.",
    ],
  },
  {
    id: "data-retention",
    title: "5. Data Retention",
    content: [
      "We retain your information for as long as your account is active or as needed to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.",
    ],
  },
  {
    id: "your-rights",
    title: "6. Your Rights & Choices",
    content: [
      "Depending on where you live, you may have the right to access, correct, delete, or export your personal information, and to opt out of marketing communications at any time.",
      "To exercise these rights, contact us using the details below or manage your preferences from your account settings.",
    ],
  },
  {
    id: "data-security",
    title: "7. Data Security",
    content: [
      "We use reasonable administrative, technical, and physical safeguards to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    id: "childrens-privacy",
    title: "8. Children's Privacy",
    content: [
      "Our services are not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has provided us information, please contact us so we can remove it.",
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: [
      "We may update this policy from time to time. Material changes will be reflected by an updated \"last updated\" date on this page, and we encourage you to review it periodically.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: [
      "If you have questions about this Privacy Policy or how we handle your information, reach out to us through our contact page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
          <li className="text-gray-800">Privacy Policy</li>
        </ol>
      </nav>

      <header className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          This Privacy Policy explains how VISAC ("we," "us," or "our")
          collects, uses, and protects your personal information when you
          visit our site or make a purchase.
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
        Questions about this policy? Visit our{" "}
        <Link href="/contact" className="font-medium text-gray-900 underline">
          contact page
        </Link>{" "}
        and we'll get back to you.
      </footer>
    </main>
  );
}
