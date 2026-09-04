# Database — schema & seed data

PostgreSQL 15 backend accessed through Drizzle ORM (v0.45). Schema lives in `packages/db/src/schema/`. Migrations and seeding are driven by `drizzle-kit`.

---

## Running the database independently

### Via Docker Compose (recommended)

```bash
# Start Postgres + Redis containers
docker compose up -d

# Wait until healthy
docker compose exec postgresdb pg_isready
```

The container credentials match the default `.env`:

```
host:     localhost
port:     5432
database: 1fi_assignment
user:     postgres
password: postgres
```

### Connecting manually (outside Docker)

If you have your own PostgreSQL running, update `DATABASE_URL` in these three files:

- `packages/db/.env`
- `apps/api/.env`

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/1fi_assignment
```

Then run the steps below against your own server.

---

## Lifecycle commands

All commands run from the repository root and target the `packages/db` workspace package.

```bash
# Generate migration files from schema drift
pnpm db:generate

# Apply pending migrations to the database
pnpm db:migrate

# Push schema directly without creating migration files
pnpm db:push

# Seed the database with all sample products, plans, and site content
pnpm db:seed

# Open the interactive Drizzle Studio UI
pnpm db:studio
```

Studio URL after running `pnpm db:studio`: http://localhost:4173

---

## Table schema

### `categories`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `name` | varchar(255) | NOT NULL, UNIQUE |
| `slug` | varchar(255) | NOT NULL, UNIQUE |
| `created_at` | timestamp | NOT NULL, defaultNow |
| `updated_at` | timestamp | NOT NULL, defaultNow |

Seed: populated from `apps/web/src/data/site.ts` (`siteCategories` array).

---

### `sellers`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `name` | varchar(255) | NOT NULL |
| `slug` | varchar(255) | NOT NULL, UNIQUE |
| `url` | varchar(512) | nullable |
| `created_at` | timestamp | NOT NULL, defaultNow |
| `updated_at` | timestamp | NOT NULL, defaultNow |

---

### `products`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `sku` | varchar(100) | NOT NULL, UNIQUE |
| `slug` | varchar(512) | NOT NULL, UNIQUE |
| `name` | text | NOT NULL |
| `category_id` | uuid | FK → `categories.id`, NOT NULL |
| `seller_id` | uuid | FK → `sellers.id`, NOT NULL |
| `brand` | varchar(255) | nullable |
| `top_brand` | boolean | default false |
| `price` | integer | NOT NULL |
| `mrp` | integer | NOT NULL |
| `markup_percent` | integer | default 15 |
| `rating` | real | NOT NULL |
| `overall_rating` | real | nullable |
| `sold_count` | integer | NOT NULL |
| `images` | jsonb (`string[]`) | NOT NULL |
| `color_options` | jsonb (`string[]`) | NOT NULL |
| `selected_color` | varchar(255) | nullable |
| `app_store_link` | varchar(512) | nullable |
| `play_store_link` | varchar(512) | nullable |
| `default_tenure_index` | integer | default 0 |
| `down_payment` | integer | nullable |
| `emi_start_label` | varchar(100) | nullable |
| `returnable` | boolean | default true |
| `shipping_text` | text | nullable |
| `review_media` | jsonb | default `[]` |
| `created_at` | timestamp | NOT NULL, defaultNow |
| `updated_at` | timestamp | NOT NULL, defaultNow |

**Indexes:** `products_category_id_idx`, `products_seller_id_idx`, `products_brand_idx`, `products_price_idx`, `products_rating_idx`, `products_sold_count_idx`

---

### `product_variants`

Tracks per-product attribute pairs (e.g. Storage = 256 GB, Colour = Silver).

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `product_id` | uuid | FK → `products.id` ON DELETE CASCADE, NOT NULL |
| `variant_label` | varchar(255) | NOT NULL |
| `variant_value` | varchar(255) | NOT NULL |
| `created_at` | timestamp | NOT NULL, defaultNow |

**Index:** `product_variants_product_id_idx`

---

### `product_specs`

Structured key–value specs displayed in the product details panel (e.g. Display = 6.3" OLED).

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `product_id` | uuid | FK → `products.id` ON DELETE CASCADE, NOT NULL |
| `label` | varchar(255) | NOT NULL |
| `value` | text | NOT NULL |
| `sort_order` | integer | default 0 |
| `created_at` | timestamp | NOT NULL, defaultNow |

**Index:** `product_specs_product_id_idx`

---

### `product_trust_badges`

Icon + label badges shown under pricing (e.g. "Genuine Product", "Free Delivery").

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `product_id` | uuid | FK → `products.id` ON DELETE CASCADE, NOT NULL |
| `icon` | varchar(100) | NOT NULL |
| `label` | varchar(255) | NOT NULL |
| `created_at` | timestamp | NOT NULL, defaultNow |

**Index:** `product_trust_badges_product_id_idx`

---

### `product_breadcrumbs`

Per-product navigation trail stored in the database rather than hard-coded.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `product_id` | uuid | FK → `products.id` ON DELETE CASCADE, NOT NULL |
| `label` | varchar(255) | NOT NULL |
| `href` | varchar(512) | nullable |
| `sort_order` | integer | default 0 |
| `created_at` | timestamp | NOT NULL, defaultNow |

**Index:** `product_breadcrumbs_product_id_idx`

---

### `product_options`

Independent SKUs within a product — each colour/storage combo gets its own price, MRP, and image set.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `product_id` | uuid | FK → `products.id` ON DELETE CASCADE, NOT NULL |
| `color` | varchar(255) | nullable |
| `variant_label` | varchar(255) | nullable |
| `variant_value` | varchar(255) | nullable |
| `price` | integer | NOT NULL |
| `mrp` | integer | NOT NULL |
| `images` | jsonb (`string[]`) | nullable |
| `created_at` | timestamp | NOT NULL, defaultNow |

**Indexes:** `product_options_product_id_idx`, `product_options_color_idx`

---

### `emi_tenure_options`

EMI financing plans per product — one row per tenure length.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `product_id` | uuid | FK → `products.id` ON DELETE CASCADE, NOT NULL |
| `months` | integer | NOT NULL |
| `monthly_amount` | integer | NOT NULL |
| `badge` | varchar(100) | NOT NULL (e.g. "Most Popular") |
| `interest_rate` | varchar(100) | NOT NULL (e.g. "0%", "10.5%") |
| `cashback_amount` | integer | NOT NULL |
| `created_at` | timestamp | NOT NULL, defaultNow |

**Index:** `emi_tenure_options_product_id_idx`

---

### `reviews`

Customer reviews attached to a product.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `product_id` | uuid | FK → `products.id` ON DELETE CASCADE, NOT NULL |
| `stars` | integer | NOT NULL |
| `variant_description` | varchar(512) | nullable |
| `text` | text | NOT NULL |
| `reviewer_name` | varchar(255) | NOT NULL |
| `city` | varchar(255) | NOT NULL |
| `verified` | boolean | default true |
| `time_ago` | varchar(100) | nullable |
| `created_at` | timestamp | NOT NULL, defaultNow |

**Indexes:** `reviews_product_id_idx`, `reviews_stars_idx`

---

### `review_attachments`

Images and videos uploaded alongside a review.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `review_id` | uuid | FK → `reviews.id` ON DELETE CASCADE, NOT NULL |
| `type` | varchar(10) | NOT NULL (`"image"` or `"video"`) |
| `thumbnail` | varchar(512) | NOT NULL |
| `created_at` | timestamp | NOT NULL, defaultNow |

**Index:** `review_attachments_review_id_idx`

---

### `footer_category_groups`

Site-wide footer navigation grouped by heading.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `heading` | varchar(255) | NOT NULL |
| `links` | jsonb (`string[]`) | NOT NULL |
| `sort_order` | integer | default 0 |
| `created_at` | timestamp | NOT NULL, defaultNow |

---

### `company_info`

Single-row table holding the legal entity footer text.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `legal_name` | varchar(512) | NOT NULL |
| `address` | text | NOT NULL |
| `phone` | varchar(50) | NOT NULL |
| `hours` | varchar(255) | NOT NULL |
| `created_at` | timestamp | NOT NULL, defaultNow |
| `updated_at` | timestamp | NOT NULL, defaultNow |

---

### `quick_links`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `label` | varchar(255) | NOT NULL |
| `href` | varchar(512) | nullable |
| `sort_order` | integer | default 0 |
| `created_at` | timestamp | NOT NULL, defaultNow |

---

### `support_links`

Same shape as `quick_links`.

---

### `social_links`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, defaultRandom |
| `platform` | varchar(100) | NOT NULL, UNIQUE (e.g. `"facebook"`, `"instagram"`) |
| `url` | varchar(512) | NOT NULL |
| `created_at` | timestamp | NOT NULL, defaultNow |

---

## Entity relationship diagram

```
categories ──< products >── sellers
                   │
                   ├─< product_variants
                   ├─< product_options
                   ├─< product_specs
                   ├─< product_trust_badges
                   ├─< product_breadcrumbs
                   ├─< emi_tenure_options
                   │
                   └─< reviews >──< review_attachments
```

Every child table has `ON DELETE CASCADE` on its `product_id` / `review_id` foreign key, so deleting a product removes all related data automatically.

---

## Seed data

`packages/db/src/seed.ts` populates the database from static TypeScript modules shipped with the project:

- `apps/web/src/data/catalog.ts` — product catalog (SKUs, images, tenures, reviews, specs, trust badges, breadcrumbs)
- `apps/web/src/data/site.ts` — categories, footer groups, company info, social links, quick/support links

Seed is idempotent: `.onConflictDoNothing()` ensures re-running it is safe. It prints progress every 50 products and exits cleanly.

---

## Drizzle kit config

`packages/db/drizzle.config.ts`:

```ts
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

Migration files are generated into `packages/db/drizzle/`.

---

## Zod validators

Schema-level input validation lives in `packages/db/src/zod/index.ts`. Every entity has a `create*Schema` and an `update*Schema` exported for use by service functions. The API does not accept direct user writes today — the schemas are reserved for future admin endpoints.
