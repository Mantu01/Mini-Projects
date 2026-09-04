import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "./schema/index.ts"

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

export * from "./schema/index.ts"
export * from "./types.ts"
export * from "./zod/index.ts"
export * from "./repositories/index.ts"
