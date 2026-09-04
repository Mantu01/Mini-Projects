import { Star } from "lucide-react"
import { ReviewAttachments } from "@/components/shared/ReviewAttachments"

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
        <span className="text-[#6C28D9] font-semibold text-sm">{label}</span>
      </div>
      {reviewCount !== undefined && (
        <p className="text-xs text-muted-foreground mb-3">
          {reviewCount} verified customer reviews
        </p>
      )}
      {media.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Customer Images</p>
          <ReviewAttachments
            attachments={media.map((m) => ({ type: m.type, thumbnail: m.thumbnail }))}
            size="sm"
          />
        </div>
      )}
    </div>
  )
}
