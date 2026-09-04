# Backend — API server

An Express 5 server running on Node.js, organised as a thin routing layer over service functions that live in the shared `@1fi/services` package. All business logic, validation, and database access happen there; controllers only handle HTTP concerns.

---

## Running individually

```bash
# From the repo root, install first:
pnpm install

# Then start only the API:
pnpm --filter @1fi/api dev
```

The server starts on port **8000** (from `.env`). With `tsx watch` enabled it restarts automatically on source changes.

Production build + run:

```bash
pnpm --filter @1fi/api build   # compiles to apps/api/dist/
pnpm --filter @1fi/api start    # runs node dist/server.js
```

Type-check:

```bash
pnpm --filter @1fi/api check-types
```

---

## Environment

All keys live in `apps/api/.env`:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `8000` | HTTP listen port |
| `LOG_LEVEL` | `info` | Minimum severity (`debug` · `info` · `warn` · `error`) |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/1fi_assignment` | PostgreSQL connection string |

---

## Project layout

```
apps/api/src/
├── server.ts          # Express app setup — cors, morgan, body-parser, routes, error handler
├── controller/
│   ├── product.controller.ts
│   ├── category.controller.ts
│   ├── seller.controller.ts
│   ├── review.controller.ts
│   ├── emi-tenure.controller.ts
│   └── site-config.controller.ts
└── routes/
    ├── products.route.ts
    ├── category.route.ts
    ├── seller.route.ts
    ├── review.route.ts
    ├── emi-tenure.route.ts
    └── site-config.route.ts
```

Shared dependencies (used by both API and any other app):

```
packages/
├── db/              # Drizzle schema, repositories, zod validators, seed.ts
├── services/        # business logic — services imported by controllers
├── logger/          # structured logger wrapping console
└── eslint-config/   # shared ESLint rules
```

---

## Response helpers

Two internal helpers keep the shape consistent across every controller:

```ts
sendPaginated(res, { data, meta })   // sets X-Total-Count / X-Page / X-Per-Page headers
sendError(res, status, code, msg)   // { success: false, error: { code, message } }
```

Error codes are machine-readable strings used by the frontend's `ApiClientError`:

| Code | Meaning |
|------|---------|
| `PRODUCT_NOT_FOUND` | requested product id/slug not in DB |
| `CATEGORY_NOT_FOUND` | requested category id/slug not in DB |
| `SELLER_NOT_FOUND` | requested seller id/slug not in DB |
| `REVIEW_NOT_FOUND` | requested review id not in DB |
| `VALIDATION_ERROR` | missing or malformed query parameter |
| `NETWORK_ERROR` | upstream / connection failure |

---

## Full API reference

Base path: `http://localhost:8000/api/v1`

### Products

#### `GET /api/v1/products`

List all products with optional pagination.

```
?page=1&limit=20
```

Response:

```json
{
  "success": true,
  "items": [
    {
      "id": "a1b2c3",
      "sku": "IPHONE17PRO256",
      "slug": "iphone-17-pro-silver-256gb",
      "name": "iPhone 17 Pro Silver 256 GB",
      "brand": "Apple",
      "topBrand": true,
      "price": 8499,
      "mrp": 139900,
      "rating": 4.5,
      "overallRating": 4.3,
      "soldCount": 1243,
      "images": ["https://…/img1.jpg"],
      "selectedColor": "Silver",
      "colorOptions": ["Silver", "Space Black", "Gold"],
      "categoryId": "cat-uuid",
      "sellerId": "seller-uuid",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

---

#### `GET /api/v1/products/home`

Homepage carousel — groups products by category for the landing page.

```
?categoriesLimit=4&productsPerCategory=4
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "title": "Smart Phones",
      "slug": "smart-phones",
      "products": [ /* ProductSummary[] */ ]
    }
  ]
}
```

---

#### `GET /api/v1/products/search?q=<term>&page=1&limit=20`

Full-text search across product names. Returns empty items with total 0 when no match.

---

#### `GET /api/v1/products/category/:categorySlug?page=1&limit=12`

Products in a named category. The slug is looked up; a missing slug returns a 404.

---

#### `GET /api/v1/products/category-id/:categoryId?page=1&limit=20`

Same as above but filtered by UUID instead of slug. Invalid UUID returns an empty paginated response silently.

---

#### `GET /api/v1/products/slug/:slug`

Lightweight product summary — no joined relations.

---

#### `GET /api/v1/products/slug/:slug/relations`

Full product with every relation eager-loaded in a single response. This is the endpoint the product detail page uses.

```json
{
  "success": true,
  "data": {
    "product": { /* ProductSummary shape plus extra flags */ },
    "variants": [{ "id": "...", "productId": "...", "variantLabel": "Storage", "variantValue": "256 GB" }],
    "options": [{ "id": "...", "color": "Silver", "price": 8499, "mrp": 139900, "images": ["..."] }],
    "specs": [{ "id": "...", "label": "Display", "value": "6.3\" OLED", "sortOrder": 0 }],
    "trustBadges": [{ "id": "...", "icon": "shield-check", "label": "Genuine Product" }],
    "breadcrumbs": [{ "id": "...", "label": "Shop on EMI", "href": "/", "sortOrder": 0 }],
    "emiTenureOptions": [
      {
        "id": "...",
        "months": 3,
        "monthlyAmount": 4644,
        "badge": "Most Popular",
        "interestRate": "0%",
        "cashbackAmount": 1500
      }
    ],
    "reviews": [
      {
        "id": "...",
        "stars": 5,
        "variantDescription": "Silver · 256 GB",
        "text": "Amazing phone.",
        "reviewerName": "Aarav S.",
        "city": "Mumbai",
        "verified": true,
        "timeAgo": "2 weeks ago",
        "attachments": [{ "id": "...", "type": "image", "thumbnail": "https://…" }]
      }
    ]
  }
}
```

---

#### `GET /api/v1/products/:id`

Lookup by internal UUID.

---

#### `GET /api/v1/products/:id/relations`

Same eager-loaded payload as `slug/:slug/relations` but keyed by UUID.

---

### Categories

#### `GET /api/v1/categories?page=1&limit=50`

```json
{
  "success": true,
  "items": [
    { "id": "uuid", "name": "Smart Phones", "slug": "smart-phones", "createdAt": "…", "updatedAt": "…" }
  ],
  "total": 12,
  "page": 1,
  "limit": 50,
  "totalPages": 1
}
```

---

#### `GET /api/v1/categories/:id`

Single category by UUID. Returns 404 if not found.

---

#### `GET /api/v1/categories/slug/:slug`

Single category by human-readable slug. Used by the frontend category lookup.

---

### Sellers

#### `GET /api/v1/sellers?page=1&limit=20`

#### `GET /api/v1/sellers/:id`

#### `GET /api/v1/sellers/slug/:slug`

Standard CRUD-style endpoints. Seller objects carry `id`, `name`, `slug`, `url`, `createdAt`, `updatedAt`.

---

### EMI Tenure Options

#### `GET /api/v1/emi-tenure-options?page=1&limit=20`

All tenure configurations across all products.

---

#### `GET /api/v1/emi-tenure-options/:id`

Single option by UUID.

---

#### `GET /api/v1/emi-tenure-options/product/:productId?page=1&limit=20`

Tenures filtered by product UUID.

---

#### `GET /api/v1/emi-tenure-options/product/:productSlug`

Tenures filtered by product slug (no pagination — returns the array directly). This is the endpoint consumed by the frontend.

---

### Reviews

#### `GET /api/v1/reviews?page=1&limit=20`

All reviews site-wide.

---

#### `GET /api/v1/reviews/:id`

Single review by UUID.

---

#### `GET /api/v1/reviews/product/:productId?page=1&limit=20`

Paginated reviews for a product by UUID.

---

#### `GET /api/v1/reviews/product/:productSlug`

Flat array of reviews for a product by slug (no pagination). Used by the reviews page.

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "stars": 5,
      "variantDescription": "Silver · 256 GB",
      "text": "Excellent camera quality.",
      "reviewerName": "Priya M.",
      "city": "Delhi",
      "verified": true,
      "timeAgo": "1 month ago",
      "attachments": [{ "id": "att-uuid", "type": "image", "thumbnail": "https://…" }]
    }
  ],
  "total": 47
}
```

---

### Site Config

All endpoints return `{ success: true, data: … }`.

#### `GET /api/v1/site-config/footer-category-groups`

```json
{ "success": true, "data": [{ "id": "…", "heading": "Electronics on EMI", "links": ["Smart Phones on EMI"], "sortOrder": 0 }] }
```

#### `GET /api/v1/site-config/company-info`

```json
{ "success": true, "data": { "legalName": "Snapmint Credit Advisory Private Limited", "address": "…", "phone": "…", "hours": "…" } }
```

#### `GET /api/v1/site-config/quick-links`

```json
{ "success": true, "data": [{ "label": "About Us", "href": null, "sortOrder": 0 }] }
```

#### `GET /api/v1/site-config/support-links`

```json
{ "success": true, "data": [{ "label": "Return Policy", "href": null, "sortOrder": 0 }] }
```

#### `GET /api/v1/site-config/social-links`

```json
{ "success": true, "data": [{ "platform": "facebook", "url": "https://…" }] }
```

---

### Health

#### `GET /health`

```json
{ "status": "ok", "timestamp": "2026-09-04T10:30:00.000Z" }
```

---

## Middleware stack (in order)

1. `cors({ origin: FRONTEND_URL, credentials: true })`
2. `morgan('dev')` — request logging to stdout
3. `express.json()` + `express.urlencoded({ extended: true })`
4. Route handlers
5. Global error handler — catches thrown errors, logs with structured logger, returns `{ success: false, error: err.message }` at 500

---

## Pagination utility

`parsePagination(query)` from `@1fi/services` normalises `page` and `limit` query params with sensible defaults (`page=1`, `limit=20`) and returns `{ page, limit, offset }`. All list endpoints use it.
