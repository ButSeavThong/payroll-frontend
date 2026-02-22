import { baseApi } from '@/src/lib/baseApi';

interface AttendanceResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  totalHours: number;
  overtimeHours: number;
}

interface CheckInRequest {
  date: string | null;
}

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkIn: builder.mutation<AttendanceResponse, CheckInRequest>({
      query: (body) => ({
        url: '/attendances/check-in',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),
    checkOut: builder.mutation<AttendanceResponse, void>({
      query: () => ({
        url: '/attendances/check-out',
        method: 'POST',
      }),
      invalidatesTags: ['Attendance'],
    }),
    getMyAttendance: builder.query<AttendanceResponse[], void>({
      query: () => '/attendances/my',
      providesTags: ['Attendance'],
    }),
    getAllAttendance: builder.query<AttendanceResponse[], void>({
      query: () => '/attendances',
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useGetMyAttendanceQuery,
  useGetAllAttendanceQuery,
} = attendanceApi;