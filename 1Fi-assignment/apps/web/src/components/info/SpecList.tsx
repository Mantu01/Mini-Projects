import { useState } from "react"
import { product } from "@/data/mock"

export function SpecList() {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? product.specs : product.specs.slice(0, 4)

  return (
    <div className="mt-3">
      <h3 className="text-xs font-semibold text-gray-700 mb-2">Product Details</h3>
      <ul className="space-y-1 text-xs">
        {visible.map((spec) => (
          <li key={spec.label} className="flex gap-2">
            <span className="font-semibold text-gray-700 min-w-[110px]">{spec.label}:</span>
            <span className="text-gray-500">{spec.value}</span>
          </li>
        ))}
      </ul>
      {product.specs.length > 4 && (
        <button onClick={() => setExpanded(!expanded)} className="mt-2 text-orange-500 font-semibold text-xs hover:underline">
          {expanded ? "View less" : "View all ↓"}
        </button>
      )}
    </div>
  )
}
