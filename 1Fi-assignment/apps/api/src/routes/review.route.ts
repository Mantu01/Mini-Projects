import { Router, type Router as RouterType } from "express"
import {
  getAllReviewsHandler,
  getReviewsByProductIdHandler,
  getReviewByIdHandler,
} from "../controller/review.controller.js"

const router: RouterType = Router()

router.get("/", getAllReviewsHandler)
router.get("/product/:productId", getReviewsByProductIdHandler)
router.get("/:id", getReviewByIdHandler)

export default router
