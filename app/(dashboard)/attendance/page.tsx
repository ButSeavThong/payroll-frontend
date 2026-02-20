'use client';

import { useState } from 'react';
import { useAppSelector } from '@/src/hooks';
import { useGetMyAttendanceQuery, useGetAllAttendanceQuery, useCheckInMutation, useCheckOutMutation } from '@/src/feature/attendance/attendanceApi';
import { LoadingTable } from '@/src/components/loading-table';
import { StatusBadge } from '@/src/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { formatDate, calculateTotalHours, calculateOvertimeHours, getDateString } from '@/src/lib/utils';
import { AlertCircle, Clock, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AttendancePage() {
  const role = useAppSelector((state) => state.auth.role);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Employee view
  const { data: myAttendance, isLoading: myAttendanceLoading, refetch: refetchMyAttendance } = useGetMyAttendanceQuery(
    undefined,
    { skip: role !== 'EMPLOYEE' }
  );
  const [checkIn, { isLoading: checkInLoading }] = useCheckInMutation();
  const [checkOut, { isLoading: checkOutLoading }] = useCheckOutMutation();

  // Admin view
  const { data: allAttendance, isLoading: allAttendanceLoading } = useGetAllAttendanceQuery(
    startDate || endDate ? { startDate: startDate || undefined, endDate: endDate || undefined } : undefined,
    { skip: role !== 'ADMIN' }
  );

  const handleCheckIn = async () => {
    try {
      await checkIn().unwrap();
      toast.success('Checked in successfully!');
      refetchMyAttendance();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut().unwrap();
      toast.success('Checked out successfully!');
      refetchMyAttendance();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Check-out failed');
    }
  };

  if (role === 'EMPLOYEE') {
    const todayRecord = myAttendance?.find(
      (a) => a.date === getDateString(new Date())
    );

    const isCheckedIn = todayRecord?.status === 'CHECKED_IN';
    const isCheckedOut = todayRecord?.status === 'CHECKED_OUT' || todayRecord?.status === 'COMPLETED';

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Attendance</h1>
          <p className="text-slate-600 mt-1">Track your daily check-in and check-out</p>
        </div>

        {/* Today's Status Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
            <CardDescription>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayRecord ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-600">Status</p>
                    <p className="text-2xl font-bold">
                      <StatusBadge status={todayRecord.status} />
                    </p>
                  </div>
                  {todayRecord.checkInTime && (
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-slate-600">Check-in Time</p>
                      <p className="text-lg font-semibold">{todayRecord.checkInTime}</p>
                    </div>
                  )}
                  {todayRecord.checkOutTime && (
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-slate-600">Check-out Time</p>
                      <p className="text-lg font-semibold">{todayRecord.checkOutTime}</p>
                    </div>
                  )}
                </div>

                {todayRecord.totalHours && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-slate-600">Total Hours</p>
                      <p className="text-lg font-semibold">{todayRecord.totalHours.toFixed(1)}h</p>
                    </div>
                    {todayRecord.overtimeHours > 0 && (
                      <div className="bg-amber-50 p-3 rounded-md">
                        <p className="text-xs text-slate-600">Overtime Hours</p>
                        <p className="text-lg font-semibold text-amber-600">{todayRecord.overtimeHours.toFixed(1)}h</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-600">No attendance record for today yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleCheckIn}
            disabled={isCheckedIn || isCheckedOut || checkInLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {checkInLoading ? 'Checking In...' : 'Check In'}
          </Button>
          <Button
            onClick={handleCheckOut}
            disabled={!isCheckedIn || checkOutLoading}
            className="flex-1 bg-red-600 hover:bg-red-700"
            size="lg"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {checkOutLoading ? 'Checking Out...' : 'Check Out'}
          </Button>
        </div>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Your recent attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            {myAttendanceLoading ? (
              <LoadingTable columns={6} rows={5} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myAttendance && myAttendance.length > 0 ? (
                      myAttendance.map((record) => (
                        <TableRow
                          key={record.id}
                          className={cn(
                            record.overtimeHours && record.overtimeHours > 0 ? 'bg-amber-50' : ''
                          )}
                        >
                          <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                          <TableCell>{record.checkInTime || '-'}</TableCell>
                          <TableCell>{record.checkOutTime || '-'}</TableCell>
                          <TableCell>{record.totalHours?.toFixed(1) || '-'}h</TableCell>
                          <TableCell>
                            {record.overtimeHours && record.overtimeHours > 0 ? (
                              <span className="font-semibold text-amber-600">{record.overtimeHours.toFixed(1)}h</span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={record.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                          No attendance records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Attendance Management</h1>
        <p className="text-slate-600 mt-1">View all employee attendance records</p>
      </div>

      {/* Date Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-slate-600">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-slate-600">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>All employee attendance in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {allAttendanceLoading ? (
            <LoadingTable columns={7} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAttendance && allAttendance.length > 0 ? (
                    allAttendance.map((record) => (
                      <TableRow
                        key={record.id}
                        className={cn(
                          record.overtimeHours && record.overtimeHours > 0 ? 'bg-amber-50' : ''
                        )}
                      >
                        <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                        <TableCell className="font-mono text-xs">{record.employeeId}</TableCell>
                        <TableCell>{record.checkInTime || '-'}</TableCell>
                        <TableCell>{record.checkOutTime || '-'}</TableCell>
                        <TableCell>{record.totalHours?.toFixed(1) || '-'}h</TableCell>
                        <TableCell>
                          {record.overtimeHours && record.overtimeHours > 0 ? (
                            <span className="font-semibold text-amber-600">{record.overtimeHours.toFixed(1)}h</span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={record.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                        No attendance records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
