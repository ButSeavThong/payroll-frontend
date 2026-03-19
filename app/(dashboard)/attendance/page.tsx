"use client";

import { useState } from "react";
import { useAppSelector } from "@/src/hooks";
import {
  useGetMyAttendanceQuery,
  useGetAllAttendanceQuery,
  useCheckInMutation,
  useCheckOutMutation,
} from "@/src/feature/attendance/attendanceApi";
import { LoadingTable } from "@/src/components/loading-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Local helpers (safe, no external dependency) ───────────────────────────

function getTodayDate(): string {
  //  Must use Asia/Phnom_Penh timezone — NOT toISOString() which returns UTC.
  // At 03:07 local time the UTC date is still yesterday, causing todayRecord
  // to never match → hasCheckedIn=false → Check In enabled, Check Out disabled.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Phnom_Penh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()); // returns "yyyy-MM-dd" in local timezone
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Phnom_Penh",
  });
}

function formatTime(dateTimeStr: string | null | undefined): string {
  if (!dateTimeStr) return "-";
  return new Date(dateTimeStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Phnom_Penh",
  });
}

// ─── Derive status from checkInTime / checkOutTime ──────────────────────────
// Your backend AttendanceResponse has NO status field.
// We derive it from the data we actually have.

type AttendanceStatus = "NOT_STARTED" | "CHECKED_IN" | "COMPLETED";

function getAttendanceStatus(record: {
  checkInTime?: string | null;
  checkOutTime?: string | null;
}): AttendanceStatus {
  if (!record.checkInTime) return "NOT_STARTED";
  if (!record.checkOutTime) return "CHECKED_IN";
  return "COMPLETED";
}

function StatusBadge({
  checkInTime,
  checkOutTime,
}: {
  checkInTime?: string | null;
  checkOutTime?: string | null;
}) {
  const status = getAttendanceStatus({ checkInTime, checkOutTime });

  const styles: Record<AttendanceStatus, string> = {
    NOT_STARTED: "bg-slate-100 text-slate-600",
    CHECKED_IN: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  const labels: Record<AttendanceStatus, string> = {
    NOT_STARTED: "Not Started",
    CHECKED_IN: "Checked In",
    COMPLETED: "Completed",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const role = useAppSelector((state) => state.auth.role);
  const isAdmin = role === "ADMIN";
  const today = getTodayDate();

  // Employee queries
  const {
    data: myAttendance,
    isLoading: myAttendanceLoading,
    refetch: refetchMyAttendance,
  } = useGetMyAttendanceQuery(undefined, { skip: isAdmin });

  const [checkIn, { isLoading: checkInLoading }] = useCheckInMutation();
  const [checkOut, { isLoading: checkOutLoading }] = useCheckOutMutation();

  // Admin queries — no filter params (your API takes void)
  const { data: allAttendance, isLoading: allAttendanceLoading } =
    useGetAllAttendanceQuery(undefined, { skip: !isAdmin });

  // ── Admin: optional client-side date filter ──────────────────────────────
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredAttendance = allAttendance?.filter((a) => {
    if (startDate && a.date < startDate) return false;
    if (endDate && a.date > endDate) return false;
    return true;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCheckIn = async () => {
    try {
      // Pass date: null → backend defaults to today
      await checkIn({ date: null }).unwrap();
      toast.success("Checked in successfully!");
      refetchMyAttendance();
    } catch (error: any) {
      toast.error(error?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut().unwrap();
      toast.success("Checked out successfully!");
      refetchMyAttendance();
    } catch (error: any) {
      toast.error(error?.data?.message || "Check-out failed");
    }
  };

  // ── Employee View ─────────────────────────────────────────────────────────

  if (!isAdmin) {
    const todayRecord = myAttendance?.find((a) => a.date === today);

    // Derive button states from actual data fields
    const hasCheckedIn = !!todayRecord?.checkInTime;
    const hasCheckedOut = !!todayRecord?.checkOutTime;
    const isCompleted = hasCheckedIn && hasCheckedOut;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Attendance</h1>
          <p className="text-slate-600 mt-1">
            Track your daily check-in and check-out
          </p>
        </div>

        {/* Today's Status Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Phnom_Penh",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayRecord ? (
              <>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-600">Status</p>
                    <StatusBadge
                      checkInTime={todayRecord.checkInTime}
                      checkOutTime={todayRecord.checkOutTime}
                    />
                  </div>
                  {todayRecord.checkInTime && (
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-slate-600">Check-in Time</p>
                      <p className="text-lg font-semibold">
                        {formatTime(todayRecord.checkInTime)}
                      </p>
                    </div>
                  )}
                  {todayRecord.checkOutTime && (
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-slate-600">Check-out Time</p>
                      <p className="text-lg font-semibold">
                        {formatTime(todayRecord.checkOutTime)}
                      </p>
                    </div>
                  )}
                </div>

                {todayRecord.totalHours != null && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-slate-600">Total Hours</p>
                      <p className="text-lg font-semibold">
                        {todayRecord.totalHours.toFixed(1)}h
                      </p>
                    </div>
                    {(todayRecord.overtimeHours ?? 0) > 0 && (
                      <div className="bg-amber-50 p-3 rounded-md">
                        <p className="text-xs text-slate-600">Overtime Hours</p>
                        <p className="text-lg font-semibold text-amber-600">
                          {todayRecord.overtimeHours!.toFixed(1)}h
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-500 text-sm">
                No attendance record for today yet. Click Check In to start.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleCheckIn}
            disabled={hasCheckedIn || checkInLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {checkInLoading ? "Checking In..." : "Check In"}
          </Button>
          <Button
            onClick={handleCheckOut}
            disabled={!hasCheckedIn || hasCheckedOut || checkOutLoading}
            className="flex-1 bg-red-600 hover:bg-red-700"
            size="lg"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {checkOutLoading ? "Checking Out..." : "Check Out"}
          </Button>
        </div>

        {/* Attendance History Table */}
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
                            (record.overtimeHours ?? 0) > 0
                              ? "bg-amber-50"
                              : "",
                          )}
                        >
                          <TableCell className="font-medium">
                            {formatDate(record.date)}
                          </TableCell>
                          <TableCell>
                            {formatTime(record.checkInTime)}
                          </TableCell>
                          <TableCell>
                            {formatTime(record.checkOutTime)}
                          </TableCell>
                          <TableCell>
                            {record.totalHours != null
                              ? `${record.totalHours.toFixed(1)}h`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {(record.overtimeHours ?? 0) > 0 ? (
                              <span className="font-semibold text-amber-600">
                                {record.overtimeHours!.toFixed(1)}h
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              checkInTime={record.checkInTime}
                              checkOutTime={record.checkOutTime}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-slate-500 py-8"
                        >
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

  // ── Admin View ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Attendance Management
        </h1>
        <p className="text-slate-600 mt-1">
          View all employee attendance records
        </p>
      </div>

      {/* Client-side Date Filter */}
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
            {(startDate || endDate) && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Clear Filter
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            {filteredAttendance?.length ?? 0} record(s) found
          </CardDescription>
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
                    <TableHead>Employee</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance && filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record) => (
                      <TableRow
                        key={record.id}
                        className={cn(
                          (record.overtimeHours ?? 0) > 0 ? "bg-amber-50" : "",
                        )}
                      >
                        <TableCell className="font-medium">
                          {formatDate(record.date)}
                        </TableCell>
                        {/* ✅ Show employeeName not employeeId */}
                        <TableCell>{record.employeeName}</TableCell>
                        <TableCell>{formatTime(record.checkInTime)}</TableCell>
                        <TableCell>{formatTime(record.checkOutTime)}</TableCell>
                        <TableCell>
                          {record.totalHours != null
                            ? `${record.totalHours.toFixed(1)}h`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {(record.overtimeHours ?? 0) > 0 ? (
                            <span className="font-semibold text-amber-600">
                              {record.overtimeHours!.toFixed(1)}h
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            checkInTime={record.checkInTime}
                            checkOutTime={record.checkOutTime}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-slate-500 py-8"
                      >
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
