import { Router, type Router as RouterType } from "express"
import {
  getAllReviewsHandler,
  getReviewsByProductIdHandler,
  getReviewsByProductSlugHandler,
  getReviewByIdHandler,
} from "../controller/review.controller.js"

const router: RouterType = Router()

router.get("/", getAllReviewsHandler)
router.get("/product/:productSlug", getReviewsByProductSlugHandler)
router.get("/product-id/:productId", getReviewsByProductIdHandler)
router.get("/:id", getReviewByIdHandler)

export default router
