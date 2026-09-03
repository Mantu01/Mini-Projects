import { ChevronRight } from "lucide-react"
import type { Product } from "@/data/types"

export function SellerLine({ product }: { product: Product }) {
  return (
    <div className="mt-2 flex items-center gap-1 text-xs">
      <span className="text-muted-foreground">Sold By:</span>
      <a href={product.seller.url} className="text-accent-purple font-semibold hover:underline">{product.seller.name}</a>
      <ChevronRight className="size-3 text-muted-foreground/50" />
    </div>
  )
}
