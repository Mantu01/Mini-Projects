import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom"
import { useStore } from "@/context/store"
import type { Product } from "@/types"
import { ProductCard } from "@/components/ProductCard"
import { ArrowLeft, ChevronLeft, ChevronRight, PackageOpen } from "lucide-react"

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>() ?? {}
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getCategoryProducts, getCategoryName } = useStore()

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10) || 1

  const categoryName = useMemo(
    () => getCategoryName(categorySlug!) ?? categorySlug!,
    [categorySlug, getCategoryName]
  )

  const [data, setData] = useState<{
    items: Product[]
    total: number
    totalPages: number
  }>({ items: [], total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getCategoryProducts(categoryName, currentPage).then((result) => {
      if (!cancelled) {
        setData(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [categoryName, currentPage, getCategoryProducts])

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    if (p > 1) next.set("page", String(p))
    else next.delete("page")
    navigate(`/c/${categorySlug}?${next.toString()}`, { replace: true })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#6C28D9] transition-colors mb-3 group/back"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover/back:-translate-x-0.5" />
          Back to Home
        </Link>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {categoryName}
            </h1>
            <div className="mt-1 h-0.5 w-10 bg-[#6C28D9] rounded-full" />
            {data.total > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {data.total} product{data.total !== 1 ? "s" : ""} available
              </p>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 10 }).map((_, j) => (
            <div
              key={j}
              className="rounded-2xl border border-border/40 overflow-hidden"
            >
              <div className="aspect-square bg-muted/40 animate-pulse" />
              <div className="p-3.5 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/3 mt-3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : !data.items.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-16 rounded-full bg-muted/40 flex items-center justify-center mb-4">
            <PackageOpen className="size-7 text-muted-foreground/60" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            No products found
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            There are no products in this category yet. Check back later or browse
            other categories.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6C28D9] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5a20b5] transition-colors"
          >
            Browse all categories
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {data.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pages = getVisiblePages(currentPage, totalPages)
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 md:mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border border-border disabled:opacity-30 hover:border-[#6C28D9] hover:text-[#6C28D9] transition-all disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-3.5" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {pages[0] !== 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="min-w-[36px] h-9 rounded-xl text-sm font-medium border border-border hover:border-[#6C28D9] hover:text-[#6C28D9] transition-all"
          >
            1
          </button>
          {pages[0] !== 2 && (
            <span className="text-muted-foreground px-0.5">…</span>
          )}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`min-w-[36px] h-9 rounded-xl text-sm font-medium border transition-all ${
            p === currentPage
              ? "bg-[#6C28D9] text-white border-[#6C28D9] shadow-sm shadow-[#6C28D9]/20"
              : "border-border hover:border-[#6C28D9] hover:text-[#6C28D9]"
          }`}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] !== totalPages && (
        <>
          {pages[pages.length - 1] !== totalPages - 1 && (
            <span className="text-muted-foreground px-0.5">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="min-w-[36px] h-9 rounded-xl text-sm font-medium border border-border hover:border-[#6C28D9] hover:text-[#6C28D9] transition-all"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border border-border disabled:opacity-30 hover:border-[#6C28D9] hover:text-[#6C28D9] transition-all disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  )
}

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, total - 1, total]
  if (current >= total - 3)
    return [1, 2, total - 3, total - 2, total - 1, total]
  return [1, current - 1, current, current + 1, total]
}
