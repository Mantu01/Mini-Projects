import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as emiTenureService from "@1fi/services"

function sendError(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ success: false, error: { code, message } })
}

export async function getAllEmiTenureOptionsHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await emiTenureService.getAllEmiTenureOptions(page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getEmiTenureOptionByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    sendError(res, 404, "PRODUCT_NOT_FOUND", "EMI tenure option not found")
    return
  }
  const option = await emiTenureService.getEmiTenureOptionById(id)
  if (!option) {
    sendError(res, 404, "PRODUCT_NOT_FOUND", "EMI tenure option not found")
    return
  }
  res.json({ success: true, data: option })
}

export async function getEmiTenureOptionsByProductIdHandler(req: Request, res: Response) {
  const productId = String(req.params.productId)
  if (!isValidUUID(productId)) {
    res.json({ success: true, data: [], total: 0, page: 1, limit: 20, totalPages: 0 })
    return
  }
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await emiTenureService.getEmiTenureOptionsByProductId(productId, page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getEmiTenureOptionsByProductSlugHandler(req: Request, res: Response) {
  const productSlug = String(req.params.productSlug)
  const result = await emiTenureService.getEmiTenureOptionsByProductSlug(productSlug)
  if (!result) {
    sendError(res, 404, "PRODUCT_NOT_FOUND", "Product not found")
    return
  }
  res.json({ success: true, data: result })
}
