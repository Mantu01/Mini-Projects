import request from "./http"

export interface ProductSummary {
  id: string
  sku: string
  slug: string
  name: string
  brand: string | null
  topBrand: boolean | null
  price: number
  mrp: number
  rating: number
  overallRating: number | null
  soldCount: number
  images: string[]
  selectedColor: string | null
  colorOptions: string[]
  categoryId: string
  sellerId: string
  createdAt: string
  updatedAt: string
}

export interface ProductListResponse {
  items: ProductSummary[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function fetchProducts(page = 1, limit = 20): Promise<ProductListResponse> {
  return request<ProductListResponse>("get", "/products", { page, limit })
}

export async function fetchProductSearch(q: string, page = 1, limit = 20): Promise<ProductListResponse> {
  return request<ProductListResponse>("get", "/products/search", { q, page, limit })
}

export async function fetchCategoryProducts(categorySlug: string, page = 1, limit = 12): Promise<ProductListResponse> {
  return request<ProductListResponse>("get", `/products/category/${categorySlug}`, { page, limit })
}

export interface HomeCategoryRow {
  title: string
  slug: string
  products: ProductSummary[]
}

export async function fetchHomeProducts(categoriesLimit = 4, productsPerCategory = 4): Promise<HomeCategoryRow[]> {
  return request<HomeCategoryRow[]>("get", "/products/home", { categoriesLimit, productsPerCategory })
}

export interface ProductDetail {
  id: string
  sku: string
  slug: string
  name: string
  brand: string | null
  topBrand: boolean | null
  price: number
  mrp: number
  rating: number
  overallRating: number | null
  soldCount: number
  images: string[]
  selectedColor: string | null
  colorOptions: string[]
  appStoreLink: string | null
  playStoreLink: string | null
  defaultTenureIndex: number
  downPayment: number | null
  emiStartLabel: string | null
  returnable: boolean
  shippingText: string | null
  reviewMedia: Array<{ type: "image" | "video"; thumbnail: string }>
  categoryId: string
  sellerId: string
  createdAt: string
  updatedAt: string
  category: { id: string; name: string; slug: string }
  seller: { id: string; name: string; slug: string; url: string | null }
  variants: Array<{ id: string; productId: string; variantLabel: string; variantValue: string }>
  options: Array<{ id: string; productId: string; color: string | null; variantLabel: string | null; variantValue: string | null; price: number; mrp: number; images: string[] | null }>
  specs: Array<{ id: string; productId: string; label: string; value: string; sortOrder: number }>
  trustBadges: Array<{ id: string; productId: string; icon: string; label: string }>
  breadcrumbs: Array<{ id: string; productId: string; label: string; href: string | null; sortOrder: number }>
  emiTenureOptions: Array<{ id: string; productId: string; months: number; monthlyAmount: number; badge: string; interestRate: string; cashbackAmount: number }>
  reviews: Array<{
    id: string
    productId: string
    stars: number
    variantDescription: string | null
    text: string
    reviewerName: string
    city: string
    verified: boolean
    timeAgo: string | null
    attachments: Array<{ id: string; reviewId: string; type: "image" | "video"; thumbnail: string }>
  }>
}

export async function fetchProductDetail(slug: string): Promise<ProductDetail> {
  return request<ProductDetail>("get", `/products/slug/${slug}/relations`)
}
