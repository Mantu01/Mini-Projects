import type { Product } from "@/data/types"
import { RatingPill } from "../shared/RatingPill"
import { formatPrice } from "@/lib/utils"

export function PriceRatingRow({ product }: { product: Product }) {
  const savings = product.mrp - product.price
  const percentOff = Math.round((savings / product.mrp) * 100)

  return (
    <div className="flex items-start justify-between pt-1">
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold text-foreground tracking-tight">
          {formatPrice(product.price)}
        </span>
        <span className="text-xs text-muted-foreground line-through">
          {formatPrice(product.mrp)}
        </span>
        <span className="text-xs text-green-600 font-medium">
          You save {formatPrice(savings)} ({percentOff}% off)
        </span>
      </div>
      <RatingPill rating={product.rating} size="sm" />
    </div>
  )
}
