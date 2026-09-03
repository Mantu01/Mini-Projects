import { Star, CheckCircle } from "lucide-react"
import { product } from "@/data/mock"

interface ReviewCardProps {
  review: (typeof product.reviews)[0]
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-gray-100 py-3 last:border-0">
      <div className="flex items-center gap-0.5 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-3 ${i < review.stars ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 mb-1">Review for: {review.variantDescription}</p>
      <p className="text-sm text-gray-700 mb-2">{review.text}</p>

      {review.attachments.length > 0 && (
        <div className="flex gap-1.5 mb-2">
          {review.attachments.map((att, idx) => (
            <div key={idx} className="relative">
              <img
                src={att.thumbnail}
                alt=""
                className="size-10 rounded-md object-cover border border-gray-200"
              />
              {att.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                  <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-semibold text-gray-800">
          {review.reviewerName}, {review.city}
        </span>
        {review.verified && (
          <>
            <CheckCircle className="size-3 text-green-500" />
            <span className="text-gray-400">Verified buyer</span>
          </>
        )}
        <span className="text-gray-300">•</span>
        <span className="text-gray-400">{review.timeAgo}</span>
      </div>
    </div>
  )
}

export function ReviewList() {
  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Reviews</h3>
      <div className="flex flex-col">
        {product.reviews.map((review, idx) => (
          <ReviewCard key={idx} review={review} />
        ))}
      </div>
    </div>
  )
}
