import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — VISAC",
  description:
    "VISAC is built on restraint: fewer pieces, made properly, meant to last.",
};

const principles = [
  {
    mark: "I",
    title: "Fewer, better",
    body: "We release in small, considered drops instead of chasing every season. Every piece earns its place in the range before it ships.",
  },
  {
    mark: "II",
    title: "Made to be worn out",
    body: "Materials are chosen for how they age, not just how they photograph. A VISAC piece should look better after a hundred wears than it did on day one.",
  },
  {
    mark: "III",
    title: "No noise",
    body: "No logos shouting from across the room. The construction does the talking — the label is on the inside, where it belongs.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#16151A] text-[#F3F1EC]">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-28 pb-20 sm:px-10">
        <p className="text-xs tracking-[0.3em] text-[#7FA99C] uppercase">
          About VISAC
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight sm:text-6xl">
          We make the things
          <br />
          <span className="italic text-[#9A968C]">you stop noticing</span>
          <br />
          because they never let you down.
        </h1>
        <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-[#B5B2A9]">
          VISAC started in 2019 as a two-person workshop with a simple
          complaint: most clothing is designed to sell once, not to be worn
          for a decade. Everything we've built since is an answer to that.
        </p>
      </section>

      <div className="mx-auto h-px max-w-5xl bg-[#34333B]" />

      {/* Principles */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10">
        <div className="grid gap-14 sm:grid-cols-3 sm:gap-8">
          {principles.map((p) => (
            <div key={p.mark}>
              <span className="font-serif text-sm italic text-[#7FA99C]">
                {p.mark}
              </span>
              <h2 className="mt-4 font-serif text-xl tracking-tight">
                {p.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#9A968C]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto h-px max-w-5xl bg-[#34333B]" />

      {/* Pull quote */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <blockquote className="font-serif text-2xl italic leading-snug tracking-tight sm:text-3xl">
          &ldquo;Good design disappears into the way you actually live. We're
          not trying to be remembered — we're trying to be relied on.&rdquo;
        </blockquote>
        <p className="mt-6 text-xs tracking-[0.3em] text-[#7FA99C] uppercase">
          Founders, VISAC
        </p>
      </section>

      {/* Facts strip */}
      <section className="border-t border-[#34333B]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 px-6 py-16 sm:grid-cols-4 sm:px-10">
          {[
            ["2019", "Founded"],
            ["4", "Drops per year"],
            ["12", "Countries shipped to"],
            ["0", "Logos on the outside"],
          ].map(([stat, label]) => (
            <div key={label}>
              <p className="font-serif text-3xl tracking-tight">{stat}</p>
              <p className="mt-1 text-xs tracking-[0.15em] text-[#9A968C] uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}