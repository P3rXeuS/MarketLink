import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slice/productSlice";
import { Link, useNavigate } from "react-router-dom";

const HomePage = ({ selectedCategory, searchQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      const savedProducts = JSON.parse(localStorage.getItem("products"));
      if (savedProducts && savedProducts.length > 0) {
        dispatch(fetchProducts(savedProducts));  // Dispatch dengan produk yang ada di localStorage
      } else {
        dispatch(fetchProducts());  // Jika tidak ada, ambil dari API
      }
    }
  }, [status, dispatch]);

  const filteredProducts = items.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  if (status === "loading") return <p>Loading products...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4 sm:px-8 max-w-6xl mx-auto">
        {filteredProducts.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain"
            />
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-800 truncate">
                {product.title}
              </h2>
              <p className="text-lg font-bold text-gray-900">
                ${product.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">{product.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
