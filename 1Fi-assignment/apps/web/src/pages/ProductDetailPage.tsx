import { useState, useEffect } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { useStore } from "@/context/store"
import type { Product } from "@/data/types"
import { MainImageStage } from "@/components/media/MainImageStage"
import { ThumbnailRail } from "@/components/media/ThumbnailRail"
import { VariantSelectors } from "@/components/media/VariantSelectors"
import { EmiCalculatorCard } from "@/components/info/EmiCalculatorCard"
import { SellerLine } from "@/components/info/SellerLine"
import { ShippingDetails } from "@/components/info/ShippingDetails"
import { TrustBadgeGrid } from "@/components/info/TrustBadgeGrid"
import { SpecList } from "@/components/info/SpecList"
import { ReviewSummary } from "@/components/info/ReviewSummary"
import { ReviewList } from "@/components/info/ReviewList"
import { Check } from "lucide-react"

export function ProductDetailPage() {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>() ?? {}
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getProductBySlug } = useStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const initialColor = searchParams.get("color") ?? ""
  const initialVariant = Object.fromEntries(
    Array.from(searchParams.entries())
      .filter(([k]) => k.startsWith("variant_"))
      .map(([k, v]) => [k.replace("variant_", ""), v])
  ) as Record<string, string>

  const [selectedColor, setSelectedColor] = useState(initialColor)
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>(initialVariant)

  const updateUrl = (color: string, variant: Record<string, string>) => {
    const params = new URLSearchParams()
    if (color) params.set("color", color)
    Object.entries(variant).forEach(([k, v]) => {
      if (v) params.set(`variant_${k}`, v)
    })
    const qs = params.toString()
    navigate(`/p/${categorySlug}/${productSlug}${qs ? "?" + qs : ""}`, { replace: true })
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getProductBySlug(productSlug!).then((result) => {
      if (!cancelled) {
        setProduct(result ?? null)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [productSlug, getProductBySlug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse text-muted-foreground">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Product not found</h1>
        <p className="text-sm text-muted-foreground mb-6">The product may have sold out or the link is incorrect.</p>
        <a href="/c/mobiles" className="inline-flex items-center gap-2 rounded-full bg-[#6C28D9] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6C28D9]/90 transition-colors">
          Browse all →
        </a>
      </div>
    )
  }

  const variantLabel = Object.entries(product.selectedVariant)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ")
  const colorDisplay = selectedColor || product.colorOptions[0]
  const subtitle = [variantLabel, colorDisplay].filter(Boolean).join(" · ")

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
        <a href="/" className="hover:text-[#6C28D9]">Home</a>
        <span>/</span>
        <a href={`/c/${categorySlug}`} className="hover:text-[#6C28D9]">{product.category}</a>
        <span>/</span>
        <span className="font-medium text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
        <div className="flex flex-col lg:sticky lg:top-4 self-start">
          <div className="flex gap-4">
            <ThumbnailRail images={product.images} activeIndex={0} onSelect={() => {}} />
            <MainImageStage image={product.images[0]} rating={product.rating} />
          </div>
          <VariantSelectors
            product={product}
            selectedColor={colorDisplay}
            selectedVariant={selectedVariant}
            onColorChange={(color) => {
              setSelectedColor(color)
              updateUrl(color, selectedVariant)
            }}
            onVariantChange={(variant) => {
              setSelectedVariant(variant as Record<string, string>)
              updateUrl(selectedColor, variant as Record<string, string>)
            }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">{product.name}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>

          {product.variantOptions.length > 0 && (
            <div className="border border-border rounded-lg p-3 bg-muted/20">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Check className="size-3 text-green-500" />
                Selected: {variantLabel || product.selectedVariant && Object.values(product.selectedVariant)[0] || "Default"}
              </p>
            </div>
          )}

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
