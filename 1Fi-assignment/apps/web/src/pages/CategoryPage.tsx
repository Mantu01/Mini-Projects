import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom"
import { useStore } from "@/context/store"
import type { Product } from "@/data/types"
import { ProductCard } from "@/components/ProductCard"

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>() ?? {}
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getCategoryProducts, getCategoryName } = useStore()

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10) || 1

  const categoryName = useMemo(() => getCategoryName(categorySlug!) ?? categorySlug!, [categorySlug, getCategoryName])

  const [data, setData] = useState<{ items: Product[]; total: number; totalPages: number }>({ items: [], total: 0, totalPages: 1 })
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
    return () => { cancelled = true }
  }, [categoryName, currentPage, getCategoryProducts])

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    if (p > 1) next.set("page", String(p))
    else next.delete("page")
    navigate(`/c/${categorySlug}?${next.toString()}`, { replace: true })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{categoryName}</h1>
          {data.total > 0 && <p className="text-sm text-muted-foreground mt-1">{data.total} products</p>}
        </div>
        <Link to="/" className="text-sm text-[#6C28D9] hover:underline">Back to Home</Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : !data.items.length ? (
        <div className="text-center py-16 text-muted-foreground">No products in this category yet.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  const pages = getVisiblePages(currentPage, totalPages)
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-md text-sm border border-border disabled:opacity-40 hover:border-[#6C28D9] transition-colors"
      >
        Prev
      </button>

      {pages[0] !== 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1.5 rounded-md text-sm border border-border hover:border-[#6C28D9] transition-colors">1</button>
          {pages[0] !== 2 && <span className="text-muted-foreground px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
            p === currentPage
              ? "bg-[#6C28D9] text-white border-[#6C28D9]"
              : "border-border hover:border-[#6C28D9]"
          }`}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] !== totalPages && (
        <>
          {pages[pages.length - 1] !== totalPages - 1 && <span className="text-muted-foreground px-1">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-1.5 rounded-md text-sm border border-border hover:border-[#6C28D9] transition-colors">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-md text-sm border border-border disabled:opacity-40 hover:border-[#6C28D9] transition-colors"
      >
        Next
      </button>
    </div>
  )
}

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, total - 1, total]
  if (current >= total - 3) return [1, 2, total - 3, total - 2, total - 1, total]
  return [1, current - 1, current, current + 1, total]
}
