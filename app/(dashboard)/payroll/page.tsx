// app/(dashboard)/payroll/page.tsx
"use client";

import { useState } from "react";
import { useAppSelector } from "@/src/hooks";
import {
  useGetAllPayrollsQuery,
  useGetMyPayrollsQuery,
  useGeneratePayrollMutation,
  useMarkAsPaidMutation,
} from "@/src/feature/payroll/payrollApi";
import { GeneratePayrollModal } from "@/src/components/generate-payroll-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import {
  exportAdminPayrollToExcel,
  exportAdminPayrollToPdf,
  exportEmployeePayslipToExcel,
  exportEmployeePayslipToPdf,
  type PayrollRecord as ExportPayrollRecord,
} from "@/src/lib/exportUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  baseSalary: number;
  overtimePay: number;
  unpaidLeaveDeduction: number;
  unpaidLeaveDays: number;
  tax: number;
  netSalary: number;
  status: "GENERATED" | "PAID";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function usd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function PayrollStatusBadge({ status }: { status: "GENERATED" | "PAID" }) {
  return status === "PAID" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
      <CheckCircle size={10} /> PAID
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
      <Clock size={10} /> GENERATED
    </span>
  );
}

// ─── Salary Breakdown ─────────────────────────────────────────────────────────

function SalaryBreakdown({ record }: { record: PayrollRecord }) {
  const dailyRate = (record.baseSalary / 160) * 8;
  const gross =
    record.baseSalary + record.overtimePay - record.unpaidLeaveDeduction;
  const hasOvertime = record.overtimePay > 0;
  const hasUnpaid = record.unpaidLeaveDays > 0;

  return (
    <div className="bg-slate-50 border-t border-slate-200 px-6 py-5">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          Salary Breakdown — {record.month}
        </p>

        <div className="space-y-1">
          {/* Base Salary */}
          <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  Base Salary
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  160 hrs/month · {usd(dailyRate)}/day ·{" "}
                  {usd(record.baseSalary / 160)}/hr
                </p>
              </div>
            </div>
            <span className="font-semibold text-slate-900 tabular-nums">
              {usd(record.baseSalary)}
            </span>
          </div>

          {/* Overtime */}
          <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${hasOvertime ? "bg-emerald-400" : "bg-slate-200"}`}
              />
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  Overtime Pay
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {hasOvertime
                    ? `Hourly rate × overtime hours × 1.5`
                    : "No overtime this month"}
                </p>
              </div>
            </div>
            <span
              className={`font-semibold tabular-nums ${hasOvertime ? "text-emerald-600" : "text-slate-300"}`}
            >
              {hasOvertime ? `+${usd(record.overtimePay)}` : "—"}
            </span>
          </div>

          {/* Unpaid Leave Deduction */}
          <div
            className={`flex items-center justify-between py-2.5 border-b border-slate-200 rounded-lg px-2 -mx-2 transition-colors ${hasUnpaid ? "bg-red-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${hasUnpaid ? "bg-red-400" : "bg-slate-200"}`}
              />
              <div>
                <p
                  className={`text-sm font-medium ${hasUnpaid ? "text-red-700" : "text-slate-700"}`}
                >
                  Unpaid Leave Deduction
                </p>
                {hasUnpaid ? (
                  <p className="text-xs text-red-400 mt-0.5">
                    {record.unpaidLeaveDays} working day(s) × {usd(dailyRate)}
                    /day
                    <span className="ml-1.5 font-semibold">
                      = {usd(record.unpaidLeaveDeduction)} deducted
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">
                    No unpaid leave this month
                  </p>
                )}
              </div>
            </div>
            <span
              className={`font-semibold tabular-nums ${hasUnpaid ? "text-red-600" : "text-slate-300"}`}
            >
              {hasUnpaid ? `-${usd(record.unpaidLeaveDeduction)}` : "—"}
            </span>
          </div>

          {/* Gross */}
          <div className="flex items-center justify-between py-2.5 border-b-2 border-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Gross Salary
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Base {hasOvertime ? "+ overtime" : ""}{" "}
                  {hasUnpaid ? "− unpaid leave" : ""}
                </p>
              </div>
            </div>
            <span className="font-bold text-slate-900 tabular-nums">
              {usd(gross)}
            </span>
          </div>

          {/* Tax */}
          <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-700 font-medium">Income Tax</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  10% of gross ({usd(gross)} × 10%)
                </p>
              </div>
            </div>
            <span className="font-semibold text-orange-600 tabular-nums">
              -{usd(record.tax)}
            </span>
          </div>

          {/* Net Salary */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
              <p className="text-base font-bold text-slate-900">Net Salary</p>
            </div>
            <span className="text-2xl font-bold text-emerald-600 tabular-nums">
              {usd(record.netSalary)}
            </span>
          </div>
        </div>

        {/* Formula bar */}
        <div className="mt-5 bg-slate-900 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Formula
          </p>
          <p className="text-xs font-mono text-white/60 leading-relaxed">
            <span className="text-blue-400">{usd(record.baseSalary)}</span>
            {hasOvertime && (
              <span>
                {" "}
                +{" "}
                <span className="text-emerald-400">
                  +{usd(record.overtimePay)}
                </span>
              </span>
            )}
            {hasUnpaid && (
              <span>
                {" "}
                −{" "}
                <span className="text-red-400">
                  {usd(record.unpaidLeaveDeduction)}
                </span>
              </span>
            )}
            <span className="text-white/40"> = </span>
            <span className="text-white/80">{usd(gross)} gross</span>
            <span className="text-white/40"> → </span>
            <span>
              − <span className="text-orange-400">{usd(record.tax)}</span> tax
            </span>
            <span className="text-white/40"> = </span>
            <span className="text-emerald-400 font-bold">
              {usd(record.netSalary)}
            </span>
          </p>
          {hasUnpaid && (
            <p className="text-xs font-mono text-red-400/80 mt-1.5 border-t border-white/10 pt-1.5">
              Unpaid rate: {usd(record.baseSalary)} ÷ 160h × 8h ={" "}
              {usd(dailyRate)}/day × {record.unpaidLeaveDays} day(s) ={" "}
              <span className="font-bold">
                {usd(record.unpaidLeaveDeduction)}
              </span>{" "}
              deducted
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PayrollPage() {
  const role = useAppSelector((s) => s.auth.role);
  const isAdmin = role === "ADMIN";

  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [loadingPay, setLoadingPay] = useState<number | null>(null);

  const { data: allPayrolls, isLoading: allLoading } = useGetAllPayrollsQuery(
    selectedMonth,
    { skip: !isAdmin },
  );
  const { data: myPayrolls, isLoading: myLoading } = useGetMyPayrollsQuery(
    undefined,
    { skip: isAdmin },
  );

  const [markAsPaid] = useMarkAsPaidMutation();

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleMarkPaid = async (id: number) => {
    setLoadingPay(id);
    try {
      await markAsPaid(id).unwrap();
      toast.success("Payroll marked as paid!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to mark as paid");
    } finally {
      setLoadingPay(null);
    }
  };

  // ── Stat counts (admin) ───────────────────────────────────────────────────
  const totalGenerated = allPayrolls?.length ?? 0;
  const totalPaid = allPayrolls?.filter((p) => p.status === "PAID").length ?? 0;
  const totalPending =
    allPayrolls?.filter((p) => p.status === "GENERATED").length ?? 0;
  const totalNet = allPayrolls?.reduce((s, p) => s + p.netSalary, 0) ?? 0;

  // ── Employee name (from my payrolls data) ────────────────────────────────
  const myName = myPayrolls?.[0]?.employeeName ?? "Employee";

  // ── EMPLOYEE VIEW ─────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Payroll</h1>
          <p className="text-slate-500 text-sm mt-1">
            View your monthly salary breakdown and payment history
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <CardTitle>Payroll History</CardTitle>
                <CardDescription>
                  Click any row to see full salary breakdown
                </CardDescription>
              </div>
              {/* ✅ Employee export buttons */}
              {myPayrolls && myPayrolls.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={() =>
                      exportEmployeePayslipToExcel(
                        myPayrolls as ExportPayrollRecord[],
                        myName,
                      )
                    }
                  >
                    <FileSpreadsheet size={13} />
                    Export Excel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {myLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-slate-100 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : myPayrolls && myPayrolls.length > 0 ? (
              <div>
                {myPayrolls.map((record) => (
                  <div
                    key={record.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    {/* Row */}
                    <div
                      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => toggleRow(record.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {record.month}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <PayrollStatusBadge status={record.status} />
                            {record.unpaidLeaveDays > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-medium">
                                <AlertCircle size={10} />
                                {record.unpaidLeaveDays} unpaid day(s) deducted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="text-xs text-slate-400">Base</p>
                          <p className="text-sm font-medium">
                            {usd(record.baseSalary)}
                          </p>
                        </div>
                        {record.unpaidLeaveDays > 0 && (
                          <div className="text-right hidden md:block">
                            <p className="text-xs text-red-400">
                              Unpaid Deducted
                            </p>
                            <p className="text-sm font-semibold text-red-600">
                              -{usd(record.unpaidLeaveDeduction)}
                            </p>
                            <p className="text-xs text-red-400">
                              {record.unpaidLeaveDays}d ×{" "}
                              {usd((record.baseSalary / 160) * 8)}/day
                            </p>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Net Salary</p>
                          <p className="text-lg font-bold text-emerald-600">
                            {usd(record.netSalary)}
                          </p>
                        </div>
                        {/* ✅ Individual payslip PDF button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            exportEmployeePayslipToPdf(
                              record as ExportPayrollRecord,
                              myName,
                            );
                          }}
                          title="Download Payslip PDF"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors flex-shrink-0"
                        >
                          <FileText size={14} />
                        </button>
                        {expandedRows.has(record.id) ? (
                          <ChevronUp size={16} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={16} className="text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Breakdown */}
                    {expandedRows.has(record.id) && (
                      <SalaryBreakdown record={record} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-slate-200 mb-3" />
                <p className="text-slate-500 text-sm">
                  No payroll records yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── ADMIN VIEW ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payroll</h1>
          <p className="text-slate-500 text-sm mt-1">
            Generate and manage monthly payroll
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {/* ✅ Admin export buttons */}
          {allPayrolls && allPayrolls.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() =>
                  exportAdminPayrollToExcel(
                    allPayrolls as ExportPayrollRecord[],
                    selectedMonth,
                  )
                }
              >
                <FileSpreadsheet size={14} />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                onClick={() =>
                  exportAdminPayrollToPdf(
                    allPayrolls as ExportPayrollRecord[],
                    selectedMonth,
                  )
                }
              >
                <FileText size={14} />
                PDF
              </Button>
            </>
          )}
          <Button onClick={() => setGenerateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Generate Payroll
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Generated",
            value: String(totalGenerated),
            icon: <TrendingUp size={16} />,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Paid",
            value: String(totalPaid),
            icon: <CheckCircle size={16} />,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Pending Payment",
            value: String(totalPending),
            icon: <Clock size={16} />,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            label: "Total Net Payout",
            value: usd(totalNet),
            icon: <DollarSign size={16} />,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div
              className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3 ${stat.color}`}
            >
              {stat.icon}
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {stat.label}
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${stat.color}`}
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Records — {selectedMonth}</CardTitle>
          <CardDescription>
            {totalGenerated} record(s) · Click a row to see full breakdown
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {allLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-100 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : allPayrolls && allPayrolls.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Employee</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>
                      <span className="text-red-600">Unpaid Deduction</span>
                    </TableHead>
                    <TableHead>Tax (10%)</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPayrolls.map((record) => (
                    <>
                      <TableRow
                        key={record.id}
                        className="cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => toggleRow(record.id)}
                      >
                        {/* Employee */}
                        <TableCell>
                          <p className="font-semibold text-slate-900">
                            {record.employeeName}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {record.employeeId}
                          </p>
                        </TableCell>

                        {/* Base */}
                        <TableCell className="tabular-nums">
                          {usd(record.baseSalary)}
                        </TableCell>

                        {/* Overtime */}
                        <TableCell className="tabular-nums">
                          {record.overtimePay > 0 ? (
                            <span className="text-emerald-600 font-medium">
                              +{usd(record.overtimePay)}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>

                        {/* Unpaid Deduction — key column */}
                        <TableCell>
                          {record.unpaidLeaveDays > 0 ? (
                            <div>
                              <p className="font-semibold text-red-600 tabular-nums">
                                -{usd(record.unpaidLeaveDeduction)}
                              </p>
                              <p className="text-xs text-red-400 mt-0.5">
                                {record.unpaidLeaveDays} day(s) ×{" "}
                                {usd((record.baseSalary / 160) * 8)}/day
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>

                        {/* Tax */}
                        <TableCell className="text-orange-600 tabular-nums">
                          -{usd(record.tax)}
                        </TableCell>

                        {/* Net */}
                        <TableCell>
                          <span className="font-bold text-emerald-600 text-base tabular-nums">
                            {usd(record.netSalary)}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <PayrollStatusBadge status={record.status} />
                        </TableCell>

                        {/* Action */}
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {record.status === "GENERATED" ? (
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                              disabled={loadingPay === record.id}
                              onClick={() => handleMarkPaid(record.id)}
                            >
                              {loadingPay === record.id
                                ? "Saving..."
                                : "Mark as Paid"}
                            </Button>
                          ) : (
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle size={12} /> Paid
                            </span>
                          )}
                        </TableCell>

                        {/* Expand chevron */}
                        <TableCell>
                          {expandedRows.has(record.id) ? (
                            <ChevronUp size={14} className="text-slate-400" />
                          ) : (
                            <ChevronDown size={14} className="text-slate-400" />
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Expanded breakdown row */}
                      {expandedRows.has(record.id) && (
                        <TableRow key={`breakdown-${record.id}`}>
                          <TableCell colSpan={9} className="p-0">
                            <SalaryBreakdown record={record} />
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-slate-200 mb-3" />
              <p className="text-slate-500 text-sm mb-1">
                No payroll generated for {selectedMonth}
              </p>
              <p className="text-slate-400 text-xs mb-4">
                Click "Generate Payroll" to run payroll for all active employees
              </p>
              <Button
                variant="outline"
                onClick={() => setGenerateModalOpen(true)}
              >
                <Plus size={14} className="mr-2" /> Generate Payroll
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <GeneratePayrollModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
      />
    </div>
  );
}
