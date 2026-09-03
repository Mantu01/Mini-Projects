import { Star } from "lucide-react"

interface ReviewSummaryProps {
  rating: number
  media: Array<{ type: "image" | "video"; thumbnail: string }>
}

function getRatingLabel(score: number): string {
  if (score >= 4.0) return "Excellent"
  if (score >= 3.0) return "Good"
  if (score >= 2.0) return "Average"
  return "Poor"
}

export function ReviewSummary({ rating, media }: ReviewSummaryProps) {
  const label = getRatingLabel(rating)

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Review & Rating</h3>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-bold text-gray-900">{rating}</span>
        <Star className="size-4 fill-amber-400 text-amber-400" />
        <span className="text-orange-500 font-semibold text-sm">{label}</span>
      </div>

      {media.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Customer Images</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {media.map((item, idx) => (
              <div key={idx} className="relative shrink-0">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="size-12 rounded-md object-cover border border-gray-200"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                    <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
