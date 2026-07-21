import type { Category } from "@/types/product";
import { apiClient, mockDelay, USE_MOCK } from "./client";
import categoriesData from "@/lib/mock-data/categories.json";

const MOCK_CATEGORIES = categoriesData as Category[];

export async function getCategories(): Promise<Category[]> {
  if (!USE_MOCK) {
    return apiClient.get<Category[]>("/categories");
  }

  await mockDelay();
  return MOCK_CATEGORIES;
}

export async function getTopLevelCategories(): Promise<Category[]> {
  if (!USE_MOCK) {
    return apiClient.get<Category[]>("/categories", { parentId: "" });
  }

  await mockDelay();
  return MOCK_CATEGORIES.filter((c) => !c.parentId);
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  if (!USE_MOCK) {
    return apiClient.get<Category[]>("/categories", { parentId });
  }

  await mockDelay();
  return MOCK_CATEGORIES.filter((c) => c.parentId === parentId);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!USE_MOCK) {
    return apiClient.get<Category>(`/categories/slug/${slug}`);
  }

  await mockDelay();
  return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
}
