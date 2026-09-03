import { categories } from "@/data/mock"
import { ProductCard } from "@/components/ProductCard"
import { TopUtilityBar } from "@/components/header/TopUtilityBar"
import { CategoryNavBar } from "@/components/header/CategoryNavBar"
import { MegaFooter } from "@/components/footer/MegaFooter"
import { useState } from "react"

const allProducts = [
  {
    id: "sku-0001",
    name: "Apple iPhone 17 Pro",
    price: 134900,
    rating: 4.2,
    soldCount: 70,
    image: "https://placehold.co/400x400/f5f5f5/333?text=iPhone+17+Pro",
    category: "Mobiles",
  },
  {
    id: "sku-0002",
    name: "Samsung Galaxy S25 Ultra",
    price: 129999,
    rating: 4.5,
    soldCount: 55,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Galaxy+S25",
    category: "Mobiles",
  },
  {
    id: "sku-0003",
    name: "OnePlus 13",
    price: 64999,
    rating: 4.3,
    soldCount: 42,
    image: "https://placehold.co/400x400/f5f5f5/333?text=OnePlus+13",
    category: "Mobiles",
  },
  {
    id: "sku-0004",
    name: "Sony WH-1000XM5 Headphones",
    price: 26990,
    rating: 4.7,
    soldCount: 120,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Sony+XM5",
    category: "Electronics",
  },
  {
    id: "sku-0005",
    name: "Apple MacBook Air M3",
    price: 114900,
    rating: 4.6,
    soldCount: 38,
    image: "https://placehold.co/400x400/f5f5f5/333?text=MacBook+Air",
    category: "Electronics",
  },
  {
    id: "sku-0006",
    name: "Samsung 55\" 4K Smart TV",
    price: 42990,
    rating: 4.4,
    soldCount: 65,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Samsung+TV",
    category: "TV, AC & Appliances",
  },
  {
    id: "sku-0007",
    name: "Dyson V15 Detect Vacuum",
    price: 52900,
    rating: 4.5,
    soldCount: 28,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Dyson+V15",
    category: "Kitchen & Home",
  },
  {
    id: "sku-0008",
    name: "boAt Airdopes 441",
    price: 1999,
    rating: 4.1,
    soldCount: 340,
    image: "https://placehold.co/400x400/f5f5f5/333?text=boAt+Airdopes",
    category: "Electronics",
  },
  {
    id: "sku-0009",
    name: "Pigeon Stainless Steel Induction Cooktop",
    price: 2499,
    rating: 4.0,
    soldCount: 88,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Induction+Cooktop",
    category: "Kitchen & Home",
  },
  {
    id: "sku-0010",
    name: "Nike Air Max 270",
    price: 12995,
    rating: 4.3,
    soldCount: 210,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Nike+Air+Max",
    category: "Fashion",
  },
  {
    id: "sku-0011",
    name: "Amway Nutrilite Protein Powder",
    price: 1899,
    rating: 4.4,
    soldCount: 156,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Protein+Powder",
    category: "Health & Wellness",
  },
  {
    id: "sku-0012",
    name: "Prestige Induction Cooktop",
    price: 1799,
    rating: 4.2,
    soldCount: 95,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Prestige+Cooktop",
    category: "Kitchen & Home",
  },
  {
    id: "sku-0013",
    name: "Xiaomi Redmi Note 14 Pro",
    price: 21999,
    rating: 4.3,
    soldCount: 180,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Redmi+Note+14",
    category: "Mobiles",
  },
  {
    id: "sku-0014",
    name: "LG 1.5 Ton 5 Star Inverter AC",
    price: 38499,
    rating: 4.5,
    soldCount: 47,
    image: "https://placehold.co/400x400/f5f5f5/333?text=LG+AC",
    category: "TV, AC & Appliances",
  },
  {
    id: "sku-0015",
    name: "Apple Watch Series 10",
    price: 41900,
    rating: 4.6,
    soldCount: 63,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Apple+Watch",
    category: "Electronics",
  },
  {
    id: "sku-0016",
    name: "Puma Running Shoes",
    price: 4495,
    rating: 4.2,
    soldCount: 145,
    image: "https://placehold.co/400x400/f5f5f5/333?text=Puma+Shoes",
    category: "Fashion",
  },
]

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredProducts =
    selectedCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopUtilityBar />
      <CategoryNavBar categories={categories} />

      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Shop on EMI</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "All"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Showing {filteredProducts.length} products
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  )
}
