import { Star } from "lucide-react"
import { Link } from "react-router-dom"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    rating: number
    soldCount: number
    image: string
    category: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => "₹" + price.toLocaleString("en-IN")
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow bg-white">
        <div className="aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <p className="text-xs text-gray-400 mb-0.5">{product.category}</p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-base font-bold text-gray-900">{formatPrice(product.price)}</p>
              <p className="text-xs text-green-600">{product.soldCount}+ sold</p>
            </div>
            <span className="text-xs text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
