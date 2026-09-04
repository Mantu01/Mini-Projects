import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: "xs" | "sm" | "md"
}

const sizeMap = { xs: "size-2.5", sm: "size-3", md: "size-3.5" }

export function StarRating({ rating, maxStars = 5, size = "sm" }: StarRatingProps) {
  const cls = sizeMap[size]
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted/40"}`}
        />
      ))}
    </div>
  )
}
