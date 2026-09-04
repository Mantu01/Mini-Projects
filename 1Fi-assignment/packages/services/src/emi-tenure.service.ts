import { eq, asc, count } from "drizzle-orm"
import { db, emiTenureOptions, products } from "@1fi/db"
import { getCached, setCache } from "./helper/redis.ts"
import { buildPaginatedResponse, type PaginatedResponse } from "./helper/pagination.ts"

const CACHE_KEY = "emi_tenure_options"

export async function getAllEmiTenureOptions(
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<typeof emiTenureOptions.$inferSelect>> {
  const cacheKey = `${CACHE_KEY}:list:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<typeof emiTenureOptions.$inferSelect>>(cacheKey)
  if (cached) return cached

  const totalResult = await db.select({ value: count() }).from(emiTenureOptions)
  const total = totalResult[0]?.value ?? 0

  const data = await db
    .select()
    .from(emiTenureOptions)
    .orderBy(asc(emiTenureOptions.months))
    .limit(limit)
    .offset(offset)

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}

export async function getEmiTenureOptionById(id: string) {
  const cacheKey = `${CACHE_KEY}:id:${id}`
  const cached = await getCached<typeof emiTenureOptions.$inferSelect>(cacheKey)
  if (cached) return cached

  const results = await db
    .select()
    .from(emiTenureOptions)
    .where(eq(emiTenureOptions.id, id))
    .limit(1)

  const result = results[0]
  if (result) await setCache(cacheKey, result)
  return result
}

export async function getEmiTenureOptionsByProductId(
  productId: string,
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<typeof emiTenureOptions.$inferSelect>> {
  const cacheKey = `${CACHE_KEY}:product:${productId}:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<typeof emiTenureOptions.$inferSelect>>(cacheKey)
  if (cached) return cached

  const totalResult = await db
    .select({ value: count() })
    .from(emiTenureOptions)
    .where(eq(emiTenureOptions.productId, productId))
  const total = totalResult[0]?.value ?? 0

  const data = await db
    .select()
    .from(emiTenureOptions)
    .where(eq(emiTenureOptions.productId, productId))
    .orderBy(asc(emiTenureOptions.months))
    .limit(limit)
    .offset(offset)

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}

export async function getEmiTenureOptionsByProductSlug(
  productSlug: string,
): Promise<typeof emiTenureOptions.$inferSelect[] | null> {
  const cacheKey = `${CACHE_KEY}:slug:${productSlug}`
  const cached = await getCached<typeof emiTenureOptions.$inferSelect[]>(cacheKey)
  if (cached) return cached

  const productResults = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, productSlug))
    .limit(1)

  const product = productResults[0]
  if (!product) return null

  const data = await db
    .select()
    .from(emiTenureOptions)
    .where(eq(emiTenureOptions.productId, product.id))
    .orderBy(asc(emiTenureOptions.months))

  await setCache(cacheKey, data)
  return data
}
