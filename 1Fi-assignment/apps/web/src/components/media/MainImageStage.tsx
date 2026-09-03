import { RatingPill } from "../shared/RatingPill"

interface MainImageStageProps {
  image: string
  rating: number
}

export function MainImageStage({ image, rating }: MainImageStageProps) {
  return (
    <div className="relative flex-1">
      <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
        <img
          src={image}
          alt="Product"
          className="size-full object-contain"
        />
      </div>
      <div className="absolute bottom-3 right-3">
        <RatingPill rating={rating} size="sm" />
      </div>
    </div>
  )
}
