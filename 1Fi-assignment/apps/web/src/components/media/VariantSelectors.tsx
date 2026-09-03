import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { product } from "@/data/mock"

type VariantSelectorProps = {
  value: string
  onChange: (value: string) => void
  label: string
  options: string[]
}

function SingleVariantSelector({ value, onChange, label, options }: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-gray-900">{label}</span>
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
  selectedColor: string
  selectedVariant: Record<string, string | null>
  onColorChange: (color: string) => void
  onVariantChange: (variant: Record<string, string | null>) => void
}

export function VariantSelectors({
  selectedColor,
  selectedVariant,
  onColorChange,
  onVariantChange,
}: VariantSelectorsProps) {
  const formatVariant = (v: Record<string, string | null>) =>
    Object.entries(v)
      .map(([k, val]) => `${k}: ${val ?? "null"}`)
      .join(", ")

  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <SingleVariantSelector
        label="Color"
        value={selectedColor}
        onChange={onColorChange}
        options={product.colorOptions}
      />
      <SingleVariantSelector
        label="Variant"
        value={formatVariant(selectedVariant)}
        onChange={(v) => {
          const idx = product.variantOptions.findIndex((vo) => formatVariant(vo) === v)
          if (idx !== -1) onVariantChange(product.variantOptions[idx])
        }}
        options={product.variantOptions.map(formatVariant)}
      />
    </div>
  )
}
