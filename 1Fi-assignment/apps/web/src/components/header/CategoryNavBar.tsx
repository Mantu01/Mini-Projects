import { categories } from "@/data/mock"

interface CategoryNavBarProps {
  categories: typeof categories
}

export function CategoryNavBar({ categories }: CategoryNavBarProps) {
  return (
    <div className="border-b overflow-x-auto">
      <nav className="flex gap-5 px-4 py-2 min-w-max">
        {categories.map((cat) => (
          <a
            key={cat}
            href="#"
            className="text-xs text-gray-600 hover:text-orange-500 whitespace-nowrap transition-colors"
          >
            {cat}
          </a>
        ))}
      </nav>
    </div>
  )
}
