"use client";

import { useState } from "react";
import { useAppSelector } from "@/src/hooks";
import {
  useGetEmployeesQuery,
  useGetMyProfileQuery,
} from "@/src/feature/employee/employeeApi";
import { CreateEmployeeModal } from "@/src/components/create-employee-modal";
import { UpdateEmployeeModal } from "@/src/components/update-employee-modal"; // ✅ import
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
import { Plus, Pencil } from "lucide-react"; // ✅ add Pencil

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

// ─── Type for selected employee ───────────────────────────────────────────────

interface SelectedEmployee {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  baseSalary: number;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmployeesPage() {
  const role = useAppSelector((state) => state.auth.role);
  const isAdmin = role === "ADMIN";

  const [createModalOpen, setCreateModalOpen] = useState(false);

  // ✅ Track which employee is being edited
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<SelectedEmployee | null>(null);

  const { data: employees, isLoading } = useGetEmployeesQuery(undefined, {
    skip: !isAdmin,
  });

  const { data: myProfile, isLoading: myProfileLoading } = useGetMyProfileQuery(
    undefined,
    { skip: isAdmin },
  );

  // ✅ Open update modal with pre-filled data
  const handleEditClick = (employee: SelectedEmployee) => {
    setSelectedEmployee(employee);
    setUpdateModalOpen(true);
  };

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
                {[
                  { label: "First Name", value: myProfile.firstName },
                  { label: "Last Name", value: myProfile.lastName },
                  { label: "Username", value: myProfile.username },
                  { label: "Email", value: myProfile.email || "N/A" },
                  { label: "Department", value: myProfile.department || "N/A" },
                  { label: "Position", value: myProfile.position || "N/A" },
                  {
                    label: "Base Salary",
                    value: formatSalary(myProfile.baseSalary),
                  },
                  { label: "Hire Date", value: formatDate(myProfile.hireDate) },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-sm text-slate-500">{field.label}</p>
                    <p className="font-semibold text-slate-900 mt-1">
                      {field.value}
                    </p>
                  </div>
                ))}
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <div className="mt-1">
                    <ActiveBadge isActive={myProfile.isActive} />
                  </div>
                </div>
              </div>
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
        <Button onClick={() => setCreateModalOpen(true)}>
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
            <LoadingTable columns={8} />
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
                    <TableHead>Action</TableHead> {/* ✅ new column */}
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

                        {/* ✅ Edit button */}
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs gap-1.5"
                            onClick={() =>
                              handleEditClick({
                                id: employee.id,
                                firstName: employee.firstName,
                                lastName: employee.lastName,
                                department: employee.department,
                                position: employee.position,
                                baseSalary: employee.baseSalary,
                              })
                            }
                          >
                            <Pencil size={12} />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
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

      {/* Create Modal */}
      <CreateEmployeeModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {/* ✅ Update Modal */}
      <UpdateEmployeeModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        employee={selectedEmployee}
      />
    </div>
  );
}
