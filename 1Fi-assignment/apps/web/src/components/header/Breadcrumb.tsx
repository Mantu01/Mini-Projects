import { ChevronRight } from "lucide-react"
import type { BreadcrumbItem } from "@/data/mock"

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-400 py-2 px-4">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="size-2.5" />}
          {item.href ? (
            <a href={item.href} className="hover:text-orange-500 transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-gray-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
