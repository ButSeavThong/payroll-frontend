'use client';

import { useState } from 'react';
import { useAppSelector } from '@/src/hooks';
import { useGetEmployeesQuery, useGetMyEmployeeQuery } from '@/src/feature/employee/employeeApi';
import { CreateEmployeeModal } from '@/src/components/create-employee-modal';
import { LoadingTable } from '@/src/components/loading-table';
import { StatusBadge } from '@/src/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { formatDate, formatSalary } from '@/src/lib/utils';

export default function EmployeesPage() {
  const role = useAppSelector((state) => state.auth.role);
  const [modalOpen, setModalOpen] = useState(false);

  // Admin view
  const { data: employees, isLoading } = useGetEmployeesQuery(
    undefined,
    { skip: role !== 'ADMIN' }
  );

  // Employee view
  const { data: myEmployee, isLoading: myEmployeeLoading } = useGetMyEmployeeQuery(
    undefined,
    { skip: role !== 'EMPLOYEE' }
  );

  if (role === 'EMPLOYEE') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Your employee information</p>
        </div>

        {myEmployeeLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-2/4"></div>
              </div>
            </CardContent>
          </Card>
        ) : myEmployee ? (
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">First Name</p>
                  <p className="font-medium">{myEmployee.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Last Name</p>
                  <p className="font-medium">{myEmployee.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Department</p>
                  <p className="font-medium">{myEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Position</p>
                  <p className="font-medium">{myEmployee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Base Salary</p>
                  <p className="font-medium">{formatSalary(myEmployee.baseSalary)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Hire Date</p>
                  <p className="font-medium">{formatDate(myEmployee.hireDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <p className="font-medium">
                    <StatusBadge status={myEmployee.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-slate-600">No employee profile found. Please contact your administrator.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Admin view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-600 mt-1">Manage employee profiles and information</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Employee Profile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>All employee profiles in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable columns={8} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees && employees.length > 0 ? (
                    employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-mono text-xs">{employee.id}</TableCell>
                        <TableCell>
                          {employee.firstName} {employee.lastName}
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{formatSalary(employee.baseSalary)}</TableCell>
                        <TableCell>{formatDate(employee.hireDate)}</TableCell>
                        <TableCell>
                          <StatusBadge status={employee.isActive ? 'ACTIVE' : 'INACTIVE'} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                        No employees found. Create an employee profile to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateEmployeeModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
