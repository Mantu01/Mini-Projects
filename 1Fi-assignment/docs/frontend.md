# Frontend — web app

A React 19 + Vite 8 single-page application styled with Tailwind CSS 4 and shadcn/ui components. The app is routed client-side via React Router 7 and talks to the API through a typed axios wrapper.

---

## Running individually

```bash
# From the repo root, install first:
pnpm install

# Then start only the frontend:
pnpm --filter web dev
```

The Vite dev server runs on **http://localhost:5173** with hot module replacement.  
To preview the production build locally:

```bash
pnpm --filter web build
pnpm --filter web preview   # serves on port 4173
```

Type-checking (no emit):

```bash
pnpm --filter web check-types
```

Lint:

```bash
pnpm --filter web lint
```

---

## Environment

A single env variable is read at compile time (Vite replaces `import.meta.env` in the bundle).

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` | Base URL for every API call |

Put it in `apps/web/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## Routing map

| Route | Page component | Data loaded |
|-------|----------------|-------------|
| `/` | `HomePage` | `GET /products/home` |
| `/c/:categorySlug` | `CategoryPage` | `GET /products/category/:slug?page=N` |
| `/p/:categorySlug/:productSlug` | `ProductDetailPage` | `GET /products/slug/:slug/relations` |
| `/p/:categorySlug/:productSlug/reviews` | `ReviewsPage` | `GET /reviews/product/:slug` |

URL state (selected colour, variants) is encoded as query params on the product detail page, e.g. `/p/mobiles/iphone-17-pro?color=Silver&variant_Storage=256GB`.

---

## App tree

```
src/
├── main.tsx                  # entry — renders <StoreProvider><App /></StoreProvider>
├── App.tsx                   # <BrowserRouter> wrapping <Layout> + <Routes>
├── config.ts                 # static footer category groups & company info
├── types.ts                  # shared Product, Review, ProductOptionEntry, BreadcrumbItem types
├── lib/
│   ├── utils.ts              # formatPrice(), resolveProductPrice(), slugForCategory()
│   └── links.ts              # productLink(), categoryLink() helpers
├── api/
│   ├── http.ts               # axios instance + request() helper + ApiClientError
│   ├── products.ts           # fetchProducts, fetchHomeProducts, fetchProductDetail …
│   ├── categories.ts         # fetchCategories, fetchCategoryBySlug
│   └── reviews.ts            # fetchProductReviews, fetchEmiTenureOptions, fetchSellerBySlug
├── context/
│   ├── store.tsx             # combined StoreProvider exposing useStore()
│   ├── ProductsContext.tsx   # product data fetching logic (getProductBySlug, getHomeCategoryRows …)
│   └── CategoriesContext.tsx # category list cache + getCategoryName helper
├── pages/
│   ├── HomePage.tsx          # hero banner + category row sections with ProductCard grids
│   ├── CategoryPage.tsx      # paginated product grid with URL-based pagination
│   ├── ProductDetailPage.tsx # image gallery + variant selectors + EmiCalculatorCard + reviews
│   └── ReviewsPage.tsx       # full review list per product
└── components/
    ├── Layout.tsx              # shell: header + main + MegaFooter
    ├── header/
    │   ├── TopUtilityBar.tsx   # thin top bar with app-store links & seller badge
    │   └── CategoryNavBar.tsx  # horizontal nav of category pills
    ├── footer/
    │   └── MegaFooter.tsx      # 4-column footer rendered from config.ts + site-config API
    ├── media/
    │   ├── MainImageStage.tsx  # large hero product image with rating badge
    │   ├── ThumbnailRail.tsx   # vertical thumbnail strip
    │   └── ImageGalleryDialog.tsx  # fullscreen image preview on click
    │   └── VariantSelectors.tsx   # colour swatches + variant dropdowns
    ├── info/
    │   ├── EmiCalculatorCard.tsx  # tenure radio-group with monthly amount / cashback / interest
    │   ├── SellerLine.tsx         # seller name + store link
    │   ├── ShippingDetails.tsx    # delivery text badge
    │   ├── TrustBadgeGrid.tsx     # grid of icon+label trust badges
    │   ├── SpecList.tsx           # collapsible spec table rows
    │   ├── ReviewSummary.tsx      # aggregate rating pill + "All Reviews" link
    │   └── ReviewList.tsx         # review cards inline on product page
    ├── shared/
    │   ├── StarRating.tsx        # filled star icons at xs/sm/lg
    │   ├── RatingPill.tsx        # compact rating badge used in headers/cards
    │   └── ReviewAttachments.tsx # image/video thumbnails inside a review card
    ├── ProductCard.tsx         # card used in home grid & category listing
    └── ui/                     # shadcn/ui primitives (button, badge, card, dialog, select …)
```

---

## State management

All product / category data lives in two React contexts layered together:

```
StoreProvider
 └── CategoriesProvider   → in-memory Map of slug→name, loaded once on mount
      └── ProductsProvider → all product queries cached per-slug, re-fetches on navigation
```

`useStore()` exposes a flat interface so any component can call `getProductBySlug()`, `getHomeCategoryRows()`, etc. without prop drilling.

---

## API client contract

Every call goes through `request<T>(method, url, params?)` in `api/http.ts`:

```ts
// Success shape
{ success: true, data: T }
{ success: true, items: T[], total: number, page: number, limit: number, totalPages: number }

// Error shape
{ success: false, error: { code: string, message: string } }
```

The client auto-throws `ApiClientError` with a machine-readable `code` so pages can handle `NOT_FOUND` vs `NETWORK_ERROR` distinctly.

---

## Styling conventions

- All custom classes are prefixed with the Tailwind v4 design token system (`bg-[#6C28D9]`, `text-muted-foreground`, etc.)
- The primary brand colour is `#6C28D9` (purple) used on buttons, active states, and accent lines
- Responsive breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- Card radius: `rounded-2xl`; button radius: `rounded-full`
- Ghost loading uses `animate-pulse` on placeholder divs until data resolves
