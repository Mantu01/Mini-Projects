export type Review = {
  stars: number
  variantDescription: string
  text: string
  attachments: Array<{ type: "image" | "video"; thumbnail: string }>
  reviewerName: string
  city: string
  verified: boolean
  timeAgo: string
}

export type Product = {
  id: string
  slug: string
  name: string
  category: string
  breadcrumb: Array<{ label: string; href: string | null }>
  images: string[]
  selectedColor: string
  colorOptions: string[]
  selectedVariant: Record<string, string | null>
  variantOptions: Array<Record<string, string | null>>
  price: number
  mrp: number
  rating: number
  soldCount: number
  appLinks: { appStore: string; playStore: string }
  tenureOptions: Array<{
    months: number
    monthlyAmount: number
    badge: string
    interestRate: string
    cashbackAmount: number
  }>
  defaultTenureIndex: number
  downPayment: number
  emiStartLabel: string
  seller: { name: string; url: string }
  shipping: { text: string }
  trustBadges: Array<{ icon: string; label: string }>
  specs: Array<{ label: string; value: string }>
  overallRating: number
  reviewMedia: Array<{ type: "image" | "video"; thumbnail: string }>
  reviews: Review[]
}

export type BreadcrumbItem = { label: string; href: string | null }
