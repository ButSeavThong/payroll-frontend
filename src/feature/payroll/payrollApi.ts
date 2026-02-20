import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName?: string;
  month: string; // yyyy-MM format
  baseSalary: number;
  overtimePay: number;
  tax: number;
  netSalary: number;
  status: 'GENERATED' | 'PAID';
  createdAt?: string;
}

export const payrollApi = createApi({
  reducerPath: 'payrollApi',
  baseQuery,
  tagTypes: ['Payroll'],
  endpoints: (builder) => ({
    getPayrolls: builder.query<Payroll[], { month?: string } | void>({
      query: (params) => ({
        url: '/payroll/all',
        params,
      }),
      providesTags: ['Payroll'],
    }),
    getMyPayroll: builder.query<Payroll[], void>({
      query: () => '/payroll/my',
      providesTags: ['Payroll'],
    }),
    generatePayroll: builder.mutation<
      Payroll[],
      { employeeId?: string; month: string }
    >({
      query: (body) => ({
        url: '/payroll/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payroll'],
    }),
    markPayrollAsPaid: builder.mutation<Payroll, string>({
      query: (id) => ({
        url: `/payroll/${id}/pay`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Payroll'],
    }),
  }),
});

export const {
  useGetPayrollsQuery,
  useGetMyPayrollQuery,
  useGeneratePayrollMutation,
  useMarkPayrollAsPaidMutation,
} = payrollApi;
