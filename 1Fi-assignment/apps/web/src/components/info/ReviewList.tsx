import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { Product, Review } from "@/types"
import { productLink } from "@/lib/links"
import { StarRating } from "@/components/shared/StarRating"
import { ReviewAttachments } from "@/components/shared/ReviewAttachments"

interface ReviewCardProps {
  review: Review
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-border/40 py-3 last:border-0">
      <StarRating rating={review.stars} size="xs" />
      <p className="text-xs text-muted-foreground mt-1 mb-1">
        Review for: {review.variantDescription}
      </p>
      <p className="text-sm text-foreground mb-2">{review.text}</p>
      <ReviewAttachments attachments={review.attachments} size="xs" />
      <div className="flex flex-wrap items-center gap-1.5 text-xs mt-2">
        <span className="font-semibold text-foreground">
          {review.reviewerName}, {review.city}
        </span>
        {review.verified && (
          <span className="text-accent-green text-[10px] font-medium">✓ Verified</span>
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
            to={productLink(product.category, product.slug) + "/reviews"}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#6C28D9] hover:underline"
          >
            View All Reviews
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      {product.reviews.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No reviews yet. Be the first to review!
        </p>
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
