import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Product } from "../../../types/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        if (existingItem.quantity < product.quantity) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({
          product,
          quantity: 1,
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);

      if (item) {
        item.quantity = Math.min(quantity, item.product.quantity);

        if (item.quantity <= 0) {
          state.items = state.items.filter(item => item.product.id !== productId);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    /*toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },*/
    closeCart: (state) => {
      state.isOpen = false;
    },
    openCart: (state) => {
      state.isOpen = true;
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  closeCart,
  openCart
} = cartSlice.actions;
export default cartSlice.reducer;