import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core"
import { products } from "./products.ts"

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    stars: integer("stars").notNull(),
    variantDescription: varchar("variant_description", { length: 512 }),
    text: text("text").notNull(),
    reviewerName: varchar("reviewer_name", { length: 255 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    verified: boolean("verified").default(true),
    timeAgo: varchar("time_ago", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("reviews_product_id_idx").on(table.productId),
    index("reviews_stars_idx").on(table.stars),
  ],
)

export const reviewAttachments = pgTable(
  "review_attachments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reviewId: uuid("review_id")
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 10 }).notNull(),
    thumbnail: varchar("thumbnail", { length: 512 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("review_attachments_review_id_idx").on(table.reviewId),
  ],
)
