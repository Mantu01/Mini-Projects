import request from "./http"

export interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface CategoryListResponse {
  items: Category[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function fetchCategories(page = 1, limit = 50): Promise<CategoryListResponse> {
  return request<CategoryListResponse>("get", "/categories", { page, limit })
}

export async function fetchCategoryBySlug(slug: string): Promise<Category> {
  return request<Category>("get", `/categories/slug/${slug}`)
}
