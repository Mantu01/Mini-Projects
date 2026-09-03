import { Star } from "lucide-react"

interface ReviewSummaryProps {
  rating: number
  media: Array<{ type: "image" | "video"; thumbnail: string }>
  reviewCount?: number
}

function getRatingLabel(score: number): string {
  if (score >= 4.0) return "Excellent"
  if (score >= 3.0) return "Good"
  if (score >= 2.0) return "Average"
  return "Poor"
}

export function ReviewSummary({ rating, media, reviewCount }: ReviewSummaryProps) {
  const label = getRatingLabel(rating)

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-semibold text-foreground mb-2">Review & Rating</h3>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl font-bold text-foreground">{rating}</span>
        <Star className="size-4 fill-amber-400 text-amber-400" />
        <span className="text-accent-purple font-semibold text-sm">{label}</span>
      </div>
      {reviewCount !== undefined && (
        <p className="text-xs text-muted-foreground mb-3">
          {reviewCount} verified customer reviews
        </p>
      )}

      {media.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Customer Images</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {media.map((item, idx) => (
              <div key={idx} className="shrink-0 size-12 relative">
                <img src={item.thumbnail} alt="" className="size-full rounded-md object-cover border border-border" />
                {item.type === "video" && (
                  <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full bg-black/60 flex items-center justify-center">
                    <svg className="size-2 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
