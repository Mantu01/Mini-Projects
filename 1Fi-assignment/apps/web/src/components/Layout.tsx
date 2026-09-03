import { Outlet } from "react-router-dom"
import { TopUtilityBar } from "./header/TopUtilityBar"
import { CategoryNavBar } from "./header/CategoryNavBar"
import { MegaFooter } from "./footer/MegaFooter"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopUtilityBar />
      <CategoryNavBar />
      <main className="flex-1">{children}</main>
      <MegaFooter />
    </div>
  )
}
