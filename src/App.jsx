import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { fetchProducts } from "./redux/slice/productSlice"; // Import Redux action

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products"));
    if (storedProducts) {
      dispatch({ type: 'products/fetchProducts/fulfilled', payload: storedProducts });
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch]);  

  // Fungsi untuk menyimpan produk ke localStorage setelah stok berubah
  const saveProductsToLocalStorage = (products) => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  return (
    <Router>
      <Header 
        onSelectCategory={setSelectedCategory} 
        onSearch={setSearchQuery} 
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              selectedCategory={selectedCategory} 
              searchQuery={searchQuery} 
              saveProductsToLocalStorage={saveProductsToLocalStorage} // Pass function to HomePage
            />
          } 
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
