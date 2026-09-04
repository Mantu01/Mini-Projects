import { eq, count } from "drizzle-orm"
import { db, sellers } from "@1fi/db"
import { getCached, setCache } from "./helper/redis.js"
import { buildPaginatedResponse, type PaginatedResponse } from "./helper/pagination.js"

const CACHE_KEY = "sellers"

export async function getAllSellers(
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<typeof sellers.$inferSelect>> {
  const cacheKey = `${CACHE_KEY}:list:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<typeof sellers.$inferSelect>>(cacheKey)
  if (cached) return cached

  const totalResult = await db.select({ value: count() }).from(sellers)
  const total = totalResult[0]?.value ?? 0

  const data = await db
    .select()
    .from(sellers)
    .limit(limit)
    .offset(offset)

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}

export async function getSellerById(id: string) {
  const cacheKey = `${CACHE_KEY}:id:${id}`
  const cached = await getCached<typeof sellers.$inferSelect>(cacheKey)
  if (cached) return cached

  const results = await db
    .select()
    .from(sellers)
    .where(eq(sellers.id, id))
    .limit(1)

  const result = results[0]
  if (result) await setCache(cacheKey, result)
  return result
}

export async function getSellerBySlug(slug: string) {
  const cacheKey = `${CACHE_KEY}:slug:${slug}`
  const cached = await getCached<typeof sellers.$inferSelect>(cacheKey)
  if (cached) return cached

  const results = await db
    .select()
    .from(sellers)
    .where(eq(sellers.slug, slug))
    .limit(1)

  const result = results[0]
  if (result) await setCache(cacheKey, result)
  return result
}
