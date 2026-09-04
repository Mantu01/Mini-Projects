import { Play } from "lucide-react"

interface Attachment {
  type: "image" | "video"
  thumbnail: string
}

interface ReviewAttachmentsProps {
  attachments: Attachment[]
  size?: "xs" | "sm" | "md"
}

const sizeMap = { xs: "size-10", sm: "size-12", md: "size-14" }
const iconSizeMap = { xs: "size-2", sm: "size-2.5", md: "size-3" }
const iconContainerMap = { xs: "size-2.5", sm: "size-3", md: "size-3.5" }

export function ReviewAttachments({ attachments, size = "xs" }: ReviewAttachmentsProps) {
  if (!attachments.length) return null
  return (
    <div className="flex gap-1.5">
      {attachments.map((att, i) => (
        <div key={i} className={`shrink-0 ${sizeMap[size]} relative`}>
          <img
            src={att.thumbnail}
            alt=""
            className="size-full rounded-md object-cover border border-border"
          />
          {att.type === "video" && (
            <span
              className={`absolute bottom-0.5 right-0.5 ${iconContainerMap[size]} rounded-full bg-black/60 flex items-center justify-center`}
            >
              <Play className={`${iconSizeMap[size]} text-white fill-white`} />
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
