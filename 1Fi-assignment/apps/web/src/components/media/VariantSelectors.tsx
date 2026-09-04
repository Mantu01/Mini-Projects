import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product } from "@/types"

type VariantSelectorProps = {
  value: string
  onChange: (value: string) => void
  label: string
  options: string[]
}

function SingleVariantSelector({ value, onChange, label, options }: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

interface VariantSelectorsProps {
  product: Product
  selectedColor: string
  selectedVariant: Record<string, string | null>
  onColorChange: (color: string) => void
  onVariantChange: (variant: Record<string, string | null>) => void
}

export function VariantSelectors({
  product,
  selectedColor,
  selectedVariant,
  onColorChange,
  onVariantChange,
}: VariantSelectorsProps) {
  const formatVariant = (v: Record<string, string | null>) =>
    Object.entries(v)
      .map(([k, val]) => `${k}: ${val ?? "null"}`)
      .join(", ")

  const hasColors = product.colorOptions.length > 1
  const hasVariants = product.variantOptions.length > 0

  if (!hasColors && !hasVariants) return null

  return (
    <div className={`grid ${hasColors && hasVariants ? "grid-cols-2" : "grid-cols-1"} gap-4 pt-4`}>
      {hasColors && (
        <SingleVariantSelector
          label="Color"
          value={selectedColor}
          onChange={onColorChange}
          options={product.colorOptions}
        />
      )}
      {hasVariants && (
        <SingleVariantSelector
          label="Variant"
          value={formatVariant(selectedVariant)}
          onChange={(v) => {
            const idx = product.variantOptions.findIndex((vo) => formatVariant(vo) === v)
            if (idx !== -1) onVariantChange(product.variantOptions[idx])
          }}
          options={product.variantOptions.map(formatVariant)}
        />
      )}
    </div>
  )
}
