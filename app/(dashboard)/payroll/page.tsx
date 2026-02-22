"use client";

import { useState } from "react";
import { useAppSelector } from "@/src/hooks";
import { GeneratePayrollModal } from "@/src/components/generate-payroll-modal";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetAllPayrollsQuery,
  useGetMyPayrollsQuery,
  useMarkAsPaidMutation,
} from "@/src/feature/payroll/payrollApi";

// ─── Local helpers ────────────────────────────────────────────────────────────

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(monthStr: string): string {
  if (!monthStr) return "";
  const [year, month] = monthStr.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

function formatSalary(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─── Payroll Status Badge ─────────────────────────────────────────────────────
// Handles "GENERATED" and "PAID" — separate from other status badges

function PayrollStatusBadge({ status }: { status: "GENERATED" | "PAID" }) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-full text-xs font-semibold",
        status === "PAID"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800",
      )}
    >
      {status}
    </span>
  );
}

// ─── Salary Breakdown Card ────────────────────────────────────────────────────

function SalaryBreakdown({
  baseSalary,
  overtimePay,
  tax,
  netSalary,
}: {
  baseSalary: number;
  overtimePay: number;
  tax: number;
  netSalary: number;
}) {
  return (
    <div className="px-4 pb-4 pt-3 border-t bg-slate-50">
      <p className="text-xs text-slate-500 mb-3 font-medium">
        Salary Breakdown: Base + Overtime − Tax = Net
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-500">Base Salary</p>
          <p className="text-lg font-semibold text-slate-900">
            {formatSalary(baseSalary)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Overtime Pay</p>
          <p className="text-lg font-semibold text-amber-600">
            + {formatSalary(overtimePay)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Tax (10%)</p>
          <p className="text-lg font-semibold text-red-600">
            − {formatSalary(tax)}
          </p>
        </div>
        <div className="bg-white p-3 rounded-md border">
          <p className="text-sm text-slate-500">Net Salary</p>
          <p className="text-lg font-semibold text-green-700">
            {formatSalary(netSalary)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PayrollPage() {
  const role = useAppSelector((state) => state.auth.role);
  const isAdmin = role === "ADMIN";
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // ✅ expandedRows uses number — matches record.id type
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // ✅ Admin — pass month as string directly, not as object
  const { data: payrolls, isLoading: payrollsLoading } = useGetAllPayrollsQuery(
    selectedMonth,
    { skip: !isAdmin },
  );

  // Employee
  const { data: myPayrolls, isLoading: myPayrollLoading } =
    useGetMyPayrollsQuery(undefined, { skip: isAdmin });

  // ✅ markAsPaid takes number — no need to refetch manually (invalidatesTags handles it)
  const [markAsPaid, { isLoading: markingPaid }] = useMarkAsPaidMutation();

  const handleMarkAsPaid = async (payrollId: number) => {
    try {
      await markAsPaid(payrollId).unwrap(); // ✅ number not string
      toast.success("Payroll marked as PAID");
      // ✅ No refetch needed — invalidatesTags: ['Payroll'] auto-refreshes
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update payroll status");
    }
  };

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // ── Employee View ─────────────────────────────────────────────────────────

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Payroll</h1>
          <p className="text-slate-600 mt-1">
            Your payroll records and payment history
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payroll History</CardTitle>
            <CardDescription>
              Click any record to see the salary breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myPayrollLoading ? (
              <LoadingTable columns={3} rows={4} />
            ) : myPayrolls && myPayrolls.length > 0 ? (
              <div className="space-y-3">
                {myPayrolls.map((record) => (
                  <Collapsible key={record.id}>
                    <div className="border rounded-lg overflow-hidden">
                      <CollapsibleTrigger
                        className="w-full"
                        onClick={() => toggleExpanded(record.id)}
                      >
                        <div className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-slate-400 transition-transform flex-shrink-0",
                              expandedRows.has(record.id) ? "rotate-180" : "",
                            )}
                          />
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-slate-900">
                              {formatMonth(record.month)}
                            </p>
                          </div>
                          <div className="text-right mr-4">
                            <p className="font-bold text-lg text-slate-900">
                              {formatSalary(record.netSalary)}
                            </p>
                            <p className="text-xs text-slate-400">Net Salary</p>
                          </div>
                          <PayrollStatusBadge status={record.status} />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SalaryBreakdown
                          baseSalary={record.baseSalary}
                          overtimePay={record.overtimePay}
                          tax={record.tax}
                          netSalary={record.netSalary}
                        />
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">
                No payroll records found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Admin View ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Payroll Management
          </h1>
          <p className="text-slate-600 mt-1">
            Generate and manage employee payroll
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Payroll
        </Button>
      </div>

      {/* Month filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <p className="text-xs text-slate-400 mt-2">
            Showing: {formatMonth(selectedMonth)}
          </p>
        </CardContent>
      </Card>

      {/* Payroll table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
          <CardDescription>
            {payrolls?.length ?? 0} record(s) for {formatMonth(selectedMonth)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payrollsLoading ? (
            <LoadingTable columns={9} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrolls && payrolls.length > 0 ? (
                    payrolls.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.employeeName}</p>
                            <p className="text-xs text-slate-400 font-mono">
                              ID: {record.employeeId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{formatMonth(record.month)}</TableCell>
                        <TableCell>{formatSalary(record.baseSalary)}</TableCell>
                        <TableCell className="text-amber-600">
                          {formatSalary(record.overtimePay)}
                        </TableCell>
                        <TableCell className="text-red-600">
                          {formatSalary(record.tax)}
                        </TableCell>
                        <TableCell className="font-bold text-green-700">
                          {formatSalary(record.netSalary)}
                        </TableCell>
                        <TableCell>
                          <PayrollStatusBadge status={record.status} />
                        </TableCell>
                        <TableCell>
                          {record.status === "GENERATED" && (
                            <Button
                              onClick={() => handleMarkAsPaid(record.id)} // ✅ number
                              size="sm"
                              variant="outline"
                              disabled={markingPaid}
                              className="text-xs"
                            >
                              Mark as Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-slate-500 py-8"
                      >
                        No payroll records for {formatMonth(selectedMonth)}.
                        Click "Generate Payroll" to create them.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <GeneratePayrollModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        // ✅ No need to manually refetch — invalidatesTags handles it
      />
    </div>
  );
}
