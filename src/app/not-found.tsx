import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
        Error 404
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-gray-900 sm:text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 text-gray-600">
        The page you&apos;re looking for may have been moved, renamed, or no
        longer exists.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Back to home
        </Link>
        <Link
          href="/shop"
          className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
