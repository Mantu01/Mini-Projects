import { eq, and, desc, asc, ilike } from "drizzle-orm"
import { db } from "../index.js"
import {
  products,
  productVariants,
  productSpecs,
  productTrustBadges,
  productBreadcrumbs,
  emiTenureOptions,
  reviews,
  reviewAttachments,
  categories,
  sellers,
} from "../schema/index.js"
import { InsertProduct } from "../zod/index.js"
import { Product, ProductWithRelations, ProductSummary } from "../types.js"

export async function createProduct(data: InsertProduct): Promise<Product> {
  const result = await db.insert(products).values(data).returning()
  if (!result[0]) throw new Error("Failed to create product")
  return result[0]
}

export async function getProductById(
  id: string,
): Promise<Product | undefined> {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)
  return result[0]
}

export async function getProductBySku(
  sku: string,
): Promise<Product | undefined> {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.sku, sku))
    .limit(1)
  return result[0]
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)
  return result[0]
}

export async function getProductWithRelations(
  id: string,
): Promise<ProductWithRelations | undefined> {
  const product = await getProductById(id)
  if (!product) return undefined

  const [
    categoryResult,
    sellerResult,
    variants,
    specs,
    badges,
    breadcrumbs,
    tenures,
    productReviews,
  ] = await Promise.all([
    db
      .select()
      .from(categories)
      .where(eq(categories.id, product.categoryId))
      .limit(1),
    db
      .select()
      .from(sellers)
      .where(eq(sellers.id, product.sellerId))
      .limit(1),
    db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id)),
    db
      .select()
      .from(productSpecs)
      .where(eq(productSpecs.productId, product.id))
      .orderBy(asc(productSpecs.sortOrder)),
    db
      .select()
      .from(productTrustBadges)
      .where(eq(productTrustBadges.productId, product.id)),
    db
      .select()
      .from(productBreadcrumbs)
      .where(eq(productBreadcrumbs.productId, product.id))
      .orderBy(asc(productBreadcrumbs.sortOrder)),
    db
      .select()
      .from(emiTenureOptions)
      .where(eq(emiTenureOptions.productId, product.id))
      .orderBy(asc(emiTenureOptions.months)),
    db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, product.id))
      .orderBy(desc(reviews.createdAt)),
  ])

  const reviewsWithAttachments = await Promise.all(
    productReviews.map(
      async (review: (typeof productReviews)[number]) => {
        const attachments = await db
          .select()
          .from(reviewAttachments)
          .where(eq(reviewAttachments.reviewId, review.id))
        return { ...review, attachments }
      },
    ),
  )

  const seller = sellerResult[0]
  if (!seller) return undefined

  return {
    ...product,
    category: categoryResult[0]!,
    seller,
    variants,
    specs,
    trustBadges: badges,
    breadcrumbs,
    emiTenureOptions: tenures,
    reviews: reviewsWithAttachments,
  }
}

export async function getProductSummaries(): Promise<ProductSummary[]> {
  return db
    .select({
      id: products.id,
      sku: products.sku,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      topBrand: products.topBrand,
      price: products.price,
      mrp: products.mrp,
      rating: products.rating,
      overallRating: products.overallRating,
      soldCount: products.soldCount,
      images: products.images,
      selectedColor: products.selectedColor,
      colorOptions: products.colorOptions,
      categoryId: products.categoryId,
      sellerId: products.sellerId,
    })
    .from(products)
    .orderBy(desc(products.soldCount))
}

export async function getProductsByCategory(
  categoryId: string,
): Promise<ProductSummary[]> {
  return db
    .select({
      id: products.id,
      sku: products.sku,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      topBrand: products.topBrand,
      price: products.price,
      mrp: products.mrp,
      rating: products.rating,
      overallRating: products.overallRating,
      soldCount: products.soldCount,
      images: products.images,
      selectedColor: products.selectedColor,
      colorOptions: products.colorOptions,
      categoryId: products.categoryId,
      sellerId: products.sellerId,
    })
    .from(products)
    .where(eq(products.categoryId, categoryId))
    .orderBy(desc(products.soldCount))
}

export async function searchProducts(
  query: string,
): Promise<ProductSummary[]> {
  return db
    .select({
      id: products.id,
      sku: products.sku,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      topBrand: products.topBrand,
      price: products.price,
      mrp: products.mrp,
      rating: products.rating,
      overallRating: products.overallRating,
      soldCount: products.soldCount,
      images: products.images,
      selectedColor: products.selectedColor,
      colorOptions: products.colorOptions,
      categoryId: products.categoryId,
      sellerId: products.sellerId,
    })
    .from(products)
    .where(and(ilike(products.name, `%${query}%`)))
    .orderBy(desc(products.soldCount))
}

export async function updateProduct(
  id: string,
  data: Partial<InsertProduct>,
): Promise<Product | undefined> {
  const result = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning()
  return result[0]
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning()
  return result.length > 0
}
