import { product } from "@/data/mock"
import { RatingPill } from "../shared/RatingPill"
import { formatPrice } from "@/lib/utils"

export function PriceRatingRow() {
  return (
    <div className="flex items-start justify-between pt-1">
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          {formatPrice(product.price)}
        </span>
        <span className="text-xs text-gray-400 line-through">
          {formatPrice(product.price + 15000)}
        </span>
        <span className="text-xs text-green-600 font-medium">
          You save {formatPrice(15000)}
        </span>
      </div>
      <RatingPill rating={product.rating} size="sm" />
    </div>
  )
}
