import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#" },
  { label: "How it Works", href: "#" },
  { label: "Shop", href: "/c/mobiles" },
  { label: "Calculator", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Partner With Us", href: "#" },
  { label: "FAQs", href: "#" },
]

export function TopUtilityBar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#6C28D9]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="shrink-0">
            <img src="/logo.svg" alt="1Fi" className="h-9 w-9 object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? location.pathname === link.href
                  : location.pathname.startsWith(link.href)
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? "text-[#6C28D9]" : "text-foreground hover:text-[#6C28D9]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5/6 h-0.5 bg-[#6C28D9] rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          <Link to="/c/mobiles">
            <Button className="hidden lg:inline-flex bg-[#6C28D9] text-white rounded-xl px-5 hover:bg-[#6C28D9]/90 transition-colors">
              Shop Now
            </Button>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-foreground hover:text-[#6C28D9] transition-colors rounded-lg"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.href
                    ? "text-[#6C28D9] bg-[#6C28D9]/5"
                    : "text-foreground hover:text-[#6C28D9] hover:bg-[#6C28D9]/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/c/mobiles" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2 bg-[#6C28D9] text-white rounded-xl hover:bg-[#6C28D9]/90 transition-colors">
                Shop Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
