import { Router, type Router as RouterType } from "express"
import {
  getAllProductsHandler,
  searchProductsHandler,
  getProductsByCategoryHandler,
  getProductBySlugHandler,
  getProductWithRelationsHandler,
  getProductByIdHandler,
} from "../controller/product.controller.js"

const router: RouterType = Router()

router.get("/", getAllProductsHandler)
router.get("/search", searchProductsHandler)
router.get("/category/:categoryId", getProductsByCategoryHandler)
router.get("/slug/:slug", getProductBySlugHandler)
router.get("/:id/relations", getProductWithRelationsHandler)
router.get("/:id", getProductByIdHandler)

export default router
