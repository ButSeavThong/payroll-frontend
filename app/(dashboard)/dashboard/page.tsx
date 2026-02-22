"use client";
import { useAppSelector } from "@/src/hooks";
import { useGetEmployeesQuery } from "@/src/feature/employee/employeeApi";
import {
  useGetMyAttendanceQuery,
  useGetAllAttendanceQuery,
} from "@/src/feature/attendance/attendanceApi";
import {
  useGetAllPayrollsQuery,
  useGetMyPayrollsQuery,
} from "@/src/feature/payroll/payrollApi";
import { SummaryCard } from "@/src/components/summary-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Banknote, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Get current month in "yyyy-MM" format e.g. "2024-06"
function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

// Get today's date in "yyyy-MM-dd" format e.g. "2024-06-15"
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export default function DashboardPage() {
  const role = useAppSelector((state) => state.auth.role);
  const isAdmin = role === "ADMIN";
  const currentMonth = getCurrentMonth();
  const today = getTodayDate();

  // ✅ Admin queries — skipped for employees
  const { data: employees, isLoading: employeesLoading } = useGetEmployeesQuery(
    undefined,
    { skip: !isAdmin },
  );

  const { data: allAttendance, isLoading: allAttendanceLoading } =
    useGetAllAttendanceQuery(undefined, { skip: !isAdmin });

  const { data: allPayrolls, isLoading: payrollsLoading } =
    useGetAllPayrollsQuery(currentMonth, { skip: !isAdmin });

  // ✅ Employee queries — skipped for admins
  const { data: myAttendance, isLoading: myAttendanceLoading } =
    useGetMyAttendanceQuery(undefined, { skip: isAdmin });

  const { data: myPayrolls, isLoading: myPayrollsLoading } =
    useGetMyPayrollsQuery(undefined, { skip: isAdmin });

  // ===== ADMIN VIEW =====
  if (isAdmin) {
    // Count employees who have any attendance record today
    const presentToday =
      allAttendance?.filter((a) => a.date === today).length ?? 0;

    const payrollsThisMonth =
      allPayrolls?.filter((p) => p.month === currentMonth).length ?? 0;

    const pendingPayments =
      allPayrolls?.filter((p) => p.status === "GENERATED").length ?? 0;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, Admin!</p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Employees"
            value={employeesLoading ? "..." : (employees?.length ?? 0)}
            icon={<Users className="h-4 w-4" />}
          />
          <SummaryCard
            title="Present Today"
            value={allAttendanceLoading ? "..." : presentToday}
            icon={<UserCheck className="h-4 w-4" />}
          />
          <SummaryCard
            title="Payrolls This Month"
            value={payrollsLoading ? "..." : payrollsThisMonth}
            icon={<Banknote className="h-4 w-4" />}
          />
          <SummaryCard
            title="Pending Payments"
            value={payrollsLoading ? "..." : pendingPayments}
            icon={<Clock className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm">
              Dashboard initialized. Manage employees, attendance, and payroll
              from the sidebar menu.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===== EMPLOYEE VIEW =====

  // Find today's check-in record
  const checkedInToday = myAttendance?.find((a) => a.date === today);

  // Get this month's payroll record
  const thisMonthPayroll = myPayrolls?.find((p) => p.month === currentMonth);

  // ✅ Sum overtime HOURS (not pay) for the month
  const totalOvertimeHoursThisMonth =
    myAttendance
      ?.filter((a) => a.date.startsWith(currentMonth))
      .reduce((acc, a) => acc + (a.overtimeHours ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back!</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Check-in Status Today"
          value={
            myAttendanceLoading
              ? "..."
              : checkedInToday
                ? checkedInToday.checkOutTime
                  ? "Completed"
                  : "Checked In"
                : "Not Checked In"
          }
          icon={<Clock className="h-4 w-4" />}
        />
        <SummaryCard
          title="This Month Salary"
          value={
            myPayrollsLoading
              ? "..."
              : thisMonthPayroll
                ? `$${thisMonthPayroll.netSalary.toFixed(2)}`
                : "Not Generated"
          }
          icon={<Banknote className="h-4 w-4" />}
        />
        <SummaryCard
          title="Overtime Hours This Month"
          value={
            myAttendanceLoading
              ? "..."
              : `${totalOvertimeHoursThisMonth.toFixed(1)} hrs`
          }
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {myAttendanceLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <p className="text-slate-600 text-sm">
              Your dashboard is ready. Check your attendance and payroll from
              the sidebar menu.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
