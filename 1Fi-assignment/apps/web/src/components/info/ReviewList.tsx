import { Star, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { Product, Review } from "@/data/types"

interface ReviewCardProps {
  review: Review
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-border/40 py-3 last:border-0">
      <div className="flex items-center gap-0.5 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-3 ${i < review.stars ? "fill-amber-400 text-amber-400" : "text-muted/40"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-1">Review for: {review.variantDescription}</p>
      <p className="text-sm text-foreground mb-2">{review.text}</p>

      {review.attachments.length > 0 && (
        <div className="flex gap-1.5 mb-2">
          {review.attachments.map((att, idx) => (
            <div key={idx} className="shrink-0 size-10 relative">
              <img src={att.thumbnail} alt="" className="size-full rounded-md object-cover border border-border" />
              {att.type === "video" && (
                <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full bg-black/60 flex items-center justify-center">
                  <svg className="size-2 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-semibold text-foreground">
          {review.reviewerName}, {review.city}
        </span>
        {review.verified && (
          <>
            <Star className="size-3 text-accent-green" />
            <span className="text-muted-foreground">Verified buyer</span>
          </>
        )}
        <span className="text-muted-foreground/40">•</span>
        <span className="text-muted-foreground">{review.timeAgo}</span>
      </div>
    </div>
  )
}

export function ReviewList({ product }: { product: Product }) {
  const previewReviews = product.reviews.slice(0, 6)
  const hasMore = product.reviews.length > 6

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Top Reviews</h3>
        {hasMore && (
          <Link
            to={`/p/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${product.slug}/reviews`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#6C28D9] hover:underline"
          >
            View All Reviews
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      {product.reviews.length === 0 ? (
        <p className="text-xs text-muted-foreground">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="flex flex-col">
          {previewReviews.map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}
