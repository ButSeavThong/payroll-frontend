'use client';

import { useState } from 'react';
import { useAppSelector } from '@/src/hooks';
import { useGetPayrollsQuery, useGetMyPayrollQuery, useMarkPayrollAsPaidMutation } from '@/src/feature/payroll/payrollApi';
import { GeneratePayrollModal } from '@/src/components/generate-payroll-modal';
import { LoadingTable } from '@/src/components/loading-table';
import { StatusBadge } from '@/src/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, formatSalary, formatMonth, getCurrentMonth } from '@/src/lib/utils';
import { cn } from '@/lib/utils';

export default function PayrollPage() {
  const role = useAppSelector((state) => state.auth.role);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Admin view
  const { data: payrolls, isLoading: payrollsLoading, refetch: refetchPayrolls } = useGetPayrollsQuery(
    { month: selectedMonth },
    { skip: role !== 'ADMIN' }
  );
  const [markAsPaid] = useMarkPayrollAsPaidMutation();

  // Employee view
  const { data: myPayroll, isLoading: myPayrollLoading } = useGetMyPayrollQuery(
    undefined,
    { skip: role !== 'EMPLOYEE' }
  );

  const handleMarkAsPaid = async (payrollId: string) => {
    try {
      await markAsPaid(payrollId).unwrap();
      toast.success('Payroll marked as paid');
      refetchPayrolls();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update payroll status');
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (role === 'EMPLOYEE') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Payroll</h1>
          <p className="text-slate-600 mt-1">View your payroll records and payment history</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payroll History</CardTitle>
            <CardDescription>All your payroll records</CardDescription>
          </CardHeader>
          <CardContent>
            {myPayrollLoading ? (
              <LoadingTable columns={5} />
            ) : (
              <div className="space-y-4">
                {myPayroll && myPayroll.length > 0 ? (
                  myPayroll.map((record) => (
                    <Collapsible key={record.id} className="border rounded-lg">
                      <CollapsibleTrigger className="w-full">
                        <div className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                          <div className="flex items-center flex-1 gap-4">
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform',
                                expandedRows.has(record.id) ? 'rotate-180' : ''
                              )}
                            />
                            <div className="text-left flex-1">
                              <p className="font-medium">{formatMonth(record.month)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">{formatSalary(record.netSalary)}</p>
                              <p className="text-xs text-slate-500">Net Salary</p>
                            </div>
                          </div>
                          <div className="ml-4">
                            <StatusBadge status={record.status} />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4 border-t bg-slate-50">
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-slate-600">Base Salary</p>
                            <p className="text-lg font-semibold">{formatSalary(record.baseSalary)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Overtime Pay</p>
                            <p className="text-lg font-semibold text-amber-600">{formatSalary(record.overtimePay)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Tax</p>
                            <p className="text-lg font-semibold text-red-600">{formatSalary(record.tax)}</p>
                          </div>
                          <div className="bg-white p-3 rounded-md border">
                            <p className="text-sm text-slate-600">Net Salary</p>
                            <p className="text-lg font-semibold text-green-600">{formatSalary(record.netSalary)}</p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                ) : (
                  <p className="text-slate-600 text-center py-8">No payroll records found.</p>
                )}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payroll Management</h1>
          <p className="text-slate-600 mt-1">Generate and manage employee payroll</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Payroll
        </Button>
      </div>

      {/* Month Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md"
          />
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
          <CardDescription>
            {selectedMonth && `Payroll for ${formatMonth(selectedMonth)}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payrollsLoading ? (
            <LoadingTable columns={8} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Overtime Pay</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrolls && payrolls.length > 0 ? (
                    payrolls.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-xs">{record.employeeId}</TableCell>
                        <TableCell className="font-medium">{record.employeeName || 'N/A'}</TableCell>
                        <TableCell>{formatMonth(record.month)}</TableCell>
                        <TableCell>{formatSalary(record.baseSalary)}</TableCell>
                        <TableCell className="text-amber-600">{formatSalary(record.overtimePay)}</TableCell>
                        <TableCell className="text-red-600">{formatSalary(record.tax)}</TableCell>
                        <TableCell className="font-semibold">{formatSalary(record.netSalary)}</TableCell>
                        <TableCell>
                          <StatusBadge status={record.status} />
                        </TableCell>
                        <TableCell>
                          {record.status === 'GENERATED' && (
                            <Button
                              onClick={() => handleMarkAsPaid(record.id)}
                              size="sm"
                              variant="outline"
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
                      <TableCell colSpan={9} className="text-center text-slate-500 py-8">
                        No payroll records found for {formatMonth(selectedMonth)}.
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
        onSuccess={() => refetchPayrolls()}
      />
    </div>
  );
}
