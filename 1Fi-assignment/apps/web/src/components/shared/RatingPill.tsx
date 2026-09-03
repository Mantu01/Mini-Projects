import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingPillProps {
  rating: number
  className?: string
  size?: "sm" | "md"
}

export function RatingPill({ rating, className, size = "md" }: RatingPillProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm"
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-md",
        textSize,
        className
      )}
    >
      <Star className="size-3 fill-amber-400 text-amber-400" />
      <span className="font-semibold text-gray-900">{rating}</span>
      <Star className="size-3 fill-amber-400 text-amber-400" />
    </div>
  )
}
