import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: { id: string; email: string; role: string } | null;
  isAutenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'), // Cargar token al inicio
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => { // ! tipar mejor
      state.isLoading = false;
      state.isAutenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user; // Necesitamos decodificar el token o que el backend envie info del user
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      localStorage.removeItem('token')
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAutenticated = false;
      localStorage.removeItem('token');
    },
    // ? RegisterRequest, registerSucces, registerFailures
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;