import { baseApi } from '@/src/lib/baseApi';

interface EmployeeResponse {
  id: number;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  baseSalary: number;
  hireDate: string;
  isActive: boolean;
  createdAt: string;
  profileImage: string | null;
}

interface CreateEmployeeRequest {
  userId: number;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  baseSalary: number;
  hireDate: string;
}

interface UpdateEmployeeRequest {
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  baseSalary: number;
}


export interface OnboardEmployeeRequest {
  // User fields
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  gender: string;
  dob: string;

  // Employee fields
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  baseSalary: number;
  hireDate: string;
}

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeResponse[], void>({
      query: () => '/employees',
      providesTags: ['Employee'],
    }),

    onboardEmployee: builder.mutation<EmployeeResponse, OnboardEmployeeRequest>({
      query: (body) => ({
      url: '/employees/onboard',
      method: 'POST',
      body,
    }),
  invalidatesTags: ['Employee'],
}),
    getEmployeeById: builder.query<EmployeeResponse, number>({
      query: (id) => `/employees/${id}`,
      providesTags: ['Employee'],
    }),
    getMyProfile: builder.query<EmployeeResponse, void>({
      query: () => '/employees/me',
      providesTags: ['Employee'],
    }),
    createEmployee: builder.mutation<EmployeeResponse, CreateEmployeeRequest>({
      query: (body) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Employee'],
    }),
    updateEmployee: builder.mutation<EmployeeResponse, { id: number; body: UpdateEmployeeRequest }>({
      query: ({ id, body }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useGetMyProfileQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useOnboardEmployeeMutation,   
} = employeeApi;