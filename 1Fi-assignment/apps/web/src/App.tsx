import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { HomePage } from "./pages/HomePage"
import { CategoryPage } from "./pages/CategoryPage"
import { ProductDetailPage } from "./pages/ProductDetailPage"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/c/:categorySlug" element={<CategoryPage />} />
          <Route path="/p/:categorySlug/:productSlug" element={<ProductDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
