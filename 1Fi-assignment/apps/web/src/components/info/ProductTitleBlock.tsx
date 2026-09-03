import { Flame } from "lucide-react"
import type { Product } from "@/data/types"

export function ProductTitleBlock({ product }: { product: Product }) {
  const variantSegments = Object.entries(product.selectedVariant)
    .filter(([, val]) => val !== null)
    .map(([key, val]) => `${key}: ${val}`)

  // Avoid echoing the colour back when the product title already names it
  const colorSegments = product.name.includes(product.selectedColor)
    ? []
    : [product.selectedColor]

  const subtitle = [...colorSegments, ...variantSegments].join(", ")

  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-lg font-bold text-foreground leading-tight">{product.name}</h1>
      {subtitle.length > 0 && <p className="text-xs text-muted-foreground">({subtitle})</p>}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Flame className="size-3 text-accent-purple shrink-0" />
        <span>{product.soldCount}+ sold</span>
      </div>
    </div>
  )
}
