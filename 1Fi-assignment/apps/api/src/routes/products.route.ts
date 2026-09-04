import { Router, type Router as RouterType } from "express"
import {
  getAllProductsHandler,
  getHomeProductsHandler,
  searchProductsHandler,
  getProductsByCategoryHandler,
  getProductsByCategorySlugHandler,
  getProductBySlugHandler,
  getProductWithRelationsHandler,
  getProductWithRelationsBySlugHandler,
  getProductByIdHandler,
} from "../controller/product.controller.js"

const router: RouterType = Router()

router.get("/", getAllProductsHandler)
router.get("/home", getHomeProductsHandler)
router.get("/search", searchProductsHandler)
router.get("/category/:categorySlug", getProductsByCategorySlugHandler)
router.get("/category-id/:categoryId", getProductsByCategoryHandler)
router.get("/slug/:slug/relations", getProductWithRelationsBySlugHandler)
router.get("/slug/:slug", getProductBySlugHandler)
router.get("/:id/relations", getProductWithRelationsHandler)
router.get("/:id", getProductByIdHandler)

export default router
