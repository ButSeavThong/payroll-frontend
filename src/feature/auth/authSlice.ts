// src/feature/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'ADMIN' | 'EMPLOYEE';

interface AuthState {
  token: string | null;
  role: UserRole | null;
  username: string | null;
  isAuthenticated: boolean;
}

// ✅ Read from localStorage on startup — survives refresh
function loadFromStorage(): AuthState {
  try {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('auth_role') as UserRole | null;
    const username = localStorage.getItem('auth_username');

    if (token && role) {
      return { token, role, username, isAuthenticated: true };
    }
  } catch {
    // localStorage not available (SSR)
  }
  return { token: null, role: null, username: null, isAuthenticated: false };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromStorage, // ✅ function reference — RTK calls it once
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; role: UserRole; username: string }>
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.username = action.payload.username;
      state.isAuthenticated = true;

      // ✅ Persist to localStorage
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_role', action.payload.role);
      localStorage.setItem('auth_username', action.payload.username);
    },
    clearAuth: (state) => {
      state.token = null;
      state.role = null;
      state.username = null;
      state.isAuthenticated = false;

      // ✅ Clear from localStorage on logout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('auth_username');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;