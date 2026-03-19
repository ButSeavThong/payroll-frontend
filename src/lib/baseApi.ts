// src/lib/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/src/store';
import { clearAuth } from '@/src/feature/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
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

  if (result.error?.status === 401) {
    api.dispatch(clearAuth());
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Employee', 'Attendance', 'Payroll', 'User', 'Leave'],

  // ✅ These 3 lines fix the re-render loop
  keepUnusedDataFor:        60,     // cache data 60s before discarding
  refetchOnFocus:           false,  // don't refetch when window gets focus
  refetchOnReconnect:       false,  // don't refetch on network reconnect
  refetchOnMountOrArgChange: false, // don't refetch every time component mounts

  endpoints: () => ({}),
});