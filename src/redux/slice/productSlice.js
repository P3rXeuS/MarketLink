// productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const loadInitialState = () => {
  try {
    // Coba load data dari localStorage
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
  } catch (error) {
    console.error("Error loading products from localStorage:", error);
  }
  return [];
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState }) => {
    const currentState = getState().products;
    
    // Jika sudah ada products di state, gunakan itu
    if (currentState.items.length > 0) {
      return currentState.items;
    }

    // Jika tidak, coba load dari localStorage
    const savedProducts = loadInitialState();
    if (savedProducts.length > 0) {
      return savedProducts;
    }

    // Jika tidak ada di localStorage, fetch dari API
    const response = await fetch(`${import.meta.env.VITE_API}/products`);
    const data = await response.json();

    const products = data.map((product) => {
      // Cek jika ada data quantity tersimpan untuk produk ini
      const savedProduct = localStorage.getItem(`product_${product.id}`);
      if (savedProduct) {
        const parsedProduct = JSON.parse(savedProduct);
        return {
          ...product,
          quantity: parsedProduct.quantity,
          outOfStock: parsedProduct.outOfStock,
          slug: generateSlug(product.title),
        };
      }
      
      // Jika tidak ada data tersimpan, gunakan nilai default
      return {
        ...product,
        quantity: 20,
        outOfStock: false,
        slug: generateSlug(product.title),
      };
    });

    // Simpan ke localStorage
    localStorage.setItem("products", JSON.stringify(products));
    
    return products;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: loadInitialState(),
    filteredItems: loadInitialState(),
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

        // Update both localStorage entries
        localStorage.setItem(`product_${product.id}`, JSON.stringify(product));
        localStorage.setItem("products", JSON.stringify(state.items));
      }
    },
    increaseStock: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.items.find((prod) => prod.id === id);
      if (product) {
        product.quantity += quantity;
        product.outOfStock = false;
        
        // Update both localStorage entries
        localStorage.setItem(`product_${product.id}`, JSON.stringify(product));
        localStorage.setItem("products", JSON.stringify(state.items));
      }
    },
    markOutOfStock: (state, action) => {
      const id = action.payload;
      const product = state.items.find((prod) => prod.id === id);
      if (product) {
        product.outOfStock = true;
        product.quantity = 0;
        
        // Update both localStorage entries
        localStorage.setItem(`product_${product.id}`, JSON.stringify(product));
        localStorage.setItem("products", JSON.stringify(state.items));
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
        state.status = "failed";
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