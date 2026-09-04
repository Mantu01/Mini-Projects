import { InferSelectModel } from "drizzle-orm"
import {
  categories,
  sellers,
  products,
  productVariants,
  productSpecs,
  productTrustBadges,
  productBreadcrumbs,
  productOptions,
  reviews,
  reviewAttachments,
  emiTenureOptions,
  footerCategoryGroups,
  companyInfo,
  quickLinks,
  supportLinks,
  socialLinks,
} from "./schema/index.js"

export type Category = InferSelectModel<typeof categories>
export type Seller = InferSelectModel<typeof sellers>
export type Product = InferSelectModel<typeof products>
export type ProductVariant = InferSelectModel<typeof productVariants>
export type ProductSpec = InferSelectModel<typeof productSpecs>
export type ProductTrustBadge = InferSelectModel<typeof productTrustBadges>
export type ProductBreadcrumb = InferSelectModel<typeof productBreadcrumbs>
export type ProductOption = InferSelectModel<typeof productOptions>
export type Review = InferSelectModel<typeof reviews>
export type ReviewAttachment = InferSelectModel<typeof reviewAttachments>
export type EmiTenureOption = InferSelectModel<typeof emiTenureOptions>
export type FooterCategoryGroup = InferSelectModel<typeof footerCategoryGroups>
export type CompanyInfo = InferSelectModel<typeof companyInfo>
export type QuickLink = InferSelectModel<typeof quickLinks>
export type SupportLink = InferSelectModel<typeof supportLinks>
export type SocialLink = InferSelectModel<typeof socialLinks>

export type ProductWithRelations = Product & {
  category: Category
  seller: Seller
  variants: ProductVariant[]
  options: ProductOption[]
  specs: ProductSpec[]
  trustBadges: ProductTrustBadge[]
  breadcrumbs: ProductBreadcrumb[]
  emiTenureOptions: EmiTenureOption[]
  reviews: (Review & { attachments: ReviewAttachment[] })[]
}

export type ProductSummary = Pick<
  Product,
  | "id"
  | "sku"
  | "slug"
  | "name"
  | "brand"
  | "topBrand"
  | "price"
  | "mrp"
  | "rating"
  | "overallRating"
  | "soldCount"
  | "images"
  | "selectedColor"
  | "colorOptions"
  | "categoryId"
  | "sellerId"
>
