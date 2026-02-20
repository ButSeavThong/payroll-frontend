import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'ADMIN' | 'EMPLOYEE';

interface AuthState {
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; role: UserRole }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
