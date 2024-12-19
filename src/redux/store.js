import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slice/cartSlice";
import productSlice from "./slice/productSlice";

const store = configureStore({
  reducer: {
    cart: cartSlice,
    products: productSlice,
  },
});

export default store;
