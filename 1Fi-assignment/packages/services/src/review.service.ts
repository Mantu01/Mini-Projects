import { eq, desc, count } from "drizzle-orm"
import { db, reviews, reviewAttachments } from "@1fi/db"
import { getCached, setCache } from "./helper/redis.js"
import { buildPaginatedResponse, type PaginatedResponse } from "./helper/pagination.js"

const CACHE_KEY = "reviews"

export async function getAllReviews(
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<typeof reviews.$inferSelect>> {
  const cacheKey = `${CACHE_KEY}:list:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<typeof reviews.$inferSelect>>(cacheKey)
  if (cached) return cached

  const totalResult = await db.select({ value: count() }).from(reviews)
  const total = totalResult[0]?.value ?? 0

  const data = await db
    .select()
    .from(reviews)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset)

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}

export async function getReviewById(id: string) {
  const cacheKey = `${CACHE_KEY}:id:${id}`
  const cached = await getCached<typeof reviews.$inferSelect>(cacheKey)
  if (cached) return cached

  const results = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1)

  const result = results[0]
  if (result) await setCache(cacheKey, result)
  return result
}

type ReviewWithAttachments = typeof reviews.$inferSelect & {
  attachments: (typeof reviewAttachments.$inferSelect)[]
}

export async function getReviewsByProductId(
  productId: string,
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<ReviewWithAttachments>> {
  const cacheKey = `${CACHE_KEY}:product:${productId}:${page}:${limit}`
  const cached = await getCached<PaginatedResponse<ReviewWithAttachments>>(cacheKey)
  if (cached) return cached

  const totalResult = await db
    .select({ value: count() })
    .from(reviews)
    .where(eq(reviews.productId, productId))
  const total = totalResult[0]?.value ?? 0

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset)

  const data = await Promise.all(
    productReviews.map(async (review) => {
      const attachments = await db
        .select()
        .from(reviewAttachments)
        .where(eq(reviewAttachments.reviewId, review.id))
      return { ...review, attachments }
    }),
  )

  const response = buildPaginatedResponse(data, total, { page, limit, offset })
  await setCache(cacheKey, response)
  return response
}
