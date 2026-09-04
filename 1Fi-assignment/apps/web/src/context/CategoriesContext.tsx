import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { fetchCategories } from "@/api/categories"
import type { Category } from "@/api/categories"
import { slugForCategory } from "@/lib/utils"

export interface CategoryOption {
  id: string
  name: string
  slug: string
}

interface CategoriesContextValue {
  categories: CategoryOption[]
  categoriesLoaded: boolean
  getCategoryName: (slug: string) => string | undefined
  getCategorySlug: (name: string) => string
  categoryIdToNameMap: Map<string, string>
}

const CategoriesContext = createContext<CategoriesContextValue>({
  categories: [],
  categoriesLoaded: false,
  getCategoryName: () => undefined,
  getCategorySlug: slugForCategory,
  categoryIdToNameMap: new Map(),
})

export function useCategories() {
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchCategories(1, 50)
      .then((result) => {
        if (!cancelled) {
          setCategories(result.items.map((c: Category) => ({ id: c.id, name: c.name, slug: c.slug })))
          setCategoriesLoaded(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([])
          setCategoriesLoaded(true)
        }
      })
    return () => { cancelled = true }
  }, [])

  const categoryIdToNameMap = useMemo(() => {
    const m = new Map<string, string>()
    categories.forEach((c) => m.set(c.id, c.name))
    return m
  }, [categories])

  const categoryNameToSlugMap = useMemo(() => {
    const m = new Map<string, string>()
    categories.forEach((c) => m.set(c.name.toLowerCase(), c.slug))
    return m
  }, [categories])

  const slugToCategoryNameMap = useMemo(() => {
    const m = new Map<string, string>()
    categories.forEach((c) => m.set(c.slug, c.name))
    return m
  }, [categories])

  return {
    categories,
    categoriesLoaded,
    getCategoryName: (slug: string) => slugToCategoryNameMap.get(slug),
    getCategorySlug: (name: string) => categoryNameToSlugMap.get(name.toLowerCase()) ?? slugForCategory(name),
    categoryIdToNameMap,
  }
}

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const { categories, categoriesLoaded, getCategoryName, getCategorySlug, categoryIdToNameMap } = useCategories()

  const value = useMemo<CategoriesContextValue>(
    () => ({ categories, categoriesLoaded, getCategoryName, getCategorySlug, categoryIdToNameMap }),
    [categories, categoriesLoaded, getCategoryName, getCategorySlug, categoryIdToNameMap],
  )

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}

export const useCategoriesContext = () => useContext(CategoriesContext)
