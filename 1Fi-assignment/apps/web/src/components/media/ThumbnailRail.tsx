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
                ? "border-[#6C28D9] ring-1 ring-[#6C28D9]/30"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <img src={img} alt="" className="size-full object-cover" />
          </button>
        ))}
        {overflowCount > 0 && (
          <button
            onClick={() => setGalleryOpen(true)}
            className="aspect-square rounded-md border-2 border-border flex items-center justify-center text-xs font-medium text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted transition-all cursor-pointer"
          >
            +{overflowCount}
          </button>
        )}
      </div>
      <ImageGalleryDialog
        images={images}
        activeIndex={activeIndex}
        onImageSelect={(idx) => { onSelect(idx) }}
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
      />
    </>
  )
}
