import type { Request, Response } from "express"
import { parsePagination, isValidUUID } from "@1fi/services"
import * as emiTenureService from "@1fi/services"

export async function getAllEmiTenureOptionsHandler(req: Request, res: Response) {
  const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>)
  const result = await emiTenureService.getAllEmiTenureOptions(page, limit, offset)
  res.json({ success: true, ...result })
}

export async function getEmiTenureOptionByIdHandler(req: Request, res: Response) {
  const id = String(req.params.id)
  if (!isValidUUID(id)) {
    res.status(404).json({ success: false, error: "EMI tenure option not found" })
    return
  }
  const option = await emiTenureService.getEmiTenureOptionById(id)
  if (!option) {
    res.status(404).json({ success: false, error: "EMI tenure option not found" })
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
