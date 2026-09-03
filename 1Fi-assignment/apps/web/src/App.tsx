import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProductsPage } from "./pages/ProductsPage"
import { ProductDetailPage } from "./pages/ProductDetailPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
