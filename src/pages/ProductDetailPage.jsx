import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slice/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loginError, setLoginError] = useState("");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  // console.log("Token:", token);
  // console.log("Dispatch:", dispatch);

  const products = useSelector((state) => state.products.items);
  // console.log("Products from Redux store:", products);

  const productFromStore = products.find((prod) => prod.id.toString() === id);
  // console.log("Product from Redux store:", productFromStore);

  useEffect(() => {
    if (productFromStore) {
      setProduct(productFromStore);
      // console.log("Loaded product from Redux:", productFromStore);
    } else {
      const fetchProduct = async () => {
        const response = await fetch(`${import.meta.env.VITE_API}/products/${id}`);
        const data = await response.json();
        setProduct({ ...data, quantity: 20 });
        // console.log("Fetched product from API:", data);
      };
      fetchProduct();
    }
  }, [id, productFromStore]);

  const handleIncrease = () => {
    // console.log("Current quantity before increase:", quantity);
    if (product && quantity < product.quantity) {
      setQuantity((prev) => prev + 1);
      // console.log("Increased quantity:", quantity + 1);
    } else {
      toast.error("Insufficient stock!");
    }
  };

  const handleDecrease = () => {
    // console.log("Current quantity before decrease:", quantity);
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      // console.log("Decreased quantity:", quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please log in to add products to cart.");
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem(`cart_${token}`)) || [];
    console.log("Current cart:", savedCart);

    const existingItemIndex = savedCart.findIndex((item) => item.id === product.id);
    console.log("Existing item index in cart:", existingItemIndex);
  
    let currentCartQuantity = 0;

    if (existingItemIndex >= 0) {
      currentCartQuantity = savedCart[existingItemIndex].quantity;
      console.log(
        `Current quantity of product (ID: ${product.id}) in cart: ${currentCartQuantity}`
      );
    }

    const newQuantity = currentCartQuantity + quantity;
    console.log("Requested quantity to add:", quantity);
    console.log("New total quantity:", newQuantity);

    if (newQuantity > product.quantity) {
      console.log(
        `Cannot add product. Requested quantity (${newQuantity}) exceeds stock (${product.quantity}).`
      );
      toast.error("The quantity to be added exceeds the available stock!");
      return;
    }

    if (existingItemIndex >= 0) {
      savedCart[existingItemIndex].quantity = newQuantity;
      console.log(
        `Updated product (ID: ${product.id}) in cart. New quantity: ${newQuantity}`
      );
    } else {
      savedCart.push({
        id: product.id,
        title: product.title,
        quantity: quantity,
        price: product.price,
        image: product.image,
      });
      console.log(
        `Added new product to cart:`,
        { id: product.id, title: product.title, quantity: quantity }
      );
    }

    localStorage.setItem(`cart_${token}`, JSON.stringify(savedCart));
    console.log("Updated cart saved to localStorage:", savedCart);
    
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        quantity: quantity,
        price: product.price,
        image: product.image,
      })
    );
  
    toast.success(`Successfully added ${quantity} product(s) to cart.`);
  };  

  if (!product) return <p>Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-6">
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <div className="max-w-5xl mx-auto">
        {loginError && (
          <div className="text-red-500 text-center mb-4">{loginError}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-center items-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 object-contain rounded-md"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
              <span className="text-yellow-500 mr-1">★</span>
              {product.rating?.rate || "N/A"} | {product.rating?.count || 0} Sold
            </p>
            <p className="text-3xl font-bold text-gray-800 mb-4">
              ${product.price.toLocaleString()}
            </p>

            <div className="mt-6">
              <p className="mt-4 text-gray-800">{product.description}</p>
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={handleDecrease}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                +
              </button>
              <span className="ml-4 text-sm text-gray-500">
                Stock: {product.quantity}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 px-6 py-2 bg-[#FF6500] text-white rounded-lg w-full hover:bg-[#E55C00]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
