import { useState } from "react"
import { ImageGalleryDialog } from "./ImageGalleryDialog"

interface ThumbnailRailProps {
  images: string[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function ThumbnailRail({ images, activeIndex, onSelect }: ThumbnailRailProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const shown = images.slice(0, 5)
  const overflowCount = Math.max(0, images.length - 5)

  return (
    <>
      <div className="flex flex-col gap-1.5 w-16 shrink-0">
        {shown.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
              idx === activeIndex
                ? "border-orange-500 ring-1 ring-orange-300"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img src={img} alt="" className="size-full object-cover" />
          </button>
        ))}
        {overflowCount > 0 && (
          <button
            onClick={() => setGalleryOpen(true)}
            className="aspect-square rounded-md border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer"
          >
            +{overflowCount}
          </button>
        )}
      </div>
      <ImageGalleryDialog
        images={images}
        activeIndex={activeIndex}
        onImageSelect={(idx) => { onSelect(idx); setGalleryOpen(false) }}
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
      />
    </>
  )
}
