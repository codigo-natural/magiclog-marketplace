import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth/authSlice'
import productsReducer from './features/products/productsSlice.ts'
import cartReducer from './features/cart/cartSlice.ts'
import adminUsersReducer from './features/adminUsersSlice.ts'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    adminUsers: adminUsersReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;