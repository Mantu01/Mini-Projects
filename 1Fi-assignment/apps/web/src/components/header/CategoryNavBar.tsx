import { Link, useLocation } from "react-router-dom"
import { useCategoriesContext } from "@/context/CategoriesContext"

export function CategoryNavBar() {
  const location = useLocation()
  const { categories } = useCategoriesContext()

  return (
    <div className="border-b border-accent-purple/10 bg-background">
      <nav className="flex gap-5 px-4 py-2 min-w-max overflow-x-auto scrollbar-hide">
        <Link
          to="/"
          className={`text-xs font-medium whitespace-nowrap border-b-2 pb-0.5 transition-colors ${
            location.pathname === "/"
              ? "text-accent-purple border-accent-purple"
              : "text-foreground hover:text-accent-purple border-transparent"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => {
          const isActive = location.pathname === `/c/${cat.slug}`
          return (
            <Link
              key={cat.id}
              to={`/c/${cat.slug}`}
              className={`text-xs font-medium whitespace-nowrap border-b-2 pb-0.5 transition-colors ${
                isActive
                  ? "text-accent-purple border-accent-purple"
                  : "text-foreground hover:text-accent-purple border-transparent"
              }`}
            >
              {cat.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
