import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Star, CheckCircle } from "lucide-react"
import { useStore } from "@/context/store"

export function ReviewsPage() {
  const { productSlug } = useParams<{ productSlug: string }>() ?? {}
  if (!productSlug) return <div className="max-w-4xl mx-auto px-4 py-8 text-center">Invalid product.</div>
  const { getAllProductReviews } = useStore()
  const [reviews, setReviews] = useState<ReturnType<typeof getAllProductReviews> extends Promise<infer T> ? T : never>([])
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
    return () => { cancelled = true }
  }, [productSlug, getAllProductReviews])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 text-center">Loading reviews...</div>
  if (reviews.length === 0) return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-muted-foreground">No reviews found.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">All Reviews</h1>
      <p className="text-sm text-muted-foreground mb-6">{reviews.length} reviews</p>

      <div className="space-y-4">
        {reviews.map((review, idx) => (
          <ReviewCard key={idx} review={review} />
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: { stars: number; variantDescription: string; text: string; attachments: Array<{ type: "image" | "video"; thumbnail: string }>; reviewerName: string; city: string; verified: boolean; timeAgo: string } }) {
  return (
    <div className="border-b border-border/40 pb-4 last:border-0">
      <div className="flex items-center gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-3 ${i < review.stars ? "fill-amber-400 text-amber-400" : "text-muted/40"}`}
          />
        ))}
      </div>
      {review.variantDescription && (
        <p className="text-xs text-muted-foreground mb-1">Review for: {review.variantDescription}</p>
      )}
      <p className="text-sm text-foreground mb-2">{review.text}</p>
      {review.attachments?.length > 0 && (
        <div className="flex gap-1.5 mb-2">
          {review.attachments.map((att, i) => (
            <div key={i} className="shrink-0 size-10 relative">
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
        <span className="font-semibold">{review.reviewerName}, {review.city}</span>
        {review.verified && (
          <>
            <CheckCircle className="size-3 text-accent-green" />
            <span className="text-muted-foreground">Verified buyer</span>
          </>
        )}
        <span className="text-muted-foreground/40 mx-1">•</span>
        <span className="text-muted-foreground">{review.timeAgo}</span>
      </div>
    </div>
  )
}
