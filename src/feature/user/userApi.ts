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
   isEnabled: boolean;
}



// What we send to POST /auth/register
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;  //  add this — backend requires it
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


      // Add toggle mutation inside injectEndpoints:
  toggleUserStatus: builder.mutation<UserResponse, number>({
    query: (id) => ({
      url: `/users/${id}/toggle-status`,
      method: 'PATCH',
    }),
    invalidatesTags: ['User'],
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

    uploadProfileImage: builder.mutation<UserResponse, FormData>({
  query: (formData) => ({
    url: '/users/profile-image',
    method: 'PATCH',
    body: formData,
    formData: true,
  }),
  //  Invalidate BOTH User and Employee caches
  // so sidebar + profile page both refresh
  invalidatesTags: ['User', 'Employee'],
}),

removeProfileImage: builder.mutation<UserResponse, void>({
  query: () => ({
    url: '/users/profile-image',
    method: 'DELETE',
  }),
  invalidatesTags: ['User', 'Employee'], 
}),

  }),
});

export const { 
  useGetUsersQuery,
   useCreateUserMutation,
   useToggleUserStatusMutation,
    useUploadProfileImageMutation,
    useRemoveProfileImageMutation,
   } = userApi;