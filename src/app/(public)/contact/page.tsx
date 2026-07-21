"use client";

import { useState, type FormEvent } from "react";

const topics = ["Order support", "Wholesale", "Press", "Something else"];

export default function ContactPage() {
  const [topic, setTopic] = useState(topics[0]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    // Placeholder — wire up to lib/api once the backend exists.
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <main className="min-h-screen bg-[#16151A] text-[#F3F1EC]">
      <div className="mx-auto grid max-w-5xl gap-16 px-6 pt-28 pb-24 sm:px-10 md:grid-cols-2 md:gap-10">
        {/* Left: heading + direct channels */}
        <div>
          <p className="text-xs tracking-[0.3em] text-[#7FA99C] uppercase">
            Contact
          </p>
          <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            Tell us
            <br />
            <span className="italic text-[#9A968C]">what's wrong,</span>
            <br />
            we'll fix it.
          </h1>

          <div className="mt-12 space-y-6 text-sm">
            <div>
              <p className="text-[#9A968C]">Email</p>
              <p className="mt-1">hello@visac.co</p>
            </div>
            <div>
              <p className="text-[#9A968C]">Response time</p>
              <p className="mt-1">Within one business day</p>
            </div>
            <div>
              <p className="text-[#9A968C]">Studio</p>
              <p className="mt-1">Open by appointment only</p>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div>
          {submitted ? (
            <div className="rounded border border-[#34333B] bg-[#1F1E24] p-8">
              <p className="font-serif text-xl italic">Message sent.</p>
              <p className="mt-2 text-sm text-[#9A968C]">
                We've got it — expect a reply within a business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs tracking-[0.15em] text-[#9A968C] uppercase">
                  What's this about
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`rounded-full border px-4 py-2 text-xs tracking-wide transition-colors ${
                        topic === t
                          ? "border-[#3F7D6E] bg-[#3F7D6E]/15 text-[#F3F1EC]"
                          : "border-[#34333B] text-[#9A968C] hover:border-[#7FA99C]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="text-xs tracking-[0.15em] text-[#9A968C] uppercase"
                >
                  Name
                </label>
                <input
                  id="name"
                  required
                  className="mt-3 w-full border-b border-[#34333B] bg-transparent py-2 text-sm outline-none focus:border-[#7FA99C]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-xs tracking-[0.15em] text-[#9A968C] uppercase"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-3 w-full border-b border-[#34333B] bg-transparent py-2 text-sm outline-none focus:border-[#7FA99C]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-xs tracking-[0.15em] text-[#9A968C] uppercase"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="mt-3 w-full resize-none border-b border-[#34333B] bg-transparent py-2 text-sm outline-none focus:border-[#7FA99C]"
                  placeholder="What's going on?"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="mt-4 w-full rounded bg-[#F3F1EC] py-3 text-sm font-medium tracking-wide text-[#16151A] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}