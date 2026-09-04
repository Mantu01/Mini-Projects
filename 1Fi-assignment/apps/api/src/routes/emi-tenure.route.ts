import { Router, type Router as RouterType } from "express"
import {
  getAllEmiTenureOptionsHandler,
  getEmiTenureOptionsByProductIdHandler,
  getEmiTenureOptionByIdHandler,
} from "../controller/emi-tenure.controller.js"

const router: RouterType = Router()

router.get("/", getAllEmiTenureOptionsHandler)
router.get("/product/:productId", getEmiTenureOptionsByProductIdHandler)
router.get("/:id", getEmiTenureOptionByIdHandler)

export default router
