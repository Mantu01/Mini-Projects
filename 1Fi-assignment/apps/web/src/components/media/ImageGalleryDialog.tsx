import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ImageGalleryDialogProps {
  images: string[];
  activeIndex: number;
  onImageSelect: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageGalleryDialog({
  images,
  activeIndex,
  onImageSelect,
  open,
  onOpenChange,
}: ImageGalleryDialogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !scrollRef.current) return;
    const child = scrollRef.current.children[activeIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [open, activeIndex]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-none h-screen w-screen p-0 gap-0 border-0 bg-background"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Product Image Gallery</DialogTitle>

        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 right-5 z-20 size-10 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 shadow-lg"
          aria-label="Close gallery"
        >
          <svg
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute top-5 left-5 z-20 bg-black/40 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full border border-white/10 select-none">
          {activeIndex + 1} / {images.length}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
          <div className="flex-1 flex items-center justify-center p-6 md:p-10">
            <img
              src={images[activeIndex]}
              alt=""
              className="max-h-[calc(100vh-180px)] w-auto object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm px-4 py-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onImageSelect(idx)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    idx === activeIndex
                      ? "border-accent-purple ring-2 ring-accent-purple/30 shadow-md scale-105"
                      : "border-border hover:border-muted-foreground/30 hover:scale-105"
                  }`}
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}