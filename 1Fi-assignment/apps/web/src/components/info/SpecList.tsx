import { useState } from "react"
import type { Product } from "@/types"

export function SpecList({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? product.specs : product.specs.slice(0, 4)

  return (
    <div className="mt-3">
      <h3 className="text-xs font-semibold text-foreground mb-2">Product Details</h3>
      <ul className="space-y-1 text-xs">
        {visible.map((spec) => (
          <li key={spec.label} className="flex gap-2">
            <span className="font-semibold text-foreground min-w-[110px]">{spec.label}:</span>
            <span className="text-muted-foreground">{spec.value}</span>
          </li>
        ))}
      </ul>
      {product.specs.length > 4 && (
        <button onClick={() => setExpanded(!expanded)} className="mt-2 text-[#6C28D9] font-semibold text-xs hover:underline">
          {expanded ? "View less" : "View all ↓"}
        </button>
      )}
    </div>
  )
}
