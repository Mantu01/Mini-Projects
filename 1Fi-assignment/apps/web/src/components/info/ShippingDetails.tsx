import type { Product } from "@/types"

export function ShippingDetails({ product }: { product: Product }) {
  return (
    <div className="mt-2">
      <h3 className="text-xs font-semibold text-foreground mb-0.5">Shipping Details:</h3>
      <p className="text-xs text-muted-foreground">{product.shipping.text}</p>
    </div>
  )
}
