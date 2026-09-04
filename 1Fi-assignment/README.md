# 1Fi — EMI-Enabled Product Marketplace

A full-stack marketplace application for browsing and purchasing smartphones through flexible EMI (Equated Monthly Installment) plans. The platform surfaces dynamic product information, multiple financing tenures with live pricing, and cashback offers — all served from a real database.

---

## What You Get

- **Product discovery** — browse smartphones with real-time pricing, ratings, and variant selection (color, storage)
- **EMI plan comparison** — side-by-side tenure cards showing monthly payment, interest rate, and cashback for each available plan
- **Product detail pages** — unique URL per product (`/products/<slug>`) with image gallery, specs, seller info, reviews, and trust badges
- **Category browsing** — filter products by category, with dedicated listing pages
- **Search** — query products by name across the catalog
- **Responsive UI** — works seamlessly on desktop and mobile

---

## How It Works

### Architecture

The application is organised as a monorepo managed by [Turborepo](https://turborepo.dev), with two runtime apps and a shared database package:

- **`apps/api`** — Express.js server serving RESTful product data
- **`apps/web`** — React + Vite storefront consuming the API
- **`packages/db`** — Drizzle ORM layer with schema definitions, repositories, Zod validators, and seed data

Infrastructure is containerised with [PostgreSQL](https://www.postgresql.org) for persistence and [Redis](https://redis.io) for caching.

### Data Layer

All product, variant, EMI tenure, and review data is loaded at startup from structured seed files into PostgreSQL via Drizzle migrations. No hardcoded UI values — every price, image, and plan comes from the database.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 · Vite 8 · Tailwind CSS 4 · shadcn/ui · React Router 7 |
| API | Node.js · Express 5 · Hono helpers |
| Database | PostgreSQL 15 · Drizzle ORM |
| Infra | Docker & Docker Compose · Redis 7 |
| Tooling | Turborepo · pnpm · TypeScript 7 |

---

## Quick Start

You need **Docker Desktop** (or equivalent) and **Node.js ≥ 24** installed.

```bash
# 1. Clone / open the repo root
cd 1Fi-assignment

# 2. Install all dependencies (installs across every workspace package)
pnpm install

# 3. Spin up Postgres and Redis via Docker Compose
docker compose up -d

# 4. Wait for the database to be healthy
docker compose exec postgresdb pg_isready   # press Enter repeatedly until "accepting connections"

# 5. Create the schema inside the running container
pnpm db:migrate

# 6. Load seed data (products, EMI plans, categories, reviews …)
pnpm db:seed
```

Once seeded, start both apps in parallel:

```bash
pnpm dev
```

Open **http://localhost:5173** in your browser.

> `pnpm dev` launches the API on port `8000` and the web app on port `5173`. A Turborepo task orchestrates both with hot-reload enabled.

---

## Environment Variables

Every `.env` file lives next to its app. Copy the template values (see below) if you want non-default ports or credentials.

### `apps/api/.env`

```env
PORT=8000
LOG_LEVEL=info
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/1fi_assignment
```

### `apps/web/.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### `packages/db/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/1fi_assignment
```

---

## API Reference

Base URL: `http://localhost:8000/api/v1`

All responses follow a consistent envelope: `{ success, data }`. Errors return `{ success: false, error: "<message>" }`.

### Products

```
GET /api/v1/products
```

Returns all products in the catalog. Each product includes id, slug, name, price, mrp, rating, images, color options, and default tenure index.

```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3",
      "slug": "iphone-17-pro-silver-256gb",
      "name": "iPhone 17 Pro Silver 256 GB",
      "price": 8499,
      "mrp": 139900,
      "rating": 4.5,
      "images": ["https://…/img1.jpg", "https://…/img2.jpg"],
      "colorOptions": ["Silver", "Space Black", "Gold"],
      "selectedColor": "Silver",
      "defaultTenureIndex": 0
    }
  ]
}
```

```
GET /api/v1/products/home
```

Top products featured on the homepage. Payload shape matches `GET /products`.

---

```
GET /api/v1/products/slug/:slug
```

Single product by URL-friendly slug.

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3",
    "slug": "iphone-17-pro-silver-256gb",
    "name": "iPhone 17 Pro Silver 256 GB",
    "price": 8499,
    "mrp": 139900,
    "rating": 4.5,
    "overallRating": 4.3,
    "soldCount": 1243,
    "images": ["https://…/img1.jpg"],
    "colorOptions": ["Silver", "Space Black"],
    "selectedColor": "Silver",
    "shippingText": "Free shipping",
    "downPayment": 0,
    "emiStartLabel": "Starting ₹8,499/mo"
  }
}
```

---

```
GET /api/v1/products/slug/:slug/relations
```

Full product with all relations eagerly joined — variants, specs, trust badges, breadcrumbs, EMI tenure options, and reviews in one response. Used by the product detail page.

```json
{
  "success": true,
  "data": {
    "product": { /* same shape as above */ },
    "variants": [
      { "label": "Storage", "value": "256 GB" },
      { "label": "Color", "value": "Silver" }
    ],
    "specs": [
      { "label": "Display", "value": "6.3\" OLED", "sortOrder": 0 },
      { "label": "Processor", "value": "A19 Pro", "sortOrder": 1 }
    ],
    "trustBadges": [
      { "icon": "shield-check", "label": "Genuine Product" },
      { "icon": "truck", "label": "Free Delivery" }
    ],
    "breadcrumb": [
      { "label": "Shop on EMI", "href": "/" },
      { "label": "Smart Phones", "href": "/category/smart-phones" },
      { "label": "iPhone 17 Pro Silver 256 GB", "href": null }
    ],
    "emiTenureOptions": [
      {
        "months": 3,
        "monthlyAmount": 4644,
        "interestRate": 0,
        "cashbackAmount": 1500,
        "badge": "Most Popular"
      },
      {
        "months": 6,
        "monthlyAmount": 2367,
        "interestRate": 0,
        "cashbackAmount": 800,
        "badge": null
      }
    ],
    "reviews": [
      {
        "stars": 5,
        "text": "Amazing phone, blazing fast.",
        "reviewerName": "Aarav S.",
        "city": "Mumbai",
        "verified": true,
        "timeAgo": "2 weeks ago",
        "attachments": [
          { "type": "image", "thumbnail": "https://…/review1.jpg" }
        ]
      }
    ]
  }
}
```

---

```
GET /api/v1/products/search?query=<term>
GET /api/v1/products/category-id/:categoryId
GET /api/v1/products/category/:categorySlug
GET /api/v1/products/:id
```

Additional listing and lookup endpoints — all return the same product envelope.

### Categories

```
GET /api/v1/categories
```

Returns all product categories with their slugs for navigation.

```json
{
  "success": true,
  "data": [
    { "id": "cat-1", "name": "Smart Phones", "slug": "smart-phones" },
    { "id": "cat-2", "name": "Headphones", "slug": "headphones" }
  ]
}
```

### EMI Tenure Options

```
GET /api/v1/emi-tenure-options
```

All EMI plan configurations indexed by product.

```json
{
  "success": true,
  "data": [
    {
      "productId": "a1b2c3",
      "months": 3,
      "monthlyAmount": 4644,
      "interestRate": 0,
      "cashbackAmount": 1500,
      "badge": "Most Popular"
    }
  ]
}
```

### Reviews

```
GET /api/v1/reviews?productId=<id>
```

Customer reviews for a given product, including star rating, text, city, verification status, and media attachments.

### Site Config

```
GET /api/v1/site-config
```

Global site metadata — footer category groups, company info, quick links, social links. Populated once during seeding.

```json
{
  "success": true,
  "data": {
    "footerCategoryGroups": [
      { "heading": "Electronics on EMI", "links": ["Smart Phones on EMI", "Headphones on EMI"] }
    ],
    "companyInfo": {
      "legalName": "Snapmint Credit Advisory Private Limited",
      "address": "Office No. 401, Skyline Business Park, Andheri East, Mumbai - 400069",
      "phone": "022-67890000",
      "hours": "Monday to Sunday (10AM to 7PM)"
    },
    "quickLinks": ["About Us", "Careers", "FAQ"],
    "supportLinks": ["Return Policy", "Contact Us", "Terms and Conditions"],
    "socialLinks": { "facebook": "#", "instagram": "#", "twitter": "#", "youtube": "#" }
  }
}
```

### Health Check

```
GET /health
```

```json
{ "status": "ok", "timestamp": "2026-09-04T10:30:00.000Z" }
```

---

## Running the Database Manually

If you prefer to skip Docker, start PostgreSQL locally and update the connection string in every `.env` file before running migrations:

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
```

Then run:

```bash
pnpm db:migrate
pnpm db:seed
```

To inspect or edit the database directly:

```bash
pnpm db:studio
```

This opens the Drizzle Studio web UI for visual database inspection.

---

## Available Scripts

Run from the repository root.

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start API + web app with hot-reload |
| `pnpm build` | Build both apps for production |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all TypeScript / Markdown files with Prettier |
| `pnpm check-types` | Type-check every package |
| `pnpm db:migrate` | Apply pending schema migrations |
| `pnpm db:push` | Push schema changes without a migration file |
| `pnpm db:generate` | Generate migration files from schema drift |
| `pnpm db:seed` | Populate the database with sample products |
| `pnpm db:studio` | Open Drizzle Studio for visual DB inspection |

---

## License

Private — for demonstration purposes only.
