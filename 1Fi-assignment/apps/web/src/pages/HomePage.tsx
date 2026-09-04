import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useStore } from "@/context/store"
import { ProductCard } from "@/components/ProductCard"

function HeroSection() {
  return (
    <section className="bg-linear-to-r from-[#6C28D9]/10 via-[#d8b4fe]/10 to-[#f3e8ff]/10">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Shop on Easy EMI</h1>
        <p className="text-lg opacity-90 max-w-xl">
          Buy now, pay later with zero cost EMI. No hidden charges.
        </p>
      </div>
    </section>
  )
}

function CategoryRow({ title, slug, products }: { title: string; slug: string; products: any[] }) {
  if (!products.length) return null
  return (
    <section className="py-8 bg-white border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <Link to={`/c/${slug}`} className="text-sm font-semibold text-[#6C28D9] hover:underline whitespace-nowrap">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const { getHomeCategoryRows, categoriesLoaded } = useStore()
  const [rows, setRows] = useState<Array<{ title: string; slug: string; products: any[] }>>([])
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
    return () => { cancelled = true }
  }, [getHomeCategoryRows])

  if (loading || !categoriesLoaded) {
    return (
      <>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-pulse text-muted-foreground">Loading categories...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <HeroSection />
      {rows.map((row) => (
        <CategoryRow key={row.title} title={row.title} slug={row.slug} products={row.products} />
      ))}
    </>
  )
}
