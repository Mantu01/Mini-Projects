import { eq, desc, asc, ilike, count } from "drizzle-orm"
import { sellers } from "@1fi/db"
import {
  db,
  products,
  productVariants,
  productSpecs,
  productTrustBadges,
  productBreadcrumbs,
  productOptions,
  emiTenureOptions,
  reviews,
  reviewAttachments,
  categories,
} from "@1fi/db"
import { getCached, setCache } from "./helper/redis.ts"
import { buildPaginatedResponse, type PaginatedResponse } from "./helper/pagination.ts"

const CACHE_KEY = "products"

export async function getAllProducts(
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<typeof products.$inferSelect>> {
  const cacheKey = `${CACHE_KEY}:list:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<typeof products.$inferSelect>>(cacheKey)
  if (cached) return cached

  const totalResult = await db.select({ value: count() }).from(products)
  const total = totalResult[0]?.value ?? 0

  const data = await db
    .select()
    .from(products)
    .orderBy(desc(products.soldCount))
    .limit(limit)
    .offset(offset)

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}

export async function getProductById(id: string) {
  const cacheKey = `${CACHE_KEY}:id:${id}`
  const cached = await getCached<typeof products.$inferSelect>(cacheKey)
  if (cached) return cached
  
  const results = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)
    
    const result = results[0]
    if (result) await setCache(cacheKey, result)
      return result
  }
  
  export async function getProductBySlug(slug: string) {
    const cacheKey = `${CACHE_KEY}:slug:${slug}`
    const cached = await getCached<typeof products.$inferSelect>(cacheKey)
  if (cached) return cached

  const results = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)

  const result = results[0]
  if (result) await setCache(cacheKey, result)
  return result
}

export async function getProductWithRelations(id: string) {
  const cacheKey = `${CACHE_KEY}:relations:${id}`
  const cached = await getCached<Record<string, unknown>>(cacheKey)
  if (cached) return cached

  const productResults = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)

  const product = productResults[0]
  if (!product) return null

  const categoryResults = await db
    .select()
    .from(categories)
    .where(eq(categories.id, product.categoryId))
    .limit(1)

  const category = categoryResults[0]

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id))

  const options = await db
    .select()
    .from(productOptions)
    .where(eq(productOptions.productId, product.id))

  const specs = await db
    .select()
    .from(productSpecs)
    .where(eq(productSpecs.productId, product.id))
    .orderBy(asc(productSpecs.sortOrder))

  const badges = await db
    .select()
    .from(productTrustBadges)
    .where(eq(productTrustBadges.productId, product.id))

  const breadcrumbs = await db
    .select()
    .from(productBreadcrumbs)
    .where(eq(productBreadcrumbs.productId, product.id))
    .orderBy(asc(productBreadcrumbs.sortOrder))

  const tenures = await db
    .select()
    .from(emiTenureOptions)
    .where(eq(emiTenureOptions.productId, product.id))
    .orderBy(asc(emiTenureOptions.months))

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, product.id))
    .orderBy(desc(reviews.createdAt))

  const reviewsWithAttachments = await Promise.all(
    productReviews.map(async (review) => {
      const attachments = await db
        .select()
        .from(reviewAttachments)
        .where(eq(reviewAttachments.reviewId, review.id))
      return { ...review, attachments }
    }),
  )

  const result = {
    ...product,
    category,
    variants,
    options,
    specs,
    trustBadges: badges,
    breadcrumbs,
    emiTenureOptions: tenures,
    reviews: reviewsWithAttachments,
  }

  await setCache(cacheKey, result)
  return result
}

export async function getProductsByCategory(
  categoryId: string,
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<typeof products.$inferSelect>> {
  const cacheKey = `${CACHE_KEY}:category:${categoryId}:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<typeof products.$inferSelect>>(cacheKey)
  if (cached) return cached

  const totalResult = await db
    .select({ value: count() })
    .from(products)
    .where(eq(products.categoryId, categoryId))
  const total = totalResult[0]?.value ?? 0

  const data = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, categoryId))
    .orderBy(desc(products.soldCount))
    .limit(limit)
    .offset(offset)

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}

export async function searchProducts(
  query: string,
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<typeof products.$inferSelect>> {
  const cacheKey = `${CACHE_KEY}:search:${query}:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<typeof products.$inferSelect>>(cacheKey)
  if (cached) return cached

  const totalResult = await db
    .select({ value: count() })
    .from(products)
    .where(ilike(products.name, `%${query}%`))
  const total = totalResult[0]?.value ?? 0

  const data = await db
    .select()
    .from(products)
    .where(ilike(products.name, `%${query}%`))
    .orderBy(desc(products.soldCount))
    .limit(limit)
    .offset(offset)

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}

export async function getProductWithRelationsBySlug(slug: string) {
  const cacheKey = `${CACHE_KEY}:relations:slug:${slug}`
  const cached = await getCached<Record<string, unknown>>(cacheKey)
  if (cached) return cached

  const productResults = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)

  const product = productResults[0]
  if (!product) return null

  const categoryResults = await db
    .select()
    .from(categories)
    .where(eq(categories.id, product.categoryId))
    .limit(1)

  const category = categoryResults[0]

  const sellerResults = await db
    .select()
    .from(sellers)
    .where(eq(sellers.id, product.sellerId))
    .limit(1)

  const seller = sellerResults[0]

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id))

  const options = await db
    .select()
    .from(productOptions)
    .where(eq(productOptions.productId, product.id))

  const specs = await db
    .select()
    .from(productSpecs)
    .where(eq(productSpecs.productId, product.id))
    .orderBy(asc(productSpecs.sortOrder))

  const badges = await db
    .select()
    .from(productTrustBadges)
    .where(eq(productTrustBadges.productId, product.id))

  const breadcrumbs = await db
    .select()
    .from(productBreadcrumbs)
    .where(eq(productBreadcrumbs.productId, product.id))
    .orderBy(asc(productBreadcrumbs.sortOrder))

  const tenures = await db
    .select()
    .from(emiTenureOptions)
    .where(eq(emiTenureOptions.productId, product.id))
    .orderBy(asc(emiTenureOptions.months))

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, product.id))
    .orderBy(desc(reviews.createdAt))

  const reviewsWithAttachments = await Promise.all(
    productReviews.map(async (review) => {
      const attachments = await db
        .select()
        .from(reviewAttachments)
        .where(eq(reviewAttachments.reviewId, review.id))
      return { ...review, attachments }
    }),
  )

  const result = {
    ...product,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    seller: seller ? { id: seller.id, name: seller.name, slug: seller.slug, url: seller.url } : null,
    variants,
    options,
    specs,
    trustBadges: badges,
    breadcrumbs,
    emiTenureOptions: tenures,
    reviews: reviewsWithAttachments,
  }

  await setCache(cacheKey, result)
  return result
}

export async function getHomeProducts(
  categoriesLimit: number,
  productsPerCategory: number,
): Promise<Array<{ title: string; slug: string; products: typeof products.$inferSelect[] }>> {
  const cacheKey = `${CACHE_KEY}:home:${categoriesLimit}:${productsPerCategory}`
  const cached = await getCached<Array<{ title: string; slug: string; products: typeof products.$inferSelect[] }>>(cacheKey)
  if (cached) return cached

  const topCategories = await db
    .select()
    .from(categories)
    .limit(categoriesLimit)

  const rows = await Promise.all(
    topCategories.map(async (cat) => {
      const prods = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, cat.id))
        .orderBy(desc(products.soldCount))
        .limit(productsPerCategory)
      return { title: cat.name, slug: cat.slug, products: prods }
    }),
  )

  await setCache(cacheKey, rows)
  return rows
}

export async function getProductsByCategorySlug(
  categorySlug: string,
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<typeof products.$inferSelect>> {
  const categoryResults = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1)

  const category = categoryResults[0]
  if (!category) return { data: [], meta: { page, limit, total: 0, totalPages: 0 } }

  const cacheKey = `${CACHE_KEY}:category-slug:${categorySlug}:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<typeof products.$inferSelect>>(cacheKey)
  if (cached) return cached

  const totalResult = await db
    .select({ value: count() })
    .from(products)
    .where(eq(products.categoryId, category.id))
  const total = totalResult[0]?.value ?? 0

  const data = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, category.id))
    .orderBy(desc(products.soldCount))
    .limit(limit)
    .offset(offset)

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}
