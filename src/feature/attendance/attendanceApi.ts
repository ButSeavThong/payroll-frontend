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

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: number;
  overtimeHours?: number;
  status: 'CHECKED_IN' | 'CHECKED_OUT' | 'COMPLETED' | 'ABSENT';
  createdAt?: string;
}

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery,
  tagTypes: ['Attendance'],
  endpoints: (builder) => ({
    getMyAttendance: builder.query<AttendanceRecord[], void>({
      query: () => '/attendance/my',
      providesTags: ['Attendance'],
    }),
    getAllAttendance: builder.query<AttendanceRecord[], { startDate?: string; endDate?: string } | void>({
      query: (params) => ({
        url: '/attendance/all',
        params,
      }),
      providesTags: ['Attendance'],
    }),
    checkIn: builder.mutation<AttendanceRecord, void>({
      query: () => ({
        url: '/attendance/check-in',
        method: 'POST',
      }),
      invalidatesTags: ['Attendance'],
    }),
    checkOut: builder.mutation<AttendanceRecord, void>({
      query: () => ({
        url: '/attendance/check-out',
        method: 'POST',
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetMyAttendanceQuery,
  useGetAllAttendanceQuery,
  useCheckInMutation,
  useCheckOutMutation,
} = attendanceApi;
