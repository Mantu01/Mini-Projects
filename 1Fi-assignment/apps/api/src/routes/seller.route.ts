import { Router, type Router as RouterType } from "express"
import {
  getAllSellersHandler,
  getSellerByIdHandler,
  getSellerBySlugHandler,
} from "../controller/seller.controller.js"

const router: RouterType = Router()

router.get("/", getAllSellersHandler)
router.get("/slug/:slug", getSellerBySlugHandler)
router.get("/:id", getSellerByIdHandler)

export default router
