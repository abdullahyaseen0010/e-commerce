"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Domestic orders arrive in 3–5 business days. International orders typically take 7–14 business days depending on customs in your country.",
  },
  {
    q: "What's your return policy?",
    a: "Unworn items in original condition can be returned within 30 days of delivery for a full refund. Start a return from your orders page and we'll email a prepaid label.",
  },
  {
    q: "Do you restock sold-out items?",
    a: "Rarely. We produce in small batches, and most pieces don't come back once they sell through. Join the waitlist on a product page and we'll email you if more is made.",
  },
  {
    q: "How do I find my size?",
    a: "Every product page has a size guide with measurements, not just S/M/L. If you're between sizes, our support team can advise based on the specific garment.",
  },
  {
    q: "Where are your pieces made?",
    a: "In small factories in Portugal and Japan that we've worked with since 2019. We visit each one at least once a year.",
  },
  {
    q: "Can I change or cancel an order?",
    a: "If it hasn't shipped yet, yes — contact us as soon as possible and we'll do what we can. Once it's left the warehouse we're no longer able to intercept it.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#16151A] text-[#F3F1EC]">
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-24 sm:px-10">
        <p className="text-xs tracking-[0.3em] text-[#7FA99C] uppercase">
          Support
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl">
          Questions, answered.
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-[#9A968C]">
          Can't find what you're after? Reach out on the contact page — a
          person reads every message.
        </p>

        <div className="mt-16 border-t border-[#34333B]">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="border-b border-[#34333B]">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-start gap-6 py-6 text-left"
                  aria-expanded={open}
                >
                  <span className="font-serif text-sm italic text-[#7FA99C]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-serif text-lg tracking-tight sm:text-xl">
                    {item.q}
                  </span>
                  <span
                    className={`mt-1 text-xl text-[#9A968C] transition-transform ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {open && (
                  <p className="pb-6 pl-[2.6rem] pr-8 text-sm leading-relaxed text-[#9A968C]">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
