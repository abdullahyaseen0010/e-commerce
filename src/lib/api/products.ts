import type { Product, ProductFilters, ProductListResponse } from "@/types/product";
import { apiClient, mockDelay, USE_MOCK } from "./client";
import { DEFAULT_PAGE_SIZE } from "@/lib/utils/constants";
import productsData from "@/lib/mock-data/products.json";

const MOCK_PRODUCTS = productsData as Product[];

function applyFilters(products: Product[], filters: ProductFilters = {}): Product[] {
  let result = [...products];

  if (filters.categorySlug) {
    result = result.filter((p) => p.categorySlug === filters.categorySlug);
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.tags?.length) {
    result = result.filter((p) => filters.tags!.some((tag) => p.tags?.includes(tag)));
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }

  switch (filters.sortBy) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "rating":
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case "featured":
      result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
      break;
    default:
      break;
  }

  return result;
}

function paginate(products: Product[], page = 1, pageSize = DEFAULT_PAGE_SIZE): ProductListResponse {
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    products: products.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
  if (!USE_MOCK) {
    return apiClient.get<ProductListResponse>("/products", filters as Record<string, string | number | boolean | undefined>);
  }

  await mockDelay();
  const filtered = applyFilters(MOCK_PRODUCTS, filters);
  return paginate(filtered, filters.page, filters.pageSize);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!USE_MOCK) {
    return apiClient.get<Product>(`/products/slug/${slug}`);
  }

  await mockDelay();
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!USE_MOCK) {
    return apiClient.get<Product>(`/products/${id}`);
  }

  await mockDelay();
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (!USE_MOCK) {
    return apiClient.get<Product[]>("/products/featured", { limit });
  }

  await mockDelay();
  return MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!USE_MOCK) {
    return apiClient.get<Product[]>(`/products/${product.id}/related`, { limit });
  }

  await mockDelay();
  return MOCK_PRODUCTS.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, limit);
}

export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
  if (!USE_MOCK) {
    return apiClient.get<Product[]>("/products/search", { q: query, limit });
  }

  await mockDelay();
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      p.description.toLowerCase().includes(needle) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(needle))
  ).slice(0, limit);
}
