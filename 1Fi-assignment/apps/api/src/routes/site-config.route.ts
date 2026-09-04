import { Router, type Router as RouterType } from "express"
import * as siteConfigService from "@1fi/services"

const router: RouterType = Router()

interface SiteConfigData {
  footerCategoryGroups: ReturnType<typeof siteConfigService.getFooterCategoryGroups>
  companyInfo: NonNullable<ReturnType<typeof siteConfigService.getCompanyInfo>>
  quickLinks: ReturnType<typeof siteConfigService.getQuickLinks>
  supportLinks: ReturnType<typeof siteConfigService.getSupportLinks>
  socialLinks: ReturnType<typeof siteConfigService.getSocialLinks>
}

router.get("/", async (_req, res) => {
  const [footerCategoryGroups, companyInfo, quickLinks, supportLinks, socialLinks] = await Promise.all([
    siteConfigService.getFooterCategoryGroups(),
    siteConfigService.getCompanyInfo(),
    siteConfigService.getQuickLinks(),
    siteConfigService.getSupportLinks(),
    siteConfigService.getSocialLinks(),
  ])
  res.json({ success: true, data: { footerCategoryGroups, companyInfo, quickLinks, supportLinks, socialLinks } })
})

router.get("/footer", async (_req, res) => {
  const data = await siteConfigService.getFooterCategoryGroups()
  res.json({ success: true, data })
})

router.get("/company", async (_req, res) => {
  const data = await siteConfigService.getCompanyInfo()
  if (!data) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Company info not found" } })
    return
  }
  res.json({ success: true, data })
})

router.get("/quick-links", async (_req, res) => {
  const data = await siteConfigService.getQuickLinks()
  res.json({ success: true, data })
})

router.get("/support-links", async (_req, res) => {
  const data = await siteConfigService.getSupportLinks()
  res.json({ success: true, data })
})

router.get("/social-links", async (_req, res) => {
  const data = await siteConfigService.getSocialLinks()
  res.json({ success: true, data })
})

export default router
