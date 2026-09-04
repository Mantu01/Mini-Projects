import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { categories, slugForCategory } from "@/data/site"
import { productSummaries } from "@/data/catalog"
import { ProductCard } from "@/components/ProductCard"

const categoryNamesBySlug = new Map<string, string>(
  categories.map((c) => [slugForCategory(c), c])
)

export function CategoryPage() {
  const categorySlug = useParams<{ categorySlug: string }>()?.categorySlug ?? ""
  const categoryName = categoryNamesBySlug.get(categorySlug) ?? categorySlug
  const products = useMemo(
    () => productSummaries.filter((p) => p.category === categoryName),
    [categoryName],
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">{categoryName}</h1>
      <p className="text-sm text-muted-foreground mb-6">{products.length} products</p>
      {products.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
