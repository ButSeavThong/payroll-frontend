// src/feature/user/userApi.ts
import { baseApi } from '@/src/lib/baseApi';

// Matches your Spring Boot UserProfileResponse exactly
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  gender: string | null;
  dob: string | null;        // LocalDate serialized as "yyyy-MM-dd"
  isDeleted: boolean;
  profileImage: string | null;
}

// What we send to POST /auth/register
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;  // ✅ add this — backend requires it
  dob?: string;
  gender?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/users — admin gets all users
    getUsers: builder.query<UserResponse[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),

    // POST /api/v1/auth/register — admin creates user (default role = EMPLOYEE)
    createUser: builder.mutation<UserResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = userApi;