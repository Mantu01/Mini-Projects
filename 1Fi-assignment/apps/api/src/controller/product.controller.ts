import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as productService from "@1fi/services"

export async function getAllProductsHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await productService.getAllProducts(page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getProductByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    res.status(404).json({ success: false, error: "Product not found" })
    return
  }
  const product = await productService.getProductById(id)
  if (!product) {
    res.status(404).json({ success: false, error: "Product not found" })
    return
  }
  res.json({ success: true, data: product })
}

export async function getProductBySlugHandler(req: Request, res: Response) {
  const slug = String(req.params.slug)
  const product = await productService.getProductBySlug(slug)
  if (!product) {
    res.status(404).json({ success: false, error: "Product not found" })
    return
  }
  res.json({ success: true, data: product })
}

export async function getProductWithRelationsHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    res.status(404).json({ success: false, error: "Product not found" })
    return
  }
  const product = await productService.getProductWithRelations(id)
  if (!product) {
    res.status(404).json({ success: false, error: "Product not found" })
    return
  }
  res.json({ success: true, data: product })
}

export async function getProductsByCategoryHandler(req: Request, res: Response) {
  const categoryId = String(req.params.categoryId)
  if (!isValidUUID(categoryId)) {
    res.json({ success: true, data: [], total: 0, page: 1, limit: 20, totalPages: 0 })
    return
  }
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await productService.getProductsByCategory(categoryId, page, limit, offset)
  res.json({ success: true, ...result })
}

export async function searchProductsHandler(req: Request, res: Response) {
  const query = String(req.query.q || "")
  if (!query) {
    res.status(400).json({ success: false, error: "Search query is required" })
    return
  }
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await productService.searchProducts(query, page, limit, offset)
  res.json({ success: true, ...result })
}
