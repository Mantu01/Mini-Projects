import { Link, useLocation } from "react-router-dom"
import { categories, slugForCategory } from "@/data/site"

export function CategoryNavBar() {
  const location = useLocation()

  return (
    <div className="border-b border-[#6C28D9]/10 bg-background">
      <nav className="flex gap-5 px-4 py-2 min-w-max overflow-x-auto">
        <Link
          to="/"
          className={`text-xs font-medium whitespace-nowrap border-b-2 pb-0.5 ${
            location.pathname === "/"
              ? "text-[#6C28D9] border-[#6C28D9]"
              : "text-foreground hover:text-[#6C28D9] border-transparent"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => {
          const slug = slugForCategory(cat)
          const isActive = location.pathname === `/c/${slug}`
          return (
            <Link
              key={cat}
              to={`/c/${slug}`}
              className={`text-xs font-medium whitespace-nowrap border-b-2 pb-0.5 transition-colors ${
                isActive
                  ? "text-[#6C28D9] border-[#6C28D9]"
                  : "text-foreground hover:text-[#6C28D9] border-transparent"
              }`}
            >
              {cat}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
