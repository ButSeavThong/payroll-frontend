'use client';

import { useAppSelector } from '@/src/hooks';
import { useGetEmployeesQuery } from '@/src/feature/employee/employeeApi';
import { useGetMyAttendanceQuery } from '@/src/feature/attendance/attendanceApi';
import { useGetPayrollsQuery } from '@/src/feature/payroll/payrollApi';
import { SummaryCard } from '@/src/components/summary-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Banknote, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, getCurrentMonth } from '@/src/lib/utils';

export default function DashboardPage() {
  const role = useAppSelector((state) => state.auth.role);
  const { data: employees, isLoading: employeesLoading } = useGetEmployeesQuery(
    role === 'ADMIN' ? undefined : { skip: true },
    { skip: role !== 'ADMIN' }
  );
  const { data: attendance, isLoading: attendanceLoading } = useGetMyAttendanceQuery();
  const { data: payrolls, isLoading: payrollsLoading } = useGetPayrollsQuery(
    { month: getCurrentMonth() },
    { skip: role !== 'ADMIN' }
  );

  const currentMonth = getCurrentMonth();
  const myPayrolls = payrolls?.filter(
    (p) => p.month === currentMonth
  ) ?? [];

  if (role === 'ADMIN') {
    const presentToday = attendance?.filter(
      (a) => a.date === new Date().toISOString().split('T')[0] && a.status !== 'ABSENT'
    ).length ?? 0;

    const paidPayrolls = payrolls?.filter((p) => p.status === 'PAID').length ?? 0;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, Admin!</p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Employees"
            value={employeesLoading ? '...' : employees?.length ?? 0}
            icon={<Users className="h-4 w-4" />}
          />
          <SummaryCard
            title="Present Today"
            value={presentToday}
            icon={<UserCheck className="h-4 w-4" />}
          />
          <SummaryCard
            title="Payrolls This Month"
            value={payrollsLoading ? '...' : payrolls?.filter((p) => p.month === currentMonth).length ?? 0}
            icon={<Banknote className="h-4 w-4" />}
          />
          <SummaryCard
            title="Pending Payments"
            value={payrollsLoading ? '...' : payrolls?.filter((p) => p.status === 'GENERATED').length ?? 0}
            icon={<Clock className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm">
              Dashboard initialized successfully. Start managing employees, attendance, and payroll from the sidebar menu.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Employee View
  const checkedInToday = attendance?.find(
    (a) => a.date === new Date().toISOString().split('T')[0]
  );

  const thisMonthSalary = myPayrolls[0];

  const totalOvertimeThisMonth = myPayrolls.reduce((acc, p) => acc + p.overtimePay, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back, Employee!</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Check-in Status Today"
          value={checkedInToday ? 'Checked In' : 'Not Checked In'}
          icon={<Clock className="h-4 w-4" />}
        />
        <SummaryCard
          title="This Month Salary"
          value={thisMonthSalary ? `$${thisMonthSalary.netSalary.toFixed(2)}` : '$0.00'}
          icon={<Banknote className="h-4 w-4" />}
        />
        <SummaryCard
          title="Overtime Hours This Month"
          value={totalOvertimeThisMonth.toFixed(1)}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <p className="text-slate-600 text-sm">
              Your dashboard is ready. Check your attendance and payroll details from the sidebar menu.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
