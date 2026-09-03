import { Flame } from "lucide-react"
import { product } from "@/data/mock"

export function ProductTitleBlock() {
  const formatVariant = (v: Record<string, string | null>) =>
    Object.entries(v)
      .map(([k, val]) => `${k}: ${val ?? "null"}`)
      .join(", ")

  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h1>
      <p className="text-xs text-gray-500">({formatVariant(product.selectedVariant)})</p>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Flame className="size-3 text-orange-500 shrink-0" />
        <span>{product.soldCount}+ sold</span>
      </div>
    </div>
  )
}
