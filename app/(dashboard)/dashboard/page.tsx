// app/(dashboard)/dashboard/page.tsx
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Banknote,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function getLastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  }
  return months;
}

function shortMonth(yyyyMM: string): string {
  const [y, m] = yyyyMM.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("default", {
    month: "short",
  });
}

// ── Chart constants ───────────────────────────────────────────────────────────

const AXIS_COLOR = "#94a3b8";
const GRID_COLOR = "#e2e8f0";
const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

// ✅ Defined OUTSIDE components — stable reference, no re-creation on render
const QUERY_OPTIONS = {
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
} as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2">
      {label && (
        <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
      )}
      {payload.map((e: any, i: number) => (
        <p
          key={i}
          className="text-sm font-medium"
          style={{ color: e.color ?? e.stroke }}
        >
          {e.name}: <span className="font-bold">{e.value}</span>
        </p>
      ))}
    </div>
  );
};

const EmptyChart = () => (
  <div className="flex flex-col items-center justify-center h-48 text-slate-300 gap-2">
    <BarChart3 className="w-8 h-8 opacity-40" />
    <span className="text-xs text-slate-400">No data yet</span>
  </div>
);

// ── Admin Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard() {
  const currentMonth = getCurrentMonth();
  const today = getTodayDate();
  const last6 = getLastNMonths(6);

  // ✅ Pass QUERY_OPTIONS to each hook — stable object reference
  const { data: employees, isLoading: empLoad } = useGetEmployeesQuery(
    undefined,
    QUERY_OPTIONS,
  );
  const { data: allAttendance, isLoading: attLoad } = useGetAllAttendanceQuery(
    undefined,
    QUERY_OPTIONS,
  );
  const { data: allPayrolls, isLoading: payLoad } = useGetAllPayrollsQuery(
    currentMonth,
    QUERY_OPTIONS,
  );

  const presentToday =
    allAttendance?.filter((a) => a.date === today).length ?? 0;
  const payrollsThisMonth =
    allPayrolls?.filter((p) => p.month === currentMonth).length ?? 0;
  const pendingPayments =
    allPayrolls?.filter((p) => p.status === "GENERATED").length ?? 0;

  // Bar: attendance per day this month
  const attendanceByDay: Record<string, number> = {};
  allAttendance
    ?.filter((a) => a.date.startsWith(currentMonth))
    .forEach((a) => {
      attendanceByDay[a.date] = (attendanceByDay[a.date] ?? 0) + 1;
    });
  const attendanceDayData = Object.entries(attendanceByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({ name: date.slice(8), count }));

  // Area: payroll payout last 6 months
  const payrollTrendData = last6.map((m) => {
    const total = (allPayrolls?.filter((p) => p.month === m) ?? []).reduce(
      (acc, p) => acc + (p.netSalary ?? 0),
      0,
    );
    return { name: shortMonth(m), total: Math.round(total) };
  });

  // Pie: payroll status
  const statusMap: Record<string, number> = {};
  allPayrolls?.forEach((p) => {
    const k = p.status ?? "UNKNOWN";
    statusMap[k] = (statusMap[k] ?? 0) + 1;
  });
  const pieData = Object.entries(statusMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Welcome back, Admin!</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Employees"
          value={empLoad ? "…" : (employees?.length ?? 0)}
          icon={<Users className="h-4 w-4" />}
        />
        <SummaryCard
          title="Present Today"
          value={attLoad ? "…" : presentToday}
          icon={<UserCheck className="h-4 w-4" />}
        />
        <SummaryCard
          title="Payrolls This Month"
          value={payLoad ? "…" : payrollsThisMonth}
          icon={<Banknote className="h-4 w-4" />}
        />
        <SummaryCard
          title="Pending Payments"
          value={payLoad ? "…" : pendingPayments}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Row 1: attendance bar + payroll pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Daily Attendance — This Month
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Employees present each day
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attLoad ? (
              <Skeleton className="h-48 w-full rounded-lg" />
            ) : attendanceDayData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={attendanceDayData} barCategoryGap="35%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={GRID_COLOR}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: AXIS_COLOR }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: AXIS_COLOR }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(99,102,241,0.06)" }}
                  />
                  <Bar
                    dataKey="count"
                    name="Present"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Payroll Status
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Breakdown by payment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payLoad ? (
              <Skeleton className="h-48 w-full rounded-lg" />
            ) : pieData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="42%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: payroll area */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">
            Total Payroll Payout — Last 6 Months
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Combined net salary disbursed per month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payLoad ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : payrollTrendData.every((d) => d.total === 0) ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={payrollTrendData}>
                <defs>
                  <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={GRID_COLOR}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: AXIS_COLOR }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: AXIS_COLOR }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Net Payout ($)"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#payrollGrad)"
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Employee Dashboard ────────────────────────────────────────────────────────

function EmployeeDashboard() {
  const currentMonth = getCurrentMonth();
  const today = getTodayDate();
  const last6 = getLastNMonths(6);

  // ✅ Pass QUERY_OPTIONS to each hook
  const { data: myAttendance, isLoading: attLoad } = useGetMyAttendanceQuery(
    undefined,
    QUERY_OPTIONS,
  );
  const { data: myPayrolls, isLoading: payLoad } = useGetMyPayrollsQuery(
    undefined,
    QUERY_OPTIONS,
  );

  const checkedInToday = myAttendance?.find((a) => a.date === today);
  const thisMonthPayroll = myPayrolls?.find((p) => p.month === currentMonth);
  const totalOvertimeHours =
    myAttendance
      ?.filter((a) => a.date.startsWith(currentMonth))
      .reduce((acc, a) => acc + (a.overtimeHours ?? 0), 0) ?? 0;

  const checkInStatus = attLoad
    ? "…"
    : checkedInToday
      ? checkedInToday.checkOutTime
        ? "Completed"
        : "Checked In"
      : "Not Checked In";

  // Bar: overtime per day this month
  const overtimeDayData = (myAttendance ?? [])
    .filter(
      (a) => a.date.startsWith(currentMonth) && (a.overtimeHours ?? 0) > 0,
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((a) => ({ name: a.date.slice(8), hours: a.overtimeHours ?? 0 }));

  // Area: salary trend last 6 months
  const salaryTrendData = last6.map((m) => {
    const p = myPayrolls?.find((pay) => pay.month === m);
    return { name: shortMonth(m), salary: p?.netSalary ?? 0 };
  });

  // Pie: normal vs overtime days
  const monthAtt = (myAttendance ?? []).filter((a) =>
    a.date.startsWith(currentMonth),
  );
  const withOT = monthAtt.filter((a) => (a.overtimeHours ?? 0) > 0).length;
  const normal = monthAtt.length - withOT;
  const attPie = [
    { name: "Normal", value: normal },
    { name: "Overtime", value: withOT },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Welcome back!</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <SummaryCard
          title="Check-in Status"
          value={checkInStatus}
          icon={<Clock className="h-4 w-4" />}
        />
        <SummaryCard
          title="This Month Salary"
          value={
            payLoad
              ? "…"
              : thisMonthPayroll
                ? `$${thisMonthPayroll.netSalary.toFixed(2)}`
                : "Not Generated"
          }
          icon={<Banknote className="h-4 w-4" />}
        />
        <SummaryCard
          title="Overtime This Month"
          value={attLoad ? "…" : `${totalOvertimeHours.toFixed(1)} hrs`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Row 1: overtime bar + attendance pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Overtime Hours — This Month
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Daily overtime breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attLoad ? (
              <Skeleton className="h-48 w-full rounded-lg" />
            ) : overtimeDayData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={overtimeDayData} barCategoryGap="35%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={GRID_COLOR}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: AXIS_COLOR }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: AXIS_COLOR }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}h`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(34,197,94,0.06)" }}
                  />
                  <Bar
                    dataKey="hours"
                    name="Overtime (hrs)"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Attendance Type
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Normal vs overtime days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attLoad ? (
              <Skeleton className="h-48 w-full rounded-lg" />
            ) : attPie.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={attPie}
                    cx="50%"
                    cy="42%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#22c55e" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: salary area */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">
            Salary Trend — Last 6 Months
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Your net salary over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payLoad ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : salaryTrendData.every((d) => d.salary === 0) ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={salaryTrendData}>
                <defs>
                  <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={GRID_COLOR}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: AXIS_COLOR }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: AXIS_COLOR }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="salary"
                  name="Net Salary ($)"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#salaryGrad)"
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Page entry ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const role = useAppSelector((s) => s.auth.role);
  const isAdmin = role === "ADMIN";
  return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
}
