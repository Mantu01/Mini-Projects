import { useState } from "react"
import { useParams } from "react-router-dom"
import { Star, ShoppingBag } from "lucide-react"
import { getProductBySlug } from "@/data/catalog"
import { slugForCategory } from "@/data/site"
import { MainImageStage } from "@/components/media/MainImageStage"
import { ThumbnailRail } from "@/components/media/ThumbnailRail"
import { VariantSelectors } from "@/components/media/VariantSelectors"
import { ProductTitleBlock } from "@/components/info/ProductTitleBlock"
import { PriceRatingRow } from "@/components/info/PriceRatingRow"
import { EmiCalculatorCard } from "@/components/info/EmiCalculatorCard"
import { SellerLine } from "@/components/info/SellerLine"
import { ShippingDetails } from "@/components/info/ShippingDetails"
import { TrustBadgeGrid } from "@/components/info/TrustBadgeGrid"
import { SpecList } from "@/components/info/SpecList"
import { ReviewSummary } from "@/components/info/ReviewSummary"
import { ReviewList } from "@/components/info/ReviewList"
import { Badge } from "@/components/ui/badge"

export function ProductDetailPage() {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>()!
  const product = getProductBySlug(productSlug)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product?.selectedColor ?? "")
  const [selectedVariant, setSelectedVariant] = useState(product?.selectedVariant ?? {})

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Product not found</h1>
        <p className="text-sm text-muted-foreground mb-6">The product may have sold out or the link is incorrect.</p>
        <a href="/c/mobiles" className="inline-flex items-center gap-2 rounded-full bg-accent-purple px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-purple/90 transition-colors">
          Browse all →
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
        <a href="/" className="hover:text-accent-purple">Home</a>
        <span>/</span>
        <a href={`/c/${categorySlug}`} className="hover:text-accent-purple">{product.category}</a>
        <span>/</span>
        <span className="font-medium text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
        <div className="flex flex-col lg:sticky lg:top-4 self-start">
          <div className="flex gap-4">
            <ThumbnailRail images={product.images} activeIndex={activeImageIndex} onSelect={setActiveImageIndex} />
            <MainImageStage image={product.images[activeImageIndex]} rating={product.rating} />
          </div>
          <VariantSelectors
            product={product}
            selectedColor={selectedColor}
            selectedVariant={selectedVariant}
            onColorChange={setSelectedColor}
            onVariantChange={setSelectedVariant}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
          </div>

          <PriceRatingRow product={product} />
          <EmiCalculatorCard product={product} />
          <SellerLine product={product} />
          <ShippingDetails product={product} />
          <TrustBadgeGrid product={product} />
          <SpecList product={product} />
          <ReviewSummary rating={product.overallRating} media={product.reviewMedia} reviewCount={product.reviews.length} />
          <ReviewList product={product} />
        </div>
      </div>
    </div>
  )
}
