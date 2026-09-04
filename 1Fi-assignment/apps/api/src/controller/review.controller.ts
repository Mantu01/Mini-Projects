import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as reviewService from "@1fi/services"

function sendError(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ success: false, error: { code, message } })
}

export async function getAllReviewsHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await reviewService.getAllReviews(page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getReviewByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    sendError(res, 404, "REVIEW_NOT_FOUND", "Review not found")
    return
  }
  const review = await reviewService.getReviewById(id)
  if (!review) {
    sendError(res, 404, "REVIEW_NOT_FOUND", "Review not found")
    return
  }
  res.json({ success: true, data: review })
}

export async function getReviewsByProductIdHandler(req: Request, res: Response) {
  const productId = String(req.params.productId)
  if (!isValidUUID(productId)) {
    res.json({ success: true, data: [], total: 0, page: 1, limit: 20, totalPages: 0 })
    return
  }
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await reviewService.getReviewsByProductId(productId, page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getReviewsByProductSlugHandler(req: Request, res: Response) {
  const productSlug = String(req.params.productSlug)
  const hasPagination = req.query.page !== undefined || req.query.limit !== undefined

  if (hasPagination) {
    const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
    const result = await reviewService.getReviewsByProductSlugPaginated(productSlug, page, limit, offset)
    res.json({
      success: true,
      items: result.data,
      total: result.meta.total,
      page: result.meta.page,
      limit: result.meta.limit,
      totalPages: result.meta.totalPages,
    })
  } else {
    const result = await reviewService.getReviewsByProductSlug(productSlug)
    if (!result) {
      sendError(res, 404, "PRODUCT_NOT_FOUND", "No reviews found for this product")
      return
    }
    res.json({ success: true, data: result.reviews, total: result.total })
  }
}
