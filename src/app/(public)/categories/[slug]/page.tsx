import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategoryBySlug, getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";

const PRODUCTS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

// Pre-render known categories at build time; new ones fall back to on-demand rendering.
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | VISAC" };
  }

  return {
    title: `${category.name} | VISAC`,
    description:
      category.description ?? `Shop the ${category.name} collection at VISAC.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort, page, minPrice, maxPrice } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const currentPage = Math.max(1, Number(page) || 1);
  const sortValue: SortValue = SORT_OPTIONS.some((o) => o.value === sort)
    ? (sort as SortValue)
    : "newest";

  const { items: products, total } = await getProducts({
    categoryId: category.id,
    sort: sortValue,
    page: currentPage,
    perPage: PRODUCTS_PER_PAGE,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));

  const buildQuery = (overrides: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams({
      ...(sort ? { sort } : {}),
      ...(minPrice ? { minPrice } : {}),
      ...(maxPrice ? { maxPrice } : {}),
      ...(page ? { page } : {}),
    });
    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    return `?${next.toString()}`;
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />

      <header className="mt-6 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-base text-gray-600">
            {category.description}
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <ProductFilters
            categoryId={category.id}
            selectedMinPrice={minPrice ? Number(minPrice) : undefined}
            selectedMaxPrice={maxPrice ? Number(maxPrice) : undefined}
          />
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Sort by
              <select
                defaultValue={sortValue}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                onChange={(e) => {
                  window.location.href = buildQuery({
                    sort: e.target.value,
                    page: undefined,
                  });
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  buildHref={(pageNumber) => buildQuery({ page: pageNumber })}
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or check back soon for new arrivals in this category."
              action={{ label: "Clear filters", href: `/categories/${slug}` }}
            />
          )}
        </section>
      </div>
    </main>
  );
}
