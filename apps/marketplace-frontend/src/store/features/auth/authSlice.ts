import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface UserState {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: UserState | null
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      if (decodedToken.exp * 1000 > Date.now()) {
        return {
          token,
          user: { id: decodedToken.sub, email: decodedToken.email, role: decodedToken.role },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error decodificando token al inicio', error)
      localStorage.removeItem('token')
    }
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }
}

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: UserState }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token')
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setUser: (state, action: PayloadAction<UserState | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (!action.payload) {
        state.token = null;
        localStorage.removeItem('token');
      }
    }
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, setUser } = authSlice.actions;
export default authSlice.reducer;