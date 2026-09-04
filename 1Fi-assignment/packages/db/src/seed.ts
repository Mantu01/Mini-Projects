import "dotenv/config"
import { eq } from "drizzle-orm"
import { db, categories, sellers, products, productVariants, productSpecs, productTrustBadges, productBreadcrumbs, reviews, reviewAttachments, emiTenureOptions, footerCategoryGroups, companyInfo, quickLinks, supportLinks, socialLinks } from "./index.js"
import { products as catalogProducts } from "../../../apps/web/src/data/catalog"
import { categories as siteCategories, footerCategoryGroups as siteFooterGroups, companyInfo as siteCompanyInfo, quickLinks as siteQuickLinks, supportLinks as siteSupportLinks, socialLinks as siteSocialLinks } from "../../../apps/web/src/data/site"

const slugForCategory = (category: string) =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

async function seed() {
  console.log("Seeding categories...")
  const categoryRows = await Promise.all(
    siteCategories.map(async (name) => {
      const [row] = await db.insert(categories).values({ name, slug: slugForCategory(name) }).onConflictDoNothing().returning()
      if (row) return { name, id: row.id }
      const existing = await db.select().from(categories).where(eq(categories.name, name)).limit(1)
      return { name, id: existing[0]!.id }
    }),
  )
  const categoryMap = new Map(categoryRows.map((c) => [c.name, c.id]))

  console.log("Seeding site config...")
  await db.insert(footerCategoryGroups).values(
    siteFooterGroups.map((g, i) => ({ heading: g.heading, links: g.links, sortOrder: i })),
  ).onConflictDoNothing()
  await db.insert(companyInfo).values(siteCompanyInfo).onConflictDoNothing()
  await db.insert(quickLinks).values(
    siteQuickLinks.map((l, i) => ({ label: l, sortOrder: i })),
  ).onConflictDoNothing()
  await db.insert(supportLinks).values(
    siteSupportLinks.map((l, i) => ({ label: l, sortOrder: i })),
  ).onConflictDoNothing()
  await db.insert(socialLinks).values(
    Object.entries(siteSocialLinks).map(([platform, url]) => ({ platform, url })),
  ).onConflictDoNothing()

  const sellerMap = new Map<string, string>()

  async function getOrCreateSeller(name: string, slug: string, url: string): Promise<string> {
    const existing = sellerMap.get(name)
    if (existing) return existing

    const [row] = await db.insert(sellers).values({ name, slug, url }).onConflictDoNothing().returning()
    if (row) {
      sellerMap.set(name, row.id)
      return row.id
    }

    const found = await db.select().from(sellers).where(eq(sellers.slug, slug)).limit(1)
    if (found[0]) {
      sellerMap.set(name, found[0].id)
      return found[0].id
    }

    const uniqueSlug = `${slug}-${Date.now()}`
    const [inserted] = await db.insert(sellers).values({ name, slug: uniqueSlug, url }).returning()
    sellerMap.set(name, inserted!.id)
    return inserted!.id
  }

  console.log(`Seeding ${catalogProducts.length} products...`)
  let count = 0
  for (const p of catalogProducts) {
    const categoryId = categoryMap.get(p.category)
    if (!categoryId) {
      console.warn(`Category "${p.category}" not found, skipping product "${p.name}"`)
      continue
    }

    const slugifiedSeller = p.seller.url.replace("/seller/", "")
    const sellerId = await getOrCreateSeller(p.seller.name, slugifiedSeller, p.seller.url)

    const brand = p.breadcrumb.find((b) => b.label !== "Shop on EMI" && b.label !== p.category && b.label !== p.name)?.label

    const [productRow] = await db.insert(products).values({
      sku: p.id,
      slug: p.slug,
      name: p.name,
      categoryId,
      brand: brand ?? null,
      topBrand: p.soldCount > 100,
      price: p.price,
      mrp: p.mrp,
      rating: p.rating,
      overallRating: p.overallRating,
      soldCount: p.soldCount,
      images: p.images,
      colorOptions: p.colorOptions,
      selectedColor: p.selectedColor,
      appStoreLink: p.appLinks.appStore,
      playStoreLink: p.appLinks.playStore,
      defaultTenureIndex: p.defaultTenureIndex,
      downPayment: p.downPayment,
      emiStartLabel: p.emiStartLabel,
      shippingText: p.shipping.text,
      reviewMedia: p.reviewMedia,
    }).onConflictDoNothing().returning()

    if (!productRow) {
      count++
      continue
    }

    const productId = productRow.id

    if (Object.keys(p.selectedVariant).length > 0) {
      for (const variant of p.variantOptions) {
        for (const [label, value] of Object.entries(variant)) {
          if (value) {
            await db.insert(productVariants).values({ productId, variantLabel: label, variantValue: value })
          }
        }
      }
    }

    for (const spec of p.specs) {
      await db.insert(productSpecs).values({ productId, label: spec.label, value: spec.value })
    }

    for (const badge of p.trustBadges) {
      await db.insert(productTrustBadges).values({ productId, icon: badge.icon, label: badge.label })
    }

    for (let i = 0; i < p.breadcrumb.length; i++) {
      const bc = p.breadcrumb[i]
      await db.insert(productBreadcrumbs).values({ productId, label: bc.label, href: bc.href, sortOrder: i })
    }

    for (const tenure of p.tenureOptions) {
      await db.insert(emiTenureOptions).values({
        productId,
        months: tenure.months,
        monthlyAmount: tenure.monthlyAmount,
        badge: tenure.badge,
        interestRate: tenure.interestRate,
        cashbackAmount: tenure.cashbackAmount,
      })
    }

    for (const review of p.reviews) {
      const [reviewRow] = await db.insert(reviews).values({
        productId,
        stars: review.stars,
        variantDescription: review.variantDescription,
        text: review.text,
        reviewerName: review.reviewerName,
        city: review.city,
        verified: review.verified,
        timeAgo: review.timeAgo,
      }).returning()

      for (const attachment of review.attachments) {
        await db.insert(reviewAttachments).values({
          reviewId: reviewRow!.id,
          type: attachment.type,
          thumbnail: attachment.thumbnail,
        })
      }
    }

    count++
    if (count % 50 === 0) console.log(`  Progress: ${count}/${catalogProducts.length}`)
  }

  console.log(`Seed complete! Seeded ${count} products.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
