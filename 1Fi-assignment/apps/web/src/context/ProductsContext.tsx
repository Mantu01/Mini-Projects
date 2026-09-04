import { createContext, useContext, useMemo } from "react"
import { fetchProducts, fetchCategoryProducts, fetchProductDetail, fetchHomeProducts } from "@/api/products"
import type { ProductSummary, ProductDetail } from "@/api/products"
import type { Product, Review } from "@/types"
import { slugForCategory } from "@/lib/utils"
import { useCategoriesContext } from "./CategoriesContext"

const PAGE_SIZE = 12
const REVIEW_PREVIEW_COUNT = 6

export interface StoreValue {
  getCategoryProducts: (category: string, page?: number) => Promise<{ items: Product[]; total: number; page: number; totalPages: number }>
  getAllProducts: (page?: number) => Promise<{ items: Product[]; total: number; page: number; totalPages: number }>
  getProductBySlug: (slug: string) => Promise<Product | null>
  getProductReviews: (productSlug: string, page?: number) => Promise<{ reviews: Review[]; total: number; page: number; totalPages: number }>
  getAllProductReviews: (productSlug: string) => Promise<Review[]>
  getHomeCategoryRows: () => Promise<Array<{ title: string; slug: string; products: Product[] }>>
  PRODUCT_REVIEWS_PAGE_SIZE: number
  CATEGORY_PAGE_SIZE: number
}

interface ProductsContextValue extends StoreValue {
  categoriesLoaded: boolean
}

const ProductsContext = createContext<ProductsContextValue>({
  CATEGORY_PAGE_SIZE: PAGE_SIZE,
  PRODUCT_REVIEWS_PAGE_SIZE: REVIEW_PREVIEW_COUNT,
  categoriesLoaded: false,
  getCategoryProducts: async () => ({ items: [], total: 0, page: 1, totalPages: 1 }),
  getAllProducts: async () => ({ items: [], total: 0, page: 1, totalPages: 1 }),
  getProductBySlug: async () => null,
  getProductReviews: async () => ({ reviews: [], total: 0, page: 1, totalPages: 1 }),
  getAllProductReviews: async () => [],
  getHomeCategoryRows: async () => [],
})

function mapProductSummaryToProduct(p: ProductSummary, categoryIdToNameMap?: Map<string, string>): Product {
  const categoryName = (p.categoryId && categoryIdToNameMap?.get(p.categoryId)) ?? "Unknown"
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: categoryName,
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: categoryName, href: `/c/${slugForCategory(categoryName)}` },
      { label: p.name, href: null },
    ],
    images: p.images,
    selectedColor: p.selectedColor ?? p.colorOptions[0] ?? "",
    colorOptions: p.colorOptions,
    selectedVariant: {},
    variantOptions: [],
    price: p.price,
    mrp: p.mrp,
    rating: p.rating,
    soldCount: p.soldCount,
    appLinks: { appStore: "", playStore: "" },
    tenureOptions: [],
    defaultTenureIndex: 0,
    downPayment: 0,
    emiStartLabel: "",
    seller: { name: "", url: "" },
    shipping: { text: "" },
    trustBadges: [],
    specs: [],
    overallRating: p.overallRating ?? p.rating,
    reviewMedia: [],
    reviews: [],
  }
}

function mapApiReview(r: NonNullable<ProductDetail["reviews"]>[number]): Review {
  return {
    stars: r.stars,
    variantDescription: r.variantDescription ?? "",
    text: r.text,
    attachments: r.attachments ?? [],
    reviewerName: r.reviewerName,
    city: r.city,
    verified: r.verified,
    timeAgo: r.timeAgo ?? "",
  }
}

function mapProductDetail(detail: ProductDetail): Product {
  const variants = detail.variants ?? []
  const selectedVariantFromVariants =
    variants.length > 0 ? { [variants[0].variantLabel ?? ""]: variants[0].variantValue ?? "" } : {}
  const variantOptions = variants.map((v) => ({ [v.variantLabel ?? ""]: v.variantValue ?? "" }))
  const specs = (detail.specs ?? []).map((s) => ({ label: s.label, value: s.value }))
  const reviews = (detail.reviews ?? []).map(mapApiReview)
  const topBrandBadge =
    detail.brand !== null && detail.brand !== undefined ? [{ icon: "crown", label: "Top Brand" }] : []
  const badges = [...(detail.trustBadges ?? []).map((b) => ({ icon: b.icon, label: b.label })), ...topBrandBadge]
  return {
    id: detail.id,
    slug: detail.slug,
    name: detail.name,
    category: detail.category?.name ?? "Unknown",
    breadcrumb: (detail.breadcrumbs ?? []).map((b) => ({ label: b.label, href: b.href })),
    images: detail.images,
    selectedColor: detail.selectedColor ?? detail.colorOptions?.[0] ?? "",
    colorOptions: detail.colorOptions ?? [],
    selectedVariant: selectedVariantFromVariants,
    variantOptions,
    price: detail.price,
    mrp: detail.mrp,
    rating: detail.rating,
    soldCount: detail.soldCount,
    appLinks: { appStore: detail.appStoreLink ?? "", playStore: detail.playStoreLink ?? "" },
    tenureOptions: detail.emiTenureOptions ?? [],
    defaultTenureIndex: detail.defaultTenureIndex,
    downPayment: detail.downPayment ?? 0,
    emiStartLabel: detail.emiStartLabel ?? "",
    seller: { name: detail.seller?.name ?? "", url: detail.seller?.url ?? "" },
    shipping: { text: detail.shippingText ?? "" },
    trustBadges: badges,
    specs,
    overallRating: detail.overallRating ?? detail.rating,
    reviewMedia: detail.reviewMedia ?? [],
    reviews,
  }
}

export function useProducts() {
  const { getCategorySlug, categoriesLoaded, categoryIdToNameMap } = useCategoriesContext()

  const getCategoryProducts = useMemo(
    () =>
      async (category: string, page = 1) => {
        try {
          const slug = getCategorySlug(category)
          const res = await fetchCategoryProducts(slug, page, PAGE_SIZE)
          const items = (res.items ?? []).map((item) => mapProductSummaryToProduct(item, categoryIdToNameMap))
          return { items, total: res.total, page: res.page, totalPages: res.totalPages }
        } catch {
          return { items: [] as Product[], total: 0, page, totalPages: 1 }
        }
      },
    [getCategorySlug, categoryIdToNameMap],
  )

  const getAllProducts = useMemo(
    () =>
      async (page = 1) => {
        try {
          const res = await fetchProducts(page, PAGE_SIZE)
          const items = (res.items ?? []).map((item) => mapProductSummaryToProduct(item, categoryIdToNameMap))
          return { items, total: res.total, page: res.page, totalPages: res.totalPages }
        } catch {
          return { items: [] as Product[], total: 0, page, totalPages: 1 }
        }
      },
    [categoryIdToNameMap],
  )

  const getProductBySlug = useMemo(
    () =>
      async (slug: string) => {
        try {
          const detail = await fetchProductDetail(slug)
          return mapProductDetail(detail)
        } catch {
          return null
        }
      },
    [],
  )

  const getProductReviews = useMemo(
    () =>
      async (productSlug: string, page = 1) => {
        try {
          const detail = await fetchProductDetail(productSlug)
          const allReviews = detail?.reviews ?? []
          const start = (page - 1) * REVIEW_PREVIEW_COUNT
          const sliced = allReviews.slice(start, start + REVIEW_PREVIEW_COUNT)
          const uiReviews = sliced.map(mapApiReview)
          return {
            reviews: uiReviews,
            total: allReviews.length,
            page,
            totalPages: Math.ceil(allReviews.length / REVIEW_PREVIEW_COUNT),
          }
        } catch {
          return { reviews: [] as Review[], total: 0, page, totalPages: 1 }
        }
      },
    [],
  )

  const getAllProductReviews = useMemo(
    () =>
      async (productSlug: string) => {
        try {
          const detail = await fetchProductDetail(productSlug)
          return (detail?.reviews ?? []).map(mapApiReview)
        } catch {
          return [] as Review[]
        }
      },
    [],
  )

  const getHomeCategoryRows = useMemo(
    () =>
      async () => {
        try {
          const result = await fetchHomeProducts(4, 4)
          return (result ?? []).map((row) => ({
            title: row.title,
            slug: row.slug,
            products: row.products.map((item) => mapProductSummaryToProduct(item, categoryIdToNameMap)),
          }))
        } catch {
          return [] as Array<{ title: string; slug: string; products: Product[] }>
        }
      },
    [categoryIdToNameMap],
  )

  return {
    CATEGORY_PAGE_SIZE: PAGE_SIZE,
    PRODUCT_REVIEWS_PAGE_SIZE: REVIEW_PREVIEW_COUNT,
    categoriesLoaded,
    getCategoryProducts,
    getAllProducts,
    getProductBySlug,
    getProductReviews,
    getAllProductReviews,
    getHomeCategoryRows,
  }
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const {
    CATEGORY_PAGE_SIZE,
    PRODUCT_REVIEWS_PAGE_SIZE,
    categoriesLoaded,
    getCategoryProducts,
    getAllProducts,
    getProductBySlug,
    getProductReviews,
    getAllProductReviews,
    getHomeCategoryRows,
  } = useProducts()

  const value = useMemo<ProductsContextValue>(
    () => ({
      CATEGORY_PAGE_SIZE,
      PRODUCT_REVIEWS_PAGE_SIZE,
      categoriesLoaded,
      getCategoryProducts,
      getAllProducts,
      getProductBySlug,
      getProductReviews,
      getAllProductReviews,
      getHomeCategoryRows,
    }),
    [
      CATEGORY_PAGE_SIZE,
      PRODUCT_REVIEWS_PAGE_SIZE,
      categoriesLoaded,
      getCategoryProducts,
      getAllProducts,
      getProductBySlug,
      getProductReviews,
      getAllProductReviews,
      getHomeCategoryRows,
    ],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export const useProductsContext = () => useContext(ProductsContext)
