import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return "₹" + price.toLocaleString("en-IN")
}

export function slugForCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function resolveProductPrice(
  product: Product,
  selectedColor: string,
  selectedVariant: Record<string, string>,
): { price: number; mrp: number; images: string[] } {
  if (product.options.length === 0) {
    return { price: product.price, mrp: product.mrp, images: product.images }
  }

  const selectedVariantValue = Object.values(selectedVariant).find(Boolean) ?? null
  const selectedVariantLabel = Object.keys(selectedVariant).find(
    (k) => selectedVariant[k],
  ) ?? null

  const matched = product.options.find((opt) => {
    const colorMatch = selectedColor
      ? opt.color === selectedColor
      : true
    const labelMatch = selectedVariantLabel
      ? opt.variantLabel === selectedVariantLabel
      : true
    const valueMatch = selectedVariantValue
      ? opt.variantValue === selectedVariantValue
      : true
    return colorMatch && labelMatch && valueMatch
  })

  if (!matched) {
    return { price: product.price, mrp: product.mrp, images: product.images }
  }

  return {
    price: matched.price,
    mrp: matched.mrp,
    images: matched.images ?? product.images,
  }
}
