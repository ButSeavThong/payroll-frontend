// src/lib/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/src/store';
import { clearAuth } from '@/src/feature/auth/authSlice';

const baseQuery = fetchBaseQuery({
  // ✅ Points to your real Spring Boot backend
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://hr-payroll-backend-l6pk.onrender.com/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  // Auto logout on 401 Unauthorized
  if (result.error?.status === 401) {
    api.dispatch(clearAuth());
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return result;
};

// Single shared API — all features inject into this
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Employee', 'Attendance', 'Payroll', 'User'],
  endpoints: () => ({}), // empty — each feature injects their own
});