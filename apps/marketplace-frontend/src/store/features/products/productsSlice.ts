import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../services/api";
import { type Product } from "../../../types/products";

interface ProductState {
  items: Product[];
  ownItems: Product[];
  allItemsAdmin: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  ownItems: [],
  allItemsAdmin: [],
  isLoading: false,
  error: null,
};

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchParams: URLSearchParams, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Product[]>(`/products/search?${searchParams.toString()}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al buscar productos');
    }
  }
);

export const fetchOwnProducts = createAsyncThunk(
  'products/fetchOwnProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Product[]>('/products/me');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al cargar tus productos');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: { name: string; sku: string; quantity: number; price: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Product>('/products', productData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al crear el producto');
    }
  }
);

export const fetchAllProductsAdmin = createAsyncThunk(
  'products/fetchAllProductsAdmin',
  async (sellerIdFilter?: string, { rejectWithValue }) => {
    try {
      let url = '/admin/products';
      if (sellerIdFilter) {
        url += `?sellerId=${sellerIdFilter}`;
      }
      const response = await apiClient.get<Product[]>(url);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al cargar productos para admin');
    }
  }
);


const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.items = action.payload;
        if (action.payload.length === 0) {
          state.error = "No se encontraron productos con esos criterios.";
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOwnProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.ownItems = action.payload;
      })
      .addCase(fetchOwnProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllProductsAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProductsAdmin.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.allItemsAdmin = action.payload;
        if (action.payload.length === 0) {
          state.error = "No hay productos o no coinciden con el filtro.";
        }
      })
      .addCase(fetchAllProductsAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductsError } = productsSlice.actions;
export default productsSlice.reducer;