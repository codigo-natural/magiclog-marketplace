import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import axios, { AxiosError } from 'axios';

interface BackendError {
  message: string | string[];
}

export interface Seller {
  id: string;
  email: string;
}

interface AdminUsersState {
  sellers: Seller[];
  isLoadingSellers: boolean;
  sellersError: string | null;
}

const initialState: AdminUsersState = {
  sellers: [],
  isLoadingSellers: false,
  sellersError: null,
};

export const fetchAllSellersForAdmin = createAsyncThunk<
  Seller[],
  void,
  { rejectValue: string }
>(
  'adminUsers/fetchAllSellers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Seller[]>('/admin/sellers'); // Asumiendo este endpoint
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<BackendError>;
        if (serverError?.response?.data?.message) {
          const message = serverError.response.data.message;
          return rejectWithValue(Array.isArray(message) ? message.join('. ') : message);
        }
      }
      return rejectWithValue('Error al cargar la lista de vendedores.');
    }
  }
);

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearSellersError: (state) => {
      state.sellersError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSellersForAdmin.pending, (state) => {
        state.isLoadingSellers = true;
        state.sellersError = null;
      })
      .addCase(fetchAllSellersForAdmin.fulfilled, (state, action: PayloadAction<Seller[]>) => {
        state.isLoadingSellers = false;
        state.sellers = action.payload;
      })
      .addCase(fetchAllSellersForAdmin.rejected, (state, action) => {
        state.isLoadingSellers = false;
        if (action.payload) {
          state.sellersError = action.payload;
        } else if (action.error.message) {
          state.sellersError = action.error.message;
        } else {
          state.sellersError = "Error desconocido al cargar vendedores."
        }
      });
  },
});

export const { clearSellersError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;