import { eq, desc, and } from "drizzle-orm"
import { db } from "../index.js"
import { reviews, reviewAttachments } from "../schema/index.js"
import { InsertReview, InsertReviewAttachment } from "../zod/index.js"
import { Review, ReviewAttachment } from "../types.js"

export async function createReview(data: InsertReview): Promise<Review> {
  const result = await db.insert(reviews).values(data).returning()
  if (!result[0]) throw new Error("Failed to create review")
  return result[0]
}

export async function createReviewAttachment(
  data: InsertReviewAttachment,
): Promise<ReviewAttachment> {
  const result = await db
    .insert(reviewAttachments)
    .values(data)
    .returning()
  if (!result[0]) throw new Error("Failed to create review attachment")
  return result[0]
}

export async function getReviewById(
  id: string,
): Promise<Review | undefined> {
  const result = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1)
  return result[0]
}

export async function getReviewsByProductId(
  productId: string,
): Promise<(Review & { attachments: ReviewAttachment[] })[]> {
  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt))

  return Promise.all(
    productReviews.map(
      async (review: (typeof productReviews)[number]) => {
        const attachments = await db
          .select()
          .from(reviewAttachments)
          .where(eq(reviewAttachments.reviewId, review.id))
        return { ...review, attachments }
      },
    ),
  )
}

export async function getReviewsByProductIdAndStars(
  productId: string,
  stars: number,
): Promise<(Review & { attachments: ReviewAttachment[] })[]> {
  const productReviews = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.stars, stars)))
    .orderBy(desc(reviews.createdAt))

  return Promise.all(
    productReviews.map(
      async (review: (typeof productReviews)[number]) => {
        const attachments = await db
          .select()
          .from(reviewAttachments)
          .where(eq(reviewAttachments.reviewId, review.id))
        return { ...review, attachments }
      },
    ),
  )
}

export async function getReviewAttachments(
  reviewId: string,
): Promise<ReviewAttachment[]> {
  return db
    .select()
    .from(reviewAttachments)
    .where(eq(reviewAttachments.reviewId, reviewId))
}

export async function updateReview(
  id: string,
  data: Partial<InsertReview>,
): Promise<Review | undefined> {
  const result = await db
    .update(reviews)
    .set(data)
    .where(eq(reviews.id, id))
    .returning()
  return result[0]
}

export async function deleteReview(id: string): Promise<boolean> {
  const result = await db
    .delete(reviews)
    .where(eq(reviews.id, id))
    .returning()
  return result.length > 0
}
