import { createContext, useContext } from "react"
import type { Product, Review } from "@/data/types"
import { ProductsProvider, useProductsContext } from "./ProductsContext"
import { CategoriesProvider, useCategoriesContext } from "./CategoriesContext"

export interface StoreValue {
  getCategoryProducts: (category: string, page?: number) => Promise<{ items: Product[]; total: number; page: number; totalPages: number }>
  getAllProducts: (page?: number) => Promise<{ items: Product[]; total: number; page: number; totalPages: number }>
  getProductBySlug: (slug: string) => Promise<Product | null>
  getProductReviews: (productSlug: string, page?: number) => Promise<{ reviews: Review[]; total: number; page: number; totalPages: number }>
  getAllProductReviews: (productSlug: string) => Promise<Review[]>
  getHomeCategoryRows: () => Promise<Array<{ title: string; slug: string; products: Product[] }>>
  getCategoryName: (categorySlug: string) => string | undefined
  getCategorySlug: (categoryName: string) => string
  PRODUCT_REVIEWS_PAGE_SIZE: number
  CATEGORY_PAGE_SIZE: number
  categories: Array<{ name: string; slug: string }>
  categoriesLoaded: boolean
}

const StoreContext = createContext<StoreValue>({
  getCategoryProducts: async () => ({ items: [], total: 0, page: 1, totalPages: 1 }),
  getAllProducts: async () => ({ items: [], total: 0, page: 1, totalPages: 1 }),
  getProductBySlug: async () => null,
  getProductReviews: async () => ({ reviews: [], total: 0, page: 1, totalPages: 1 }),
  getAllProductReviews: async () => [],
  getHomeCategoryRows: async () => [],
  getCategoryName: () => undefined,
  getCategorySlug: () => "",
  PRODUCT_REVIEWS_PAGE_SIZE: 6,
  CATEGORY_PAGE_SIZE: 12,
  categories: [],
  categoriesLoaded: false,
})

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <CategoriesProvider>
      <ProductsProvider>
        <StoreInnerProvider>{children}</StoreInnerProvider>
      </ProductsProvider>
    </CategoriesProvider>
  )
}

function StoreInnerProvider({ children }: { children: React.ReactNode }) {
  const { categories, categoriesLoaded, getCategoryName, getCategorySlug } = useCategoriesContext()
  const {
    CATEGORY_PAGE_SIZE,
    PRODUCT_REVIEWS_PAGE_SIZE,
    getCategoryProducts,
    getAllProducts,
    getProductBySlug,
    getProductReviews,
    getAllProductReviews,
    getHomeCategoryRows,
  } = useProductsContext()

  const value = {
    categories,
    categoriesLoaded,
    getCategoryName,
    getCategorySlug,
    CATEGORY_PAGE_SIZE,
    PRODUCT_REVIEWS_PAGE_SIZE,
    getCategoryProducts,
    getAllProducts,
    getProductBySlug,
    getProductReviews,
    getAllProductReviews,
    getHomeCategoryRows,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
export { useProductsContext, useCategoriesContext }
export type { StoreValue }
