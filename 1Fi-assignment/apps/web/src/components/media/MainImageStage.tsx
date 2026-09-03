import { RatingPill } from "../shared/RatingPill"

interface MainImageStageProps {
  image: string
  rating: number
}

export function MainImageStage({ image, rating }: MainImageStageProps) {
  return (
    <div className="flex-1">
      <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-muted/30">
        <img src={image} alt="Product" className="size-full object-contain" />
      </div>
      <div className="mt-2 flex justify-end">
        <RatingPill rating={rating} size="sm" />
      </div>
    </div>
  )
}
