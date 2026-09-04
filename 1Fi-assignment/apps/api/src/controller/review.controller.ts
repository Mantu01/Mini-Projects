import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as reviewService from "@1fi/services"

export async function getAllReviewsHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await reviewService.getAllReviews(page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getReviewByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    res.status(404).json({ success: false, error: "Review not found" })
    return
  }
  const review = await reviewService.getReviewById(id)
  if (!review) {
    res.status(404).json({ success: false, error: "Review not found" })
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
