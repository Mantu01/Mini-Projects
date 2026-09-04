import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export const footerCategoryGroups = pgTable("footer_category_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  heading: varchar("heading", { length: 255 }).notNull(),
  links: jsonb("links").$type<string[]>().notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const companyInfo = pgTable("company_info", {
  id: uuid("id").defaultRandom().primaryKey(),
  legalName: varchar("legal_name", { length: 512 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  hours: varchar("hours", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const quickLinks = pgTable("quick_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  href: varchar("href", { length: 512 }),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const supportLinks = pgTable("support_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  href: varchar("href", { length: 512 }),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const socialLinks = pgTable("social_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  platform: varchar("platform", { length: 100 }).notNull().unique(),
  url: varchar("url", { length: 512 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
