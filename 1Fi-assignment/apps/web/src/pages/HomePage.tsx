import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useStore } from "@/context/store"
import { ProductCard } from "@/components/ProductCard"
import { ArrowRight, Loader2 } from "lucide-react"

function HeroSection() {
  return (
    <section className="bg-linear-to-br from-[#6C28D9]/10 via-[#d8b4fe]/10 to-[#f3e8ff]/10 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-[#6C28D9]/10 text-[#6C28D9] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span className="size-1.5 rounded-full bg-[#6C28D9] animate-pulse" />
            Zero Cost EMI Available
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Shop on Easy EMI
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
            Buy now, pay later with zero cost EMI. No hidden charges, no extra fees.
          </p>
        </div>
      </div>
    </section>
  )
}

function CategoryRow({
  title,
  slug,
  products,
  index,
}: {
  title: string
  slug: string
  products: any[]
  index: number
}) {
  if (!products.length) return null
  const isEven = index % 2 === 0

  return (
    <section
      className={`py-8 md:py-10 ${isEven ? "bg-white" : "bg-muted/20"} border-b border-border/30`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <div className="mt-1 h-0.5 w-10 bg-[#6C28D9] rounded-full" />
          </div>
          <Link
            to={`/c/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6C28D9] hover:text-[#5a20b5] transition-colors group/link"
          >
            View All
            <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LoadingSkeleton() {
  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-8">
            <div className="h-7 w-40 bg-muted rounded-lg mb-2 animate-pulse" />
            <div className="h-0.5 w-10 bg-muted rounded-full mb-5 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, j) => (
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
          </div>
        ))}
        <div className="flex items-center justify-center gap-2 text-muted-foreground mt-4">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm">Loading products...</span>
        </div>
      </div>
    </>
  )
}

export function HomePage() {
  const { getHomeCategoryRows, categoriesLoaded } = useStore()
  const [rows, setRows] = useState<
    Array<{ title: string; slug: string; products: any[] }>
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getHomeCategoryRows().then((result) => {
      if (!cancelled) {
        setRows(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [getHomeCategoryRows])

  if (loading || !categoriesLoaded) return <LoadingSkeleton />

  return (
    <>
      <HeroSection />
      {rows.map((row, index) => (
        <CategoryRow
          key={row.title}
          title={row.title}
          slug={row.slug}
          products={row.products}
          index={index}
        />
      ))}
      {rows.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-sm">
            No categories available right now.
          </p>
        </div>
      )}
    </>
  )
}
