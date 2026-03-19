import { baseApi } from "@/src/lib/baseApi";
import build from "next/dist/build";

 
export type LeaveType = 'ANNUAL_LEAVE' | 'SICK_LEAVE' | 'UNPAID_LEAVE';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  status: LeaveStatus;
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface LeaveRequest {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface LeaveReviewRequest {
  status: 'APPROVED' | 'REJECTED';
  adminNote?: string;
}

export interface LeaveBalanceResponse {
  year: number;
  annualLeaveTotal: number;
  annualLeaveUsed: number;
  annualLeaveRemaining: number;
  sickLeaveTotal: number;
  sickLeaveUsed: number;
  sickLeaveRemaining: number;
}

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Employee — submit request
    requestLeave: builder.mutation<LeaveResponse, LeaveRequest>({
      query: (body) => ({ url: '/leaves', method: 'POST', body }),
      invalidatesTags: ['Leave'],
    }),

    // Add endpoint
    getMyLeaveBalance: builder.query<LeaveBalanceResponse, void>({
      query: () => '/leaves/balance',
      providesTags: ['Leave'],
    }),

    // Employee — my leaves
    getMyLeaves: builder.query<LeaveResponse[], void>({
      query: () => '/leaves/my',
      providesTags: ['Leave'],
    }),

    // Admin — all leaves
    getAllLeaves: builder.query<LeaveResponse[], void>({
      query: () => '/leaves',
      providesTags: ['Leave'],
    }),

    // Admin — pending only
    getPendingLeaves: builder.query<LeaveResponse[], void>({
      query: () => '/leaves/pending',
      providesTags: ['Leave'],
    }),

    // Admin — approve / reject
    reviewLeave: builder.mutation<LeaveResponse, { id: number; body: LeaveReviewRequest }>({
      query: ({ id, body }) => ({
        url: `/leaves/${id}/review`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Leave'],
    }),
  }),
});

export const {
  useRequestLeaveMutation,
  useGetMyLeavesQuery,
  useGetAllLeavesQuery,
  useGetPendingLeavesQuery,
  useReviewLeaveMutation,
  useGetMyLeaveBalanceQuery,  
} = leaveApi;