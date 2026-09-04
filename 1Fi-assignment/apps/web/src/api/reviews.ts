import request from "./http"

export interface ReviewAttachment {
  id: string
  reviewId: string
  type: "image" | "video"
  thumbnail: string
}

export interface Review {
  id: string
  productId: string
  stars: number
  variantDescription: string | null
  text: string
  reviewerName: string
  city: string
  verified: boolean
  timeAgo: string | null
  attachments: ReviewAttachment[]
}

export interface ReviewListResponse {
  items: Review[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function fetchProductReviews(slug: string): Promise<Review[]> {
  return request<Review[]>("get", `/reviews/product/${slug}`)
}

export async function fetchPaginatedReviews(slug: string, page = 1, limit = 20): Promise<ReviewListResponse> {
  return request<ReviewListResponse>("get", `/reviews/product/${slug}`, { page, limit })
}

export interface EmiTenureOption {
  id: string
  productId: string
  months: number
  monthlyAmount: number
  badge: string
  interestRate: string
  cashbackAmount: number
}

export async function fetchEmiTenureOptions(productSlug: string): Promise<EmiTenureOption[]> {
  return request<EmiTenureOption[]>("get", `/emi-tenure-options/product/${productSlug}`)
}

export interface Seller {
  id: string
  name: string
  slug: string
  url: string | null
  createdAt: string
  updatedAt: string
}

export async function fetchSellerBySlug(slug: string): Promise<Seller> {
  return request<Seller>("get", `/sellers/slug/${slug}`)
}
