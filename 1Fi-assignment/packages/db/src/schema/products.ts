import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  real,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core"
import { categories } from "./categories.js"
import { sellers } from "./sellers.js"

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 512 }).notNull().unique(),
    name: text("name").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => sellers.id),
    brand: varchar("brand", { length: 255 }),
    topBrand: boolean("top_brand").default(false),
    price: integer("price").notNull(),
    mrp: integer("mrp").notNull(),
    markupPercent: integer("markup_percent").default(15),
    rating: real("rating").notNull(),
    overallRating: real("overall_rating"),
    soldCount: integer("sold_count").notNull(),
    images: jsonb("images").$type<string[]>().notNull(),
    colorOptions: jsonb("color_options").$type<string[]>().notNull(),
    selectedColor: varchar("selected_color", { length: 255 }),
    appStoreLink: varchar("app_store_link", { length: 512 }),
    playStoreLink: varchar("play_store_link", { length: 512 }),
    defaultTenureIndex: integer("default_tenure_index").default(0),
    downPayment: integer("down_payment"),
    emiStartLabel: varchar("emi_start_label", { length: 100 }),
    returnable: boolean("returnable").default(true),
    shippingText: text("shipping_text"),
    reviewMedia: jsonb("review_media")
      .$type<Array<{ type: "image" | "video"; thumbnail: string }>>()
      .default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    index("products_seller_id_idx").on(table.sellerId),
    index("products_brand_idx").on(table.brand),
    index("products_price_idx").on(table.price),
    index("products_rating_idx").on(table.rating),
    index("products_sold_count_idx").on(table.soldCount),
  ],
)

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantLabel: varchar("variant_label", { length: 255 }).notNull(),
    variantValue: varchar("variant_value", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_variants_product_id_idx").on(table.productId),
  ],
)

export const productSpecs = pgTable(
  "product_specs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 255 }).notNull(),
    value: text("value").notNull(),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_specs_product_id_idx").on(table.productId),
  ],
)

export const productTrustBadges = pgTable(
  "product_trust_badges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    icon: varchar("icon", { length: 100 }).notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_trust_badges_product_id_idx").on(table.productId),
  ],
)

export const productBreadcrumbs = pgTable(
  "product_breadcrumbs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 255 }).notNull(),
    href: varchar("href", { length: 512 }),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_breadcrumbs_product_id_idx").on(table.productId),
  ],
)

export const productOptions = pgTable(
  "product_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    color: varchar("color", { length: 255 }),
    variantLabel: varchar("variant_label", { length: 255 }),
    variantValue: varchar("variant_value", { length: 255 }),
    price: integer("price").notNull(),
    mrp: integer("mrp").notNull(),
    images: jsonb("images").$type<string[]>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_options_product_id_idx").on(table.productId),
    index("product_options_color_idx").on(table.color),
  ],
)
