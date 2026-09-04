import "dotenv/config"
import type { NextFunction } from "express"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import { createLogger, type LogLevel } from "@1fi/logger"
import categoryRoutes from "./routes/category.route.js"
import sellerRoutes from "./routes/seller.route.js"
import productRoutes from "./routes/products.route.js"
import reviewRoutes from "./routes/review.route.js"
import emiTenureRoutes from "./routes/emi-tenure.route.js"
import siteConfigRoutes from "./routes/site-config.route.js"

const app: import("express").Application = express()
const PORT = Number(process.env.PORT) || 8000
const LOG_LEVEL = (process.env.LOG_LEVEL || "info") as LogLevel

const logger = createLogger({
  prefix: "api",
  level: LOG_LEVEL,
})

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)

app.use(
  morgan((tokens, req, res) => {
    const msg = `${tokens.method!(req, res)} ${tokens.url!(req, res)} ${tokens.status!(req, res)} ${tokens["response-time"]!(req, res)} ms`
    const status = Number(tokens.status!(req, res))
    if (status >= 400) {
      logger.warn(msg, { method: req.method, url: req.url, status })
    } else {
      logger.info(msg, { method: req.method, url: req.url, status })
    }
    return null
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use("/api/categories", categoryRoutes)
app.use("/api/sellers", sellerRoutes)
app.use("/api/products", productRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/emi-tenure-options", emiTenureRoutes)
app.use("/api/site-config", siteConfigRoutes)

app.use((err: Error, _req: express.Request, res: express.Response, _next: NextFunction) => {
  logger.error(err.message, { stack: err.stack })
  res.status(500).json({ success: false, error: err.message })
})

app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`)
})

export { app }
