import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as productService from "@1fi/services"
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

export async function getHomeProductsHandler(req: Request, res: Response) {
  const categoriesLimit = Math.min(20, Math.max(1, Number(req.query.categoriesLimit) || 4))
  const productsPerCategory = Math.min(20, Math.max(1, Number(req.query.productsPerCategory) || 4))
  const result = await productService.getHomeProducts(categoriesLimit, productsPerCategory)
  res.json({ success: true, data: result })
}

export async function getAllProductsHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await productService.getAllProducts(page, limit, offset)
  sendPaginated(res, result)
}

export async function getProductByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    sendError(res, 404, "PRODUCT_NOT_FOUND", "Product not found")
    return
  }
  const product = await productService.getProductById(id)
  if (!product) {
    sendError(res, 404, "PRODUCT_NOT_FOUND", "Product not found")
    return
  }
  res.json({ success: true, data: product })
}

export async function getProductBySlugHandler(req: Request, res: Response) {
  const slug = String(req.params.slug)
  const product = await productService.getProductBySlug(slug)
  if (!product) {
    sendError(res, 404, "PRODUCT_NOT_FOUND", "Product not found")
    return
  }
  res.json({ success: true, data: product })
}

export async function getProductWithRelationsHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    sendError(res, 404, "PRODUCT_NOT_FOUND", "Product not found")
    return
  }
  const product = await productService.getProductWithRelations(id)
  if (!product) {
    sendError(res, 404, "PRODUCT_NOT_FOUND", "Product not found")
    return
  }
  res.json({ success: true, data: product })
}

export async function getProductWithRelationsBySlugHandler(req: Request, res: Response) {
  const slug = String(req.params.slug)
  const product = await productService.getProductWithRelationsBySlug(slug)
  if (!product) {
    sendError(res, 404, "PRODUCT_NOT_FOUND", "Product not found")
    return
  }
  res.json({ success: true, data: product })
}

export async function getProductsByCategoryHandler(req: Request, res: Response) {
  const categoryId = String(req.params.categoryId)
  if (!isValidUUID(categoryId)) {
    sendPaginated(res, { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } })
    return
  }
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await productService.getProductsByCategory(categoryId, page, limit, offset)
  sendPaginated(res, result)
}

export async function getProductsByCategorySlugHandler(req: Request, res: Response) {
  const categorySlug = String(req.params.categorySlug)
  const category = await categoryService.getCategoryBySlug(categorySlug)
  if (!category) {
    sendError(res, 404, "CATEGORY_NOT_FOUND", "Category not found")
    return
  }
  const parsed = parsePagination(req.query as Record<string, unknown>)
  const limit = 12
  const page = parsed.page
  const offset = (page - 1) * limit
  const result = await productService.getProductsByCategorySlug(categorySlug, page, limit, offset)
  sendPaginated(res, result)
}

export async function searchProductsHandler(req: Request, res: Response) {
  const query = String(req.query.q || req.query.query || "")
  if (!query) {
    sendError(res, 400, "VALIDATION_ERROR", "Search query is required")
    return
  }
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await productService.searchProducts(query, page, limit, offset)
  sendPaginated(res, result)
}
