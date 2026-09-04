import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as categoryService from "@1fi/services"

export async function getAllCategoriesHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await categoryService.getAllCategories(page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getCategoryByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    res.status(404).json({ success: false, error: "Category not found" })
    return
  }
  const category = await categoryService.getCategoryById(id)
  if (!category) {
    res.status(404).json({ success: false, error: "Category not found" })
    return
  }
  res.json({ success: true, data: category })
}

export async function getCategoryBySlugHandler(req: Request, res: Response) {
  const slug = String(req.params.slug)
  const category = await categoryService.getCategoryBySlug(slug)
  if (!category) {
    res.status(404).json({ success: false, error: "Category not found" })
    return
  }
  res.json({ success: true, data: category })
}
