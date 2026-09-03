import { product } from "@/data/mock"

export function ShippingDetails() {
  return (
    <div className="mt-2">
      <h3 className="text-xs font-semibold text-gray-700 mb-0.5">Shipping Details:</h3>
      <p className="text-xs text-gray-400">{product.shipping.text}</p>
    </div>
  )
}
