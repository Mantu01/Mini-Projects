import { Star, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    category: string
    price: number
    mrp: number
    rating: number
    soldCount: number
    image: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`
  return (
    <Link to={`/p/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${product.slug}`} className="group block">
      <div className="rounded-xl border bg-white overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square bg-muted/30 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted/40"}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
              <p className="text-xs text-accent-green font-medium">{product.soldCount}+ sold</p>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-accent-purple transition-colors">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
