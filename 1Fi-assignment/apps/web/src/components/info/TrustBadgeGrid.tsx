import { ShieldCheck, Crown, Truck, RefreshCw } from "lucide-react"
import type { Product } from "@/data/types"

const iconMap: Record<string, typeof ShieldCheck> = {
  replacement: RefreshCw,
  crown: Crown,
  delivery: Truck,
  lock: ShieldCheck,
}

export function TrustBadgeGrid({ product }: { product: Product }) {
  return (
    <div className="mt-3">
      <h3 className="text-xs font-semibold text-foreground mb-2">Shop with Confidence</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {product.trustBadges.map((badge) => {
          const Icon = iconMap[badge.icon] ?? ShieldCheck
          return (
            <a key={badge.label} href="#" className="flex items-center gap-1.5 text-xs text-[#6C28D9] hover:underline">
              <Icon className="size-3.5 shrink-0" />
              <span>{badge.label}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
