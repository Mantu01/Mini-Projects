import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as sellerService from "@1fi/services"

function sendError(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ success: false, error: { code, message } })
}

export async function getAllSellersHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await sellerService.getAllSellers(page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getSellerByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    sendError(res, 404, "SELLER_NOT_FOUND", "Seller not found")
    return
  }
  const seller = await sellerService.getSellerById(id)
  if (!seller) {
    sendError(res, 404, "SELLER_NOT_FOUND", "Seller not found")
    return
  }
  res.json({ success: true, data: seller })
}

export async function getSellerBySlugHandler(req: Request, res: Response) {
  const slug = String(req.params.slug)
  const seller = await sellerService.getSellerBySlug(slug)
  if (!seller) {
    sendError(res, 404, "SELLER_NOT_FOUND", "Seller not found")
    return
  }
  res.json({ success: true, data: seller })
}
