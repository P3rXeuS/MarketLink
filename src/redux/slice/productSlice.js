import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch(`${import.meta.env.VITE_API}/products`);
    const data = await response.json();

    const products = data.map((product) => ({
      ...product,
      quantity: 20,
      outOfStock: false,
      slug: generateSlug(product.title),
    }));

    // Simpan produk ke localStorage
    localStorage.setItem("products", JSON.stringify(products));

    return products;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    filteredItems: [],
    status: "idle",
    error: null,
    searchTerm: "",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredItems = state.items.filter((product) =>
        product.title.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    },
    reduceStock: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.items.find((prod) => prod.id === id);
      if (product) {
        product.quantity = Math.max(0, product.quantity - quantity);
        product.outOfStock = product.quantity === 0;
  
        // Simpan produk yang telah diperbarui ke localStorage
        localStorage.setItem(`product_${product.id}`, JSON.stringify(product));
      }
    },
    increaseStock: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.items.find((prod) => prod.id === id);
      if (product) {
        product.quantity += quantity;
        product.outOfStock = false;
      }
    },
    markOutOfStock: (state, action) => {
      const id = action.payload;
      const product = state.items.find((prod) => prod.id === id);
      if (product) {
        product.outOfStock = true;
        product.quantity = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"; // Fetch gagal
        state.error = action.error.message;
      });
  },
});

export const {
  setSearchTerm,
  reduceStock,
  increaseStock,
  markOutOfStock,
} = productSlice.actions;

export default productSlice.reducer;
