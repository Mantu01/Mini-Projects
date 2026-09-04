import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useStore } from "@/context/store"
import { StarRating } from "@/components/shared/StarRating"
import { ReviewAttachments } from "@/components/shared/ReviewAttachments"

export function ReviewsPage() {
  const { productSlug } = useParams<{ productSlug: string }>() ?? {}
  if (!productSlug)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">Invalid product.</div>
    )
  const { getAllProductReviews } = useStore()
  const [reviews, setReviews] = useState<
    ReturnType<typeof getAllProductReviews> extends Promise<infer T> ? T : never
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getAllProductReviews(productSlug).then((result) => {
      if (!cancelled) {
        setReviews(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [productSlug, getAllProductReviews])

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center animate-pulse text-muted-foreground">
        Loading reviews...
      </div>
    )
  if (reviews.length === 0)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-muted-foreground">
        No reviews found.
      </div>
    )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      <Link
        to={-1 as any}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#6C28D9] transition-colors mb-4 group/back"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover/back:-translate-x-0.5" />
        Back
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">All Reviews</h1>
      <div className="h-0.5 w-10 bg-[#6C28D9] rounded-full mb-2" />
      <p className="text-sm text-muted-foreground mb-6">
        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-3 md:space-y-4">
        {reviews.map((review, idx) => (
          <ReviewCard key={idx} review={review} />
        ))}
      </div>
    </div>
  )
}

function ReviewCard({
  review,
}: {
  review: {
    stars: number
    variantDescription: string
    text: string
    attachments: Array<{ type: "image" | "video"; thumbnail: string }>
    reviewerName: string
    city: string
    verified: boolean
    timeAgo: string
  }
}) {
  return (
    <div className="border border-border/40 rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <StarRating rating={review.stars} size="xs" />
        <span className="text-xs text-muted-foreground">{review.timeAgo}</span>
      </div>
      {review.variantDescription && (
        <p className="text-xs text-muted-foreground mb-1">
          Review for: {review.variantDescription}
        </p>
      )}
      <p className="text-sm text-foreground mb-2">{review.text}</p>
      <ReviewAttachments attachments={review.attachments} size="xs" />
      <div className="flex flex-wrap items-center gap-1.5 text-xs mt-2 pt-2 border-t border-border/30">
        <span className="font-semibold text-foreground">
          {review.reviewerName}, {review.city}
        </span>
        {review.verified && (
          <>
            <CheckCircle className="size-3 text-accent-green" />
            <span className="text-muted-foreground">Verified buyer</span>
          </>
        )}
      </div>
    </div>
  )
}
