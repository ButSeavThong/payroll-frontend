"use client";

import { useState } from "react";
import { useGetUsersQuery } from "@/src/feature/user/userApi";
import { CreateUserModal } from "@/src/components/create-user-modal";
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
import { Plus, CheckCircle2, Circle } from "lucide-react";

// ─── Local helpers ────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
// Your backend returns roles as string[] — e.g. ["ADMIN", "EMPLOYEE"]
// We show each role as a colored badge

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-800",
    EMPLOYEE: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mr-1 ${
        styles[role] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {role}
    </span>
  );
}

// ─── Onboarding Steps ─────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  {
    step: 1,
    title: "Create User Account",
    description:
      "Create login credentials here. Note the User ID from the response.",
  },
  {
    step: 2,
    title: "Create Employee Profile",
    description: "Go to Employees tab → use the User ID to link HR profile.",
  },
  {
    step: 3,
    title: "Employee Logs In",
    description: "Employee uses username + password to access the system.",
  },
  {
    step: 4,
    title: "Daily Attendance",
    description: "Employee checks in and out each working day.",
  },
  {
    step: 5,
    title: "Monthly Payroll",
    description:
      "Admin generates payroll at month end → marks as PAID after transfer.",
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newUserId, setNewUserId] = useState<number | null>(null);

  const { data: users, isLoading } = useGetUsersQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">
            Manage login accounts — Step 1 of employee onboarding
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Success banner — shows after creating a user */}
      {newUserId && (
        <div className="bg-green-50 border border-green-300 rounded-md px-4 py-3 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">
              User created successfully! User ID:{" "}
              <span className="font-mono">{newUserId}</span>
            </p>
            <p className="text-sm text-green-700 mt-0.5">
              Now go to the <strong>Employees</strong> tab and use this User ID
              to create the employee HR profile.
            </p>
          </div>
          <button
            onClick={() => setNewUserId(null)}
            className="ml-auto text-green-600 hover:text-green-800 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Onboarding Stepper */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Employee Onboarding Flow</CardTitle>
          <CardDescription>
            Follow these steps in order to fully onboard a new employee
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ONBOARDING_STEPS.map((item, index) => (
              <div key={item.step} className="flex items-start gap-4">
                {/* Step circle */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-bold">
                  {item.step}
                </div>
                {/* Step content */}
                <div className="flex-1 pt-1">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                {/* Connector line (visual only) */}
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div className="hidden" /> // spacing handled by space-y-4
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>
            {users?.length ?? 0} user(s) in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable columns={6} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        {/* ✅ Show ID prominently — admin needs it for Step 2 */}
                        <TableCell>
                          <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {user.id}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {user.gender ?? "-"}
                        </TableCell>
                        <TableCell>{formatDate(user.dob)}</TableCell>
                        {/* ✅ isDeleted from UserProfileResponse */}
                        <TableCell>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              user.isDeleted
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.isDeleted ? "Deleted" : "Active"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-slate-500 py-8"
                      >
                        No users found. Create your first user to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateUserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        // Pass callback so page can show the new user's ID in the success banner
        onUserCreated={(id) => setNewUserId(id)}
      />
    </div>
  );
}
