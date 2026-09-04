import { z } from "zod"

export const insertCategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
})

export const insertSellerSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  url: z.string().max(512).optional(),
})

export const insertProductSchema = z.object({
  sku: z.string().min(1).max(100),
  slug: z.string().min(1).max(512),
  name: z.string().min(1),
  categoryId: z.string().uuid(),
  brand: z.string().max(255).optional(),
  topBrand: z.boolean().optional(),
  price: z.number().int().positive(),
  mrp: z.number().int().positive(),
  markupPercent: z.number().int().optional(),
  rating: z.number().min(0).max(5),
  overallRating: z.number().min(0).max(5).optional(),
  soldCount: z.number().int().min(0),
  images: z.array(z.string().url()),
  colorOptions: z.array(z.string().min(1)),
  selectedColor: z.string().max(255).optional(),
  appStoreLink: z.string().max(512).optional(),
  playStoreLink: z.string().max(512).optional(),
  defaultTenureIndex: z.number().int().min(0).optional(),
  downPayment: z.number().int().min(0).optional(),
  emiStartLabel: z.string().max(100).optional(),
  returnable: z.boolean().optional(),
  shippingText: z.string().optional(),
  reviewMedia: z
    .array(
      z.object({
        type: z.enum(["image", "video"]),
        thumbnail: z.string(),
      }),
    )
    .optional(),
})

export const insertProductVariantSchema = z.object({
  productId: z.string().uuid(),
  variantLabel: z.string().min(1).max(255),
  variantValue: z.string().min(1).max(255),
})

export const insertProductSpecSchema = z.object({
  productId: z.string().uuid(),
  label: z.string().min(1).max(255),
  value: z.string().min(1),
  sortOrder: z.number().int().optional(),
})

export const insertProductTrustBadgeSchema = z.object({
  productId: z.string().uuid(),
  icon: z.string().min(1).max(100),
  label: z.string().min(1).max(255),
})

export const insertProductBreadcrumbSchema = z.object({
  productId: z.string().uuid(),
  label: z.string().min(1).max(255),
  href: z.string().max(512).optional(),
  sortOrder: z.number().int().optional(),
})

export const insertReviewSchema = z.object({
  productId: z.string().uuid(),
  stars: z.number().int().min(1).max(5),
  variantDescription: z.string().max(512).optional(),
  text: z.string().min(1),
  reviewerName: z.string().min(1).max(255),
  city: z.string().min(1).max(255),
  verified: z.boolean().optional(),
  timeAgo: z.string().max(100).optional(),
})

export const insertReviewAttachmentSchema = z.object({
  reviewId: z.string().uuid(),
  type: z.enum(["image", "video"]),
  thumbnail: z.string().min(1).max(512),
})

export const insertEmiTenureOptionSchema = z.object({
  productId: z.string().uuid(),
  months: z.number().int().positive(),
  monthlyAmount: z.number().int().positive(),
  badge: z.string().min(1).max(100),
  interestRate: z.string().min(1).max(100),
  cashbackAmount: z.number().int().min(0),
})

export const insertFooterCategoryGroupSchema = z.object({
  heading: z.string().min(1).max(255),
  links: z.array(z.string().min(1)),
  sortOrder: z.number().int().optional(),
})

export const insertCompanyInfoSchema = z.object({
  legalName: z.string().min(1).max(512),
  address: z.string().min(1),
  phone: z.string().min(1).max(50),
  hours: z.string().min(1).max(255),
})

export const insertQuickLinkSchema = z.object({
  label: z.string().min(1).max(255),
  href: z.string().max(512).optional(),
  sortOrder: z.number().int().optional(),
})

export const insertSupportLinkSchema = z.object({
  label: z.string().min(1).max(255),
  href: z.string().max(512).optional(),
  sortOrder: z.number().int().optional(),
})

export const insertSocialLinkSchema = z.object({
  platform: z.string().min(1).max(100),
  url: z.string().min(1).max(512),
})

export type InsertCategory = z.infer<typeof insertCategorySchema>
export type InsertSeller = z.infer<typeof insertSellerSchema>
export type InsertProduct = z.infer<typeof insertProductSchema>
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>
export type InsertProductSpec = z.infer<typeof insertProductSpecSchema>
export type InsertProductTrustBadge = z.infer<typeof insertProductTrustBadgeSchema>
export type InsertProductBreadcrumb = z.infer<typeof insertProductBreadcrumbSchema>
export type InsertReview = z.infer<typeof insertReviewSchema>
export type InsertReviewAttachment = z.infer<typeof insertReviewAttachmentSchema>
export type InsertEmiTenureOption = z.infer<typeof insertEmiTenureOptionSchema>
export type InsertFooterCategoryGroup = z.infer<typeof insertFooterCategoryGroupSchema>
export type InsertCompanyInfo = z.infer<typeof insertCompanyInfoSchema>
export type InsertQuickLink = z.infer<typeof insertQuickLinkSchema>
export type InsertSupportLink = z.infer<typeof insertSupportLinkSchema>
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>
