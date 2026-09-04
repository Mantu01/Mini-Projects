import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "./schema/index.js"

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

export * from "./schema/index.js"
export * from "./types.js"
export * from "./zod/index.js"
export * from "./repositories/index.js"
