# API Documentation

This document lists all API endpoints required to replace the current mock data layer (`src/context/store.tsx`) with real backend endpoints. It covers every data flow used by the application pages and components.

---

## Base URL

```
GET http://localhost:8000/api/v1
```

---

## Shared Response Wrapper

Every response is wrapped in:

```json
{
  "success": true,
  ...payload
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

| Code | Status | Description |
|------|--------|-------------|
| `PRODUCT_NOT_FOUND` | 404 | Product slug or UUID doesn't exist |
| `CATEGORY_NOT_FOUND` | 404 | Category slug or UUID doesn't exist |
| `INVALID_PAGE` | 400 | `page` must be >= 1 |
| `VALIDATION_ERROR` | 400 | Invalid query parameters |
| `UNAUTHORIZED` | 401 | Auth required |

Pagination query params accepted on all list endpoints: `page` (default 1), `limit` (default 20). Response shape: `{ items, total, page, limit, totalPages }`.

---

## Endpoints

### 1. `GET /categories`

Returns all categories (used to build the nav bar and resolve category names on the home page).

**Query Parameters:** None

**Response (200):**

```json
{
  "success": true,
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Mobiles",
      "slug": "mobiles",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 9,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

**Used by:** `CategoryNavBar` (top nav), `HomePage` (row titles)

---

### 2. `GET /categories/slug/:slug`

Returns a single category by its kebab-case slug (e.g. `mobiles`). Used when the category page needs metadata about the current category.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Category slug (e.g. `mobiles`, `electronics`) |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Mobiles",
    "slug": "mobiles",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (404):**

```json
{ "success": false, "error": { "code": "CATEGORY_NOT_FOUND", "message": "Category not found" } }
```

**Used by:** None directly from current UI — kept for future use or internal category resolution.

---

### 3. `GET /products`

Returns all products, paginated. Used by `HomePage` to compute category rows client-side (the store calls this once and groups products by category in memory).

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 20 | Products per page |

**Response (200):**

```json
{
  "success": true,
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "sku": "SKU-IPH-17P-256-SLV",
      "slug": "apple-iphone-17-pro-silver-256-gb",
      "name": "Apple iPhone 17 Pro (Silver, 256 GB)",
      "brand": "Apple",
      "topBrand": true,
      "price": 134900,
      "mrp": 149900,
      "rating": 4.2,
      "overallRating": 4.17,
      "soldCount": 70,
      "images": [
        "https://placehold.co/400x400/f5f5f5/333?text=Front",
        "https://placehold.co/400x400/f5f5f5/333?text=Back"
      ],
      "selectedColor": "Silver",
      "colorOptions": ["Silver", "Cosmic Orange", "Deep Blue"],
      "categoryId": "550e8400-e29b-41d4-a716-446655440000",
      "sellerId": "550e8400-e29b-41d4-a716-446655440002",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 450,
  "page": 1,
  "limit": 20,
  "totalPages": 23
}
```

**Product Summary Schema:**

```typescript
interface ProductSummary {
  id: string;                    // UUID
  sku: string;
  slug: string;                  // kebab-case
  name: string;
  brand: string | null;
  topBrand: boolean | null;
  price: number;                 // INR integer
  mrp: number;                   // INR integer
  rating: number;                // 1–5 float
  overallRating: number | null;  // average of review stars
  soldCount: number;
  images: string[];              // primary image URLs
  selectedColor: string | null;
  colorOptions: string[];
  categoryId: string;            // UUID
  sellerId: string;              // UUID
}
```

**Used by:** `HomePage` → `getHomeCategoryRows()` (client-side grouping), `CategoryPage` → `getAllProducts()` fallback

---

### 4. `GET /products/search`

Searches products by name (full-text LIKE match). Not currently called by any page — included for completeness.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | yes | Search query |
| `page` | integer | no | Page number (default 1) |
| `limit` | integer | no | Products per page (default 20) |

**Response (200):** Same shape as `GET /products` (see endpoint 3).

---

### 5. `GET /products/category/:categorySlug` ⚠️ NEW ENDPOINT NEEDED

Returns paginated products filtered by **category slug** (not UUID). Replaces the current mock's category-name-based filtering on `CategoryPage`.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `categorySlug` | string | Category slug (e.g. `mobiles`, `electronics`) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 12 | Products per page |

**Response (200):**

```json
{
  "success": true,
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "sku": "SKU-IPH-17P-256-SLV",
      "slug": "apple-iphone-17-pro-silver-256-gb",
      "name": "Apple iPhone 17 Pro (Silver, 256 GB)",
      "brand": "Apple",
      "topBrand": true,
      "price": 134900,
      "mrp": 149900,
      "rating": 4.2,
      "overallRating": 4.17,
      "soldCount": 70,
      "images": ["https://placehold.co/400x400/f5f5f5/333?text=Front"],
      "selectedColor": "Silver",
      "colorOptions": ["Silver", "Cosmic Orange", "Deep Blue"],
      "categoryId": "550e8400-e29b-41d4-a716-446655440000",
      "sellerId": "550e8400-e29b-41d4-a716-446655440002"
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 12,
  "totalPages": 10
}
```

**Error (404):**

```json
{ "success": false, "error": { "code": "CATEGORY_NOT_FOUND", "message": "Category not found" } }
```

**Used by:** `CategoryPage` → `getCategoryProducts(categoryName, page)` — **currently the store resolves category name→slug client-side; the API must accept slug directly.**

---

### 6. `GET /products/slug/:slug/relations` ⚠️ NEW ENDPOINT NEEDED

Returns the full product detail including **all relations**: variants, specs, trust badges, breadcrumbs, EMI tenure options, and reviews with attachments. Replaces the current mock's `getProductBySlug` which returns a full `Product` object.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Product slug (kebab-case, e.g. `apple-iphone-17-pro-silver-256-gb`) |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "sku": "SKU-IPH-17P-256-SLV",
    "slug": "apple-iphone-17-pro-silver-256-gb",
    "name": "Apple iPhone 17 Pro (Silver, 256 GB)",
    "brand": "Apple",
    "topBrand": true,
    "price": 134900,
    "mrp": 149900,
    "rating": 4.2,
    "overallRating": 4.17,
    "soldCount": 70,
    "images": [
      "https://placehold.co/400x400/f5f5f5/333?text=Image+1",
      "https://placehold.co/400x400/f5f5f5/333?text=Image+2",
      "https://placehold.co/400x400/f5f5f5/333?text=Image+3"
    ],
    "selectedColor": "Silver",
    "colorOptions": ["Silver", "Cosmic Orange", "Deep Blue"],
    "appStoreLink": "https://apps.apple.com/app/example",
    "playStoreLink": "https://play.google.com/store/apps/details?id=com.example",
    "defaultTenureIndex": 0,
    "downPayment": 13490,
    "emiStartLabel": "3rd Oct",
    "returnable": true,
    "shippingText": "Dispatch in less than 48 hours and delivery in 3-7 working days.",
    "reviewMedia": [
      { "type": "video", "thumbnail": "https://placehold.co/80x80" },
      { "type": "image", "thumbnail": "https://placehold.co/80x80" }
    ],
    "categoryId": "550e8400-e29b-41d4-a716-446655440000",
    "sellerId": "550e8400-e29b-41d4-a716-446655440002",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Mobiles",
      "slug": "mobiles"
    },
    "seller": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Balaji Infocom",
      "slug": "balaji-infocom",
      "url": "/seller/balaji-infocom"
    },
    "variants": [
      { "id": "uuid-v1", "productId": "...", "variantLabel": "Storage", "variantValue": "256 GB" },
      { "id": "uuid-v2", "productId": "...", "variantLabel": "Storage", "variantValue": "512 GB" },
      { "id": "uuid-v3", "productId": "...", "variantLabel": "Storage", "variantValue": "1 TB" }
    ],
    "specs": [
      { "id": "uuid-s1", "productId": "...", "label": "Storage", "value": "256 GB", "sortOrder": 0 },
      { "id": "uuid-s2", "productId": "...", "label": "Processor", "value": "A19 Pro chip", "sortOrder": 1 },
      { "id": "uuid-s3", "productId": "...", "label": "Color", "value": "Silver", "sortOrder": 2 }
    ],
    "trustBadges": [
      { "id": "uuid-t1", "productId": "...", "icon": "replacement", "label": "7 Days Easy Returns" },
      { "id": "uuid-t2", "productId": "...", "icon": "delivery", "label": "Free Delivery" },
      { "id": "uuid-t3", "productId": "...", "icon": "lock", "label": "Secure Transaction" },
      { "id": "uuid-t4", "productId": "...", "icon": "crown", "label": "Top Brand" }
    ],
    "breadcrumbs": [
      { "id": "uuid-b1", "productId": "...", "label": "Shop on EMI", "href": "/", "sortOrder": 0 },
      { "id": "uuid-b2", "productId": "...", "label": "Mobiles", "href": "/c/mobiles", "sortOrder": 1 },
      { "id": "uuid-b3", "productId": "...", "label": "Apple iPhone 17 Pro", "href": null, "sortOrder": 2 }
    ],
    "emiTenureOptions": [
      {
        "id": "uuid-e1",
        "productId": "...",
        "months": 6,
        "monthlyAmount": 22480,
        "badge": "0% EMI",
        "interestRate": "0% Interest",
        "cashbackAmount": 4047
      },
      {
        "id": "uuid-e2",
        "productId": "...",
        "months": 9,
        "monthlyAmount": 14990,
        "badge": "0% EMI",
        "interestRate": "0% Interest",
        "cashbackAmount": 4047
      },
      {
        "id": "uuid-e3",
        "productId": "...",
        "months": 12,
        "monthlyAmount": 11240,
        "badge": "0% EMI",
        "interestRate": "0% Interest",
        "cashbackAmount": 2698
      },
      {
        "id": "uuid-e4",
        "productId": "...",
        "months": 18,
        "monthlyAmount": 7490,
        "badge": "Low EMI",
        "interestRate": "Starting 12% Interest",
        "cashbackAmount": 4047
      }
    ],
    "reviews": [
      {
        "id": "uuid-r1",
        "productId": "...",
        "stars": 5,
        "variantDescription": "Storage: 256 GB, Color: Silver",
        "text": "Great phone, excellent camera quality.",
        "reviewerName": "Rahul Sharma",
        "city": "Mumbai",
        "verified": true,
        "timeAgo": "2 days ago",
        "attachments": [
          { "id": "uuid-a1", "reviewId": "uuid-r1", "type": "image", "thumbnail": "https://placehold.co/80x80" }
        ]
      }
    ]
  }
}
```

**Full Product Detail Schema:**

```typescript
interface ProductDetail {
  // Base product fields
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string | null;
  topBrand: boolean | null;
  price: number;           // INR integer
  mrp: number;             // INR integer
  rating: number;          // 1–5 float
  overallRating: number | null;
  soldCount: number;
  images: string[];
  selectedColor: string | null;
  colorOptions: string[];
  appStoreLink: string | null;
  playStoreLink: string | null;
  defaultTenureIndex: number;
  downPayment: number | null;
  emiStartLabel: string | null;
  returnable: boolean;
  shippingText: string | null;
  reviewMedia: Array<{ type: "image" | "video"; thumbnail: string }>;
  categoryId: string;
  sellerId: string;

  // Relations
  category: { id: string; name: string; slug: string };
  seller: { id: string; name: string; slug: string; url: string | null };
  variants: Array<{ id: string; productId: string; variantLabel: string; variantValue: string }>;
  specs: Array<{ id: string; productId: string; label: string; value: string; sortOrder: number }>;
  trustBadges: Array<{ id: string; productId: string; icon: string; label: string }>;
  breadcrumbs: Array<{ id: string; productId: string; label: string; href: string | null; sortOrder: number }>;
  emiTenureOptions: Array<{
    id: string; productId: string; months: number; monthlyAmount: number;
    badge: string; interestRate: string; cashbackAmount: number;
  }>;
  reviews: Array<{
    id: string; productId: string; stars: number;
    variantDescription: string | null; text: string;
    reviewerName: string; city: string; verified: boolean; timeAgo: string | null;
    attachments: Array<{ id: string; reviewId: string; type: "image" | "video"; thumbnail: string }>;
  }>;
}
```

**Error (404):**

```json
{ "success": false, "error": { "code": "PRODUCT_NOT_FOUND", "message": "Product not found" } }
```

**Used by:** `ProductDetailPage` → `getProductBySlug(slug)`, `ReviewList` → reads `product.reviews` (first 6 preview)

---

### 7. `GET /products/slug/:slug` *(existing basic endpoint — kept for reference)*

Returns only the base product fields (no relations). Use **endpoint 6** instead for full detail.

---

### 8. `GET /reviews/product/:productSlug` ⚠️ NEW ENDPOINT NEEDED

Returns **all** reviews for a product by slug (no pagination). Used by `ReviewsPage`.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `productSlug` | string | Product slug |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-r1",
      "productId": "uuid-p1",
      "stars": 5,
      "variantDescription": "Storage: 256 GB, Color: Silver",
      "text": "Excellent product, very happy with this purchase.",
      "reviewerName": "Rahul Sharma",
      "city": "Mumbai",
      "verified": true,
      "timeAgo": "2 days ago",
      "attachments": [
        { "id": "uuid-a1", "reviewId": "uuid-r1", "type": "image", "thumbnail": "https://placehold.co/80x80" },
        { "id": "uuid-a2", "reviewId": "uuid-r1", "type": "video", "thumbnail": "https://placehold.co/80x80" }
      ]
    }
  ],
  "total": 45
}
```

**Error (404):**

```json
{ "success": false, "error": { "code": "PRODUCT_NOT_FOUND", "message": "No reviews found for this product" } }
```

**Used by:** `ReviewsPage` → `getAllProductReviews(productSlug)`

---

### 9. `GET /reviews/product/:productSlug?limit=N&offset=M` *(optional paginated variant)*

If the reviews page ever needs pagination, use this. Same response shape as endpoint 8 with added pagination wrapper:

```json
{
  "success": true,
  "items": [...],
  "total": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

---

### 10. `GET /reviews/product/:productId` *(existing UUID-based endpoint — kept for reference)*

The current implementation uses UUID. The new slug-based endpoint (8) replaces this for frontend use.

---

### 11. `GET /emi-tenure-options/product/:productSlug` ⚠️ NEW ENDPOINT NEEDED

Returns EMI tenure options for a product by slug. Currently bundled inside the product relations endpoint (6), but exposed separately here for potential standalone use.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `productSlug` | string | Product slug |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-e1",
      "productId": "uuid-p1",
      "months": 6,
      "monthlyAmount": 22480,
      "badge": "0% EMI",
      "interestRate": "0% Interest",
      "cashbackAmount": 4047
    }
  ]
}
```

**Error (404):**

```json
{ "success": false, "error": { "code": "PRODUCT_NOT_FOUND", "message": "Product not found" } }
```

**Used by:** `EmiCalculatorCard` — currently reads from product.relations; this endpoint provides it standalone.

---

### 12. `GET /sellers/slug/:slug` *(existing — confirmed)*

Returns a seller by slug. Used if seller links are made clickable in the future.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-seller-1",
    "name": "Balaji Infocom",
    "slug": "balaji-infocom",
    "url": "/seller/balaji-infocom",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Used by:** Currently not called directly by any page. Bundled inside product detail (endpoint 6).

---

## Endpoint Coverage Matrix

| Store Method | Existing Endpoint | Status | Needs Slug-Based Version? |
|---|---|---|---|
| `getHomeCategoryRows()` | `GET /products` + `GET /categories` | ✅ Both exist | No — client-side grouping |
| `getCategoryProducts(cat, page)` | `GET /products/category/:categoryId` (UUID only) | ⚠️ Needs slug variant | Yes → **endpoint 5** |
| `getAllProducts(page)` | `GET /products` | ✅ Exists | No |
| `getProductBySlug(slug)` | `GET /products/slug/:slug` (base only) + `GET /products/:id/relations` (UUID only) | ⚠️ Needs slug+relations | Yes → **endpoint 6** |
| `getAllProductReviews(slug)` | `GET /reviews/product/:productId` (UUID only) | ⚠️ Needs slug variant | Yes → **endpoint 8** |
| `getProductReviews(slug, page)` | `GET /reviews/product/:productId` (UUID only, paginated) | ⚠️ Needs slug variant | Yes → **endpoint 9** |
| `getHomeCategoryRows()` | N/A (computed client-side) | ✅ No API needed | No |

---

## Request Headers

```http
Content-Type: application/json
Accept: application/json
```

---

## Response Headers

```
X-Total-Count: <total items>
X-Page: <current page>
X-Per-Page: <page size>
X-Total-Pages: <total pages>
```

---

## Notes

1. All prices are in **INR (Indian Rupees)** as integers (no decimals).
2. Slugs are kebab-case lowercase strings: `"Mobiles"` → `"mobiles"`, `"Apple iPhone 17 Pro (Silver, 256 GB)"` → `"apple-iphone-17-pro-silver-256-gb"`.
3. The `reviews` array inside endpoint 6 contains **all reviews** (no preview limit); the UI slices the first 6 for display.
4. `variants` is an array of `{ variantLabel, variantValue }` pairs — each object represents one dimension-value pair (e.g. `{ Storage: "256 GB" }`).
5. `tenureOptions` provides 4–6 EMI plans sorted by months ascending `[6, 9, 12, 18]`.
6. `defaultTenureIndex` is the index into `emiTenureOptions` array (0-based).
7. New endpoints marked ⚠️ must be implemented to fully replace the mock.
