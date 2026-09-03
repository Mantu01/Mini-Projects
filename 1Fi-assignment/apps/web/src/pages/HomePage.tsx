import { useMemo } from "react"
import { productSummaries } from "@/data/catalog"
import { categories, slugForCategory } from "@/data/site"
import { ProductCard } from "@/components/ProductCard"

const FEATURED_PER_CATEGORY = 8

function HeroSection() {
  return (
    <section className="bg-linear-to-r from-accent-purple to-accent-purple/80 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Shop on Easy EMI</h1>
        <p className="text-lg opacity-90 max-w-xl">
          Buy now, pay later with zero cost EMI. No hidden charges.
        </p>
      </div>
    </section>
  )
}

function CategorySection({
  title,
  slug,
  products,
}: {
  title: string
  slug: string
  products: typeof productSummaries
}) {
  if (!products.length) return null
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <a
            href={`/c/${slug}`}
            className="text-sm font-semibold text-accent-purple hover:underline"
          >
            View All →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, FEATURED_PER_CATEGORY).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const byCategory = useMemo(() => {
    const map = new Map<string, typeof productSummaries>()
    for (const cat of categories) {
      map.set(cat, productSummaries.filter((p) => p.category === cat))
    }
    return map
  }, [categories])

  return (
    <>
      <HeroSection />
      {categories.map((cat) => (
        <CategorySection
          key={cat}
          title={cat}
          slug={slugForCategory(cat)}
          products={byCategory.get(cat) ?? []}
        />
      ))}
    </>
  )
}
