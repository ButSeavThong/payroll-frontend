import { baseApi } from '@/src/lib/baseApi';

// Add unpaidLeaveDeduction and unpaidLeaveDays to PayrollResponse interface
export interface PayrollResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  baseSalary: number;
  overtimePay: number;
  unpaidLeaveDeduction: number;  
  unpaidLeaveDays: number;      
  tax: number;
  netSalary: number;
  status: 'GENERATED' | 'PAID';
}

interface GeneratePayrollRequest {
  employeeId: number | null;
  month: string;
}

export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generatePayroll: builder.mutation<PayrollResponse[], GeneratePayrollRequest>({
      query: (body) => ({
        url: '/payrolls/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payroll'],
    }),
    getAllPayrolls: builder.query<PayrollResponse[], string | void>({
      query: (month) => ({
        url: '/payrolls',
        params: month ? { month } : {},
      }),
      providesTags: ['Payroll'],
    }),
    markAsPaid: builder.mutation<PayrollResponse, number>({
      query: (id) => ({
        url: `/payrolls/${id}/pay`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Payroll'],
    }),
    getMyPayrolls: builder.query<PayrollResponse[], void>({
      query: () => '/payrolls/my',
      providesTags: ['Payroll'],
    }),
  }),
});

export const {
  useGeneratePayrollMutation,
  useGetAllPayrollsQuery,
  useMarkAsPaidMutation,
  useGetMyPayrollsQuery,
} = payrollApi;