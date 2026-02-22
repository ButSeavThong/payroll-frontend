"use client";

import { useState } from "react";
import { useAppSelector } from "@/src/hooks";
import {
  useGetEmployeesQuery,
  useGetMyProfileQuery,
} from "@/src/feature/employee/employeeApi";
import { CreateEmployeeModal } from "@/src/components/create-employee-modal";
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
import { Plus } from "lucide-react";

// ─── Local helpers ────────────────────────────────────────────────────────────

function formatSalary(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
// Handles ACTIVE / INACTIVE — separate from attendance StatusBadge

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmployeesPage() {
  const role = useAppSelector((state) => state.auth.role);
  const isAdmin = role === "ADMIN";
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ Admin — fetch all employees
  const { data: employees, isLoading } = useGetEmployeesQuery(undefined, {
    skip: !isAdmin,
  });

  // ✅ Employee — fetch own profile using correct hook name
  const { data: myProfile, isLoading: myProfileLoading } = useGetMyProfileQuery(
    undefined,
    { skip: isAdmin },
  );

  // ── Employee View ─────────────────────────────────────────────────────────

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Your employee information</p>
        </div>

        {myProfileLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-2/4" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ) : myProfile ? (
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500">First Name</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {myProfile.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Last Name</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {myProfile.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Username</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {myProfile.username}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {myProfile.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {myProfile.department || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Position</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {myProfile.position || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Base Salary</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {formatSalary(myProfile.baseSalary)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Hire Date</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {formatDate(myProfile.hireDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <div className="mt-1">
                    <ActiveBadge isActive={myProfile.isActive} />
                  </div>
                </div>
              </div>

              {/* HR note */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
                  To update your profile information, please contact your HR
                  administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600">
                No employee profile found. Please contact your administrator.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ── Admin View ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-600 mt-1">
            Manage employee profiles and information
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Employee Profile
        </Button>
      </div>

      {/* Onboarding hint */}
      <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
        <p className="text-sm text-amber-800">
          <strong>Reminder:</strong> You must create a{" "}
          <strong>User account first</strong> (Users tab) to get a User ID —
          then use that ID here to create the employee profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            {employees?.length ?? 0} employee(s) in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable columns={7} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
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
                        <TableCell className="font-mono text-xs">
                          {employee.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {employee.email}
                        </TableCell>
                        <TableCell>{employee.department || "N/A"}</TableCell>
                        <TableCell>{employee.position || "N/A"}</TableCell>
                        <TableCell className="font-medium">
                          {formatSalary(employee.baseSalary)}
                        </TableCell>
                        <TableCell>{formatDate(employee.hireDate)}</TableCell>
                        <TableCell>
                          <ActiveBadge isActive={employee.isActive} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-slate-500 py-8"
                      >
                        No employees found. Create an employee profile to get
                        started.
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
