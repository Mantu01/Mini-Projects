import { Router, type Router as RouterType } from "express"
import {
  getFooterCategoryGroupsHandler,
  getCompanyInfoHandler,
  getQuickLinksHandler,
  getSupportLinksHandler,
  getSocialLinksHandler,
} from "../controller/site-config.controller.js"

const router: RouterType = Router()

router.get("/footer", getFooterCategoryGroupsHandler)
router.get("/company", getCompanyInfoHandler)
router.get("/quick-links", getQuickLinksHandler)
router.get("/support-links", getSupportLinksHandler)
router.get("/social-links", getSocialLinksHandler)

export default router
