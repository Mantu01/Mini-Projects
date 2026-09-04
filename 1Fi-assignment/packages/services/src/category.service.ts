import { eq, count } from "drizzle-orm"
import { db, categories } from "@1fi/db"
import { getCached, setCache } from "./helper/redis.ts"
import { buildPaginatedResponse, type PaginatedResponse } from "./helper/pagination.ts"

const CACHE_KEY = "categories"

export async function getAllCategories(
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<typeof categories.$inferSelect>> {
  const cacheKey = `${CACHE_KEY}:list:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<typeof categories.$inferSelect>>(cacheKey)
  if (cached) return cached

  const totalResult = await db.select({ value: count() }).from(categories)
  const total = totalResult[0]?.value ?? 0

  const data = await db
    .select()
    .from(categories)
    .limit(limit)
    .offset(offset)

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}

export async function getCategoryById(id: string) {
  const cacheKey = `${CACHE_KEY}:id:${id}`
  const cached = await getCached<typeof categories.$inferSelect>(cacheKey)
  if (cached) return cached

  const results = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1)

  const result = results[0]
  if (result) await setCache(cacheKey, result)
  return result
}

export async function getCategoryBySlug(slug: string) {
  const cacheKey = `${CACHE_KEY}:slug:${slug}`
  const cached = await getCached<typeof categories.$inferSelect>(cacheKey)
  if (cached) return cached

  const results = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)

  const result = results[0]
  if (result) await setCache(cacheKey, result)
  return result
}
