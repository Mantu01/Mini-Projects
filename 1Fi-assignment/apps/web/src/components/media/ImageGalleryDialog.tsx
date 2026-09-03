import { useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ImageGalleryDialogProps {
  images: string[]
  activeIndex: number
  onImageSelect: (index: number) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageGalleryDialog({ images, activeIndex, onImageSelect, open, onOpenChange }: ImageGalleryDialogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !scrollRef.current) return
    const active = scrollRef.current.children[activeIndex] as HTMLElement
    if (active) {
      active.scrollIntoView({ block: "nearest", inline: "center" })
    }
  }, [open, activeIndex])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] p-0 gap-0 bg-white rounded-2xl overflow-hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-10 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
          <img
            src={images[activeIndex]}
            alt=""
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        </div>
        <div className="border-t px-3 py-2.5 shrink-0">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onImageSelect(idx)}
                className={`shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                  idx === activeIndex
                    ? "border-orange-500 ring-1 ring-orange-300"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img src={img} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
