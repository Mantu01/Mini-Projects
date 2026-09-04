import type { Request, Response } from "express"
import * as siteConfigService from "@1fi/services"

export async function getFooterCategoryGroupsHandler(_req: Request, res: Response) {
  const data = await siteConfigService.getFooterCategoryGroups()
  res.json({ success: true, data })
}

export async function getCompanyInfoHandler(_req: Request, res: Response) {
  const data = await siteConfigService.getCompanyInfo()
  if (!data) {
    res.status(404).json({ success: false, error: "Company info not found" })
    return
  }
  res.json({ success: true, data })
}

export async function getQuickLinksHandler(_req: Request, res: Response) {
  const data = await siteConfigService.getQuickLinks()
  res.json({ success: true, data })
}

export async function getSupportLinksHandler(_req: Request, res: Response) {
  const data = await siteConfigService.getSupportLinks()
  res.json({ success: true, data })
}

export async function getSocialLinksHandler(_req: Request, res: Response) {
  const data = await siteConfigService.getSocialLinks()
  res.json({ success: true, data })
}
