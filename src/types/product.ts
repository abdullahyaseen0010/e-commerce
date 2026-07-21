export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;       // e.g. "Size", "Color"
  value: string;       // e.g. "Large", "Red"
  sku: string;
  priceModifier?: number; // added/subtracted from base price
  stock: number;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number; // for showing discounts
  currency: string; // e.g. "USD"
  images: ProductImage[];
  categoryId: string;
  categorySlug: string;
  tags?: string[];
  variants?: ProductVariant[];
  stock: number;
  rating?: number; // average
  reviewCount?: number;
  reviews?: ProductReview[];
  isFeatured?: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  productCount?: number;
}

export interface ProductFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  inStockOnly?: boolean;
  sortBy?: "price-asc" | "price-desc" | "newest" | "rating" | "featured";
  page?: number;
  pageSize?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
