import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core"

export const sellers = pgTable("sellers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  url: varchar("url", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
