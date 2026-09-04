import { TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import type { Product } from "@/types"
import { formatPrice } from "@/lib/utils"
import { productLink } from "@/lib/links"
import { StarRating } from "@/components/shared/StarRating"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0

  return (
    <Link to={productLink(product.category, product.slug)} className="group block">
      <div className="rounded-2xl border border-border/60 bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(108,40,217,0.15)] hover:border-[#6C28D9]/20 hover:-translate-y-1">
        <div className="relative aspect-square bg-gradient-to-b from-muted/20 to-muted/5 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {discount > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-[#6C28D9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
              {discount}% OFF
            </div>
          )}
          <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
            <StarRating rating={product.rating} size="xs" />
          </div>
        </div>

        <div className="p-3.5">
          <h3 className="text-[13px] font-medium text-foreground/80 line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-foreground tracking-tight">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center justify-between">
            {discount > 0 && (
              <span className="text-[11px] font-semibold text-accent-green">
                {discount}% off
              </span>
            )}
            <div className="flex items-center gap-1 text-muted-foreground ml-auto">
              <TrendingUp className="size-3" />
              <span className="text-[10px] font-medium">{product.soldCount}+ sold</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
