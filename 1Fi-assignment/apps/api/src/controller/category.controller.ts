import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as categoryService from "@1fi/services"

function sendPaginated(res: Response, result: { data: unknown[]; meta: { page: number; limit: number; total: number; totalPages: number } }) {
  res.set("X-Total-Count", String(result.meta.total))
  res.set("X-Page", String(result.meta.page))
  res.set("X-Per-Page", String(result.meta.limit))
  res.set("X-Total-Pages", String(result.meta.totalPages))
  return res.json({
    success: true,
    items: result.data,
    total: result.meta.total,
    page: result.meta.page,
    limit: result.meta.limit,
    totalPages: result.meta.totalPages,
  })
}

function sendError(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ success: false, error: { code, message } })
}

export async function getAllCategoriesHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await categoryService.getAllCategories(page, limit, offset)
  sendPaginated(res, result)
}

export async function getCategoryByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    sendError(res, 404, "CATEGORY_NOT_FOUND", "Category not found")
    return
  }
  const category = await categoryService.getCategoryById(id)
  if (!category) {
    sendError(res, 404, "CATEGORY_NOT_FOUND", "Category not found")
    return
  }
  res.json({ success: true, data: category })
}

export async function getCategoryBySlugHandler(req: Request, res: Response) {
  const slug = String(req.params.slug)
  const category = await categoryService.getCategoryBySlug(slug)
  if (!category) {
    sendError(res, 404, "CATEGORY_NOT_FOUND", "Category not found")
    return
  }
  res.json({ success: true, data: category })
}
