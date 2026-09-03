import { useState } from "react"
import { TopUtilityBar } from "@/components/header/TopUtilityBar"
import { CategoryNavBar } from "@/components/header/CategoryNavBar"
import { Breadcrumb } from "@/components/header/Breadcrumb"
import { ThumbnailRail } from "@/components/media/ThumbnailRail"
import { MainImageStage } from "@/components/media/MainImageStage"
import { VariantSelectors } from "@/components/media/VariantSelectors"
import { ProductTitleBlock } from "@/components/info/ProductTitleBlock"
import { PriceRatingRow } from "@/components/info/PriceRatingRow"
import { CreditPromoStrip } from "@/components/info/CreditPromoStrip"
import { EmiCalculatorCard } from "@/components/info/EmiCalculatorCard"
import { SellerLine } from "@/components/info/SellerLine"
import { ShippingDetails } from "@/components/info/ShippingDetails"
import { TrustBadgeGrid } from "@/components/info/TrustBadgeGrid"
import { SpecList } from "@/components/info/SpecList"
import { ReviewSummary } from "@/components/info/ReviewSummary"
import { ReviewList } from "@/components/info/ReviewList"
import { MegaFooter } from "@/components/footer/MegaFooter"
import { categories, product } from "@/data/mock"

export function ProductDetailPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.selectedColor)
  const [selectedVariant, setSelectedVariant] = useState(product.selectedVariant)

  const breadcrumb = [
    { label: "Shop on EMI", href: "/" },
    { label: "Products", href: "/products" },
    {
      label: product.name,
      href: null,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <TopUtilityBar />
      <CategoryNavBar categories={categories} />
      <Breadcrumb items={breadcrumb} />

      <div className="px-4 pb-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[11fr_9fr] gap-6">
          <div className="flex flex-col lg:sticky lg:top-4 lg:self-start">
            <div className="flex gap-4">
              <ThumbnailRail
                images={product.images}
                activeIndex={activeImageIndex}
                onSelect={setActiveImageIndex}
              />
              <MainImageStage
                image={product.images[activeImageIndex]}
                rating={product.rating}
              />
            </div>
            <VariantSelectors
              selectedColor={selectedColor}
              selectedVariant={selectedVariant}
              onColorChange={setSelectedColor}
              onVariantChange={setSelectedVariant}
            />
          </div>

          <div className="flex flex-col">
            <ProductTitleBlock />
            <PriceRatingRow />
            <CreditPromoStrip />
            <EmiCalculatorCard />
            <SellerLine />
            <ShippingDetails />
            <TrustBadgeGrid />
            <SpecList />
            <ReviewSummary rating={product.overallRating} media={product.reviewMedia} />
            <ReviewList />
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  )
}
