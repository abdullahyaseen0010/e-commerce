import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, getRelatedProducts } from "@/lib/api/products";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import ProductGallery from "@/components/product/ProductGallery";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AddToCartForm from "@/components/product/AddToCartForm";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product Not Found | VISAC" };
  }

  return {
    title: `${product.name} | VISAC`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/categories/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {typeof product.rating === "number" && (
            <p className="mt-2 text-sm text-gray-500">
              {product.rating.toFixed(1)} ★ ({product.reviewCount ?? 0} reviews)
            </p>
          )}

          <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <AddToCartForm product={product} />
          </div>

          <dl className="mt-8 space-y-2 border-t border-gray-200 pt-6 text-sm text-gray-500">
            <div className="flex justify-between">
              <dt>Availability</dt>
              <dd>
                {product.stock > 0 ? `In stock (${product.stock} left)` : "Out of stock"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>SKU</dt>
              <dd>{product.sku}</dd>
            </div>
          </dl>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-gray-900">You may also like</h2>
          <div className="mt-6">
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}
    </main>
  );
}
