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

export interface Employee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  baseSalary: number;
  hireDate: string;
  isActive: boolean;
  createdAt?: string;
}

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery,
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => '/employees',
      providesTags: ['Employee'],
    }),
    getEmployee: builder.query<Employee, string>({
      query: (id) => `/employees/${id}`,
      providesTags: (result) => (result ? [{ type: 'Employee', id: result.id }] : []),
    }),
    getMyEmployee: builder.query<Employee, void>({
      query: () => '/employees/me',
      providesTags: ['Employee'],
    }),
    createEmployee: builder.mutation<
      Employee,
      {
        userId: string;
        firstName: string;
        lastName: string;
        department: string;
        position: string;
        baseSalary: number;
        hireDate: string;
      }
    >({
      query: (body) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Employee'],
    }),
    updateEmployee: builder.mutation<
      Employee,
      { id: string; data: Partial<Omit<Employee, 'id' | 'userId' | 'createdAt'>> }
    >({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Employee', id: result.id }] : []),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useGetMyEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} = employeeApi;
