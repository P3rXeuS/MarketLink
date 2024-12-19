import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reduceStock } from "../redux/slice/productSlice";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { CiTrash } from "react-icons/ci";
import CartSummary from "../components/CartSummary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CartPage = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [cartItems, setCartItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const products = useSelector((state) => state.products.items);

  useEffect(() => {
    if (token) {
      const savedCart = JSON.parse(localStorage.getItem(`cart_${token}`)) || [];
      setCartItems(savedCart);
      // console.log("Loaded Cart from localStorage:", savedCart);
    }
  }, [token]);
  
  useEffect(() => {
    if (cartItems.length > 0 && token) {
      localStorage.setItem(`cart_${token}`, JSON.stringify(cartItems));
    }
  }, [cartItems, token]);
  
  const handleIncrease = (id) => {
    const item = cartItems.find((item) => item.id === id);
    const product = products.find((prod) => prod.id === id);
  
    if (item && product && item.quantity < product.quantity) {
      const updatedCartItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCartItems);
      toast.info("Quantity increased!");
    } else {
      toast.error("Insufficient stock!");
    }
  };  
  
  const handleDecrease = (id) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCartItems);
    toast.info("Quantity decreased!");
  };
  
  const handleDelete = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
  
    // Remove the item from selectedItems if it exists
    const updatedSelectedItems = new Set(selectedItems);
    if (updatedSelectedItems.has(id)) {
      updatedSelectedItems.delete(id);
    }
    setSelectedItems(updatedSelectedItems);
  
    // Update the localStorage with the new cart data
    if (token) {
      localStorage.setItem(`cart_${token}`, JSON.stringify(updatedCartItems));
    }
  
    // Show toast notification even if the cart becomes empty
    toast.warn("Item removed from cart!");
  };  

  const handleSelectAll = () => {
    setSelectAll((prev) => !prev);
    if (!selectAll) {
      const allIds = cartItems.map((item) => item.id);
      setSelectedItems(new Set(allIds));
      // console.log("Selected All Items:", allIds);
    } else {
      setSelectedItems(new Set());
      // console.log("Deselected All Items");
    }
  };

  const handleSelectItem = (id) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
    // console.log("Updated Selected Items:", newSelectedItems);
  };

  const handleBuy = () => {
    if (selectedItems.size === 0) {
      toast.error("No items selected!", { toastId: "error_no_items" });
      return;
    }
    
    let purchaseSuccess = false;
  
    const updatedProducts = products.map((prod) => {
      const cartItem = cartItems.find((item) => item.id === prod.id);
      if (cartItem && selectedItems.has(prod.id)) {

        if (prod.quantity < cartItem.quantity) {
          toast.error(`Insufficient stock for: ${cartItem.title}`, { toastId: prod.id });
          return prod;
        }

        const newStock = prod.quantity - cartItem.quantity;
        localStorage.setItem(`product_${prod.id}`, JSON.stringify({ ...prod, quantity: newStock }));
        dispatch(reduceStock({ id: prod.id, quantity: cartItem.quantity }));
        purchaseSuccess = true;
  
        return { ...prod, quantity: newStock };
      }
      return prod;
    });
  
    const remainingCartItems = cartItems.filter((item) => !selectedItems.has(item.id));
    setCartItems([...remainingCartItems]); // Buat array baru
    localStorage.setItem(`cart_${token}`, JSON.stringify(remainingCartItems));
    setSelectedItems(new Set());
    setSelectAll(false);

    if (purchaseSuccess) {
      toast.success("Purchase successful!", { toastId: null });
    }
  };
  
  const total = cartItems
    .filter((item) => selectedItems.has(item.id))
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cartItems.length === 0) {
      return (
        <div className="bg-gray-100 min-h-screen py-8">
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
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white p-6 rounded-lg shadow">
              <h1 className="text-xl font-bold mb-4">Shopping Cart</h1>
              <div className="border-b pb-4 mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  disabled={cartItems.length === 0}
                />
                <span className="text-gray-600">Select All (0)</span>
              </div>
              <div className="flex justify-center items-center flex-col">
                <h2 className="text-lg font-semibold text-gray-600 mb-2">Wow, your shopping cart is empty</h2>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Start Shopping
                </button>
              </div>
            </div>

            <CartSummary
              total={0}
              handleBuy={handleBuy}
              selectedItems={new Set()}
            />
          </div>
        </div>
      );
    }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
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
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          <h1 className="text-xl font-bold mb-4">Shopping Cart</h1>
          <div className="border-b pb-4 mb-4 flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <span className="text-gray-600">Select All ({cartItems.length})</span>
          </div>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-start justify-between py-4 border-b gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="mr-2"
                />
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.title || "Produk"}
                  className="w-20 h-20 rounded-md border object-contain"
                />
                <div>
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  <p className="text-base font-bold text-gray-800">
                    ${item.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-base font-bold text-gray-800">
                    Available stock: {
                      products.find((prod) => prod.id === item.id)?.quantity ?? "Not available"
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-7 mr-4">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                >
                  <CiTrash />
                </button>
                <button
                  onClick={() => handleDecrease(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  <FaMinus />
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          ))}
        </div>
        <CartSummary
          total={total}
          handleBuy={handleBuy}
          selectedItems={selectedItems}
        />
      </div>
    </div>
  );
};

export default CartPage;
