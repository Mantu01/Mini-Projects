import {
  pgTable,
  uuid,
  varchar,
  integer,
  real,
  timestamp,
  index,
} from "drizzle-orm/pg-core"
import { products } from "./products.ts"

export const emiTenureOptions = pgTable(
  "emi_tenure_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    months: integer("months").notNull(),
    monthlyAmount: integer("monthly_amount").notNull(),
    badge: varchar("badge", { length: 100 }).notNull(),
    interestRate: varchar("interest_rate", { length: 100 }).notNull(),
    cashbackAmount: integer("cashback_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("emi_tenure_options_product_id_idx").on(table.productId),
  ],
)
