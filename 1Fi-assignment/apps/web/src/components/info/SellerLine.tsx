import { ChevronRight } from "lucide-react"
import { product } from "@/data/mock"

export function SellerLine() {
  return (
    <div className="mt-2 flex items-center gap-1 text-xs">
      <span className="text-gray-400">Sold By:</span>
      <a href={product.seller.url} className="text-orange-500 font-semibold hover:underline">{product.seller.name}</a>
      <ChevronRight className="size-3 text-gray-300" />
    </div>
  )
}
