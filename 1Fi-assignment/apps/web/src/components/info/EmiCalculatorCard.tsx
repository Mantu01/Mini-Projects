import { formatPrice } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Product } from "@/data/types"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function EmiCalculatorCard({ product }: { product: Product }) {
  const [selectedIndex, setSelectedIndex] = useState(product.defaultTenureIndex)
  const selected = product.tenureOptions[selectedIndex]

  return (
    <div className="mt-3 border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center gap-2 mb-1">
        <Badge className="bg-[#6C28D9] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          NEW
        </Badge>
        <span className="text-sm text-muted-foreground">{product.name.split("(")[0].trim()}</span>
      </div>

      <p className="text-sm text-muted-foreground mb-2">
        {Object.values(product.selectedVariant).join(" · ")} · {product.selectedColor}
      </p>

      <div className="mb-3">
        <p className="text-xs text-muted-foreground line-through">{formatPrice(product.mrp)}</p>
        <p className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</p>
      </div>

      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
        <Check className="size-3 text-green-500" />
        EMI plans backed by mutual funds
      </p>

      <RadioGroup
        value={String(selectedIndex)}
        onValueChange={(v) => setSelectedIndex(Number(v))}
        className="flex flex-col gap-2"
      >
        {product.tenureOptions.map((option, idx) => (
          <label
            key={idx}
            htmlFor={`tenure-${idx}`}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedIndex === idx
                ? "border-[#6C28D9] bg-[#6C28D9]/5"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value={String(idx)} id={`tenure-${idx}`} />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {formatPrice(option.monthlyAmount)} × {option.months} months
                </p>
                <p className="text-xs text-green-600">
                  Get {formatPrice(option.cashbackAmount)} cashback
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {option.interestRate}
            </span>
          </label>
        ))}
      </RadioGroup>

      <button className="mt-4 w-full bg-[#6C28D9] hover:bg-[#6C28D9]/90 text-white font-semibold text-sm py-3 rounded-full transition-colors">
        Buy on {selected.months} months EMI
      </button>
    </div>
  )
}
