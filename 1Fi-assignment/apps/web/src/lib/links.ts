import { slugForCategory } from "@/lib/utils"

export function productLink(category: string, slug: string): string {
  return `/p/${slugForCategory(category)}/${slug}`
}

export function categoryLink(slug: string): string {
  return `/c/${slug}`
}
