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

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeResponse[], void>({
      query: () => '/employees',
      providesTags: ['Employee'],
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
} = employeeApi;