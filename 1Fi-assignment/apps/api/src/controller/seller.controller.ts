import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as sellerService from "@1fi/services"

export async function getAllSellersHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await sellerService.getAllSellers(page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getSellerByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    res.status(404).json({ success: false, error: "Seller not found" })
    return
  }
  const seller = await sellerService.getSellerById(id)
  if (!seller) {
    res.status(404).json({ success: false, error: "Seller not found" })
    return
  }
  res.json({ success: true, data: seller })
}

export async function getSellerBySlugHandler(req: Request, res: Response) {
  const slug = String(req.params.slug)
  const seller = await sellerService.getSellerBySlug(slug)
  if (!seller) {
    res.status(404).json({ success: false, error: "Seller not found" })
    return
  }
  res.json({ success: true, data: seller })
}
