import { Router, type Router as RouterType } from "express"
import {
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  getCategoryBySlugHandler,
} from "../controller/category.controller.js"

const router: RouterType = Router()

router.get("/", getAllCategoriesHandler)
router.get("/slug/:slug", getCategoryBySlugHandler)
router.get("/:id", getCategoryByIdHandler)

export default router
