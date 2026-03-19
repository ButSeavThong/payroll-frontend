"use client";

import { useState } from "react";
import {
  useGetUsersQuery,
  useToggleUserStatusMutation,
} from "@/src/feature/user/userApi";
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
import {
  Plus,
  CheckCircle2,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-800",
    EMPLOYEE: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${styles[role] ?? "bg-slate-100 text-slate-700"}`}
    >
      {role}
    </span>
  );
}

function AccountStatusBadge({ isEnabled }: { isEnabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isEnabled
          ? "bg-emerald-100 text-emerald-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          isEnabled ? "bg-emerald-500 animate-pulse" : "bg-red-500"
        }`}
      />
      {isEnabled ? "Active" : "Disabled"}
    </span>
  );
}

// ─── Onboarding Steps ─────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  {
    step: 1,
    title: "Create User Account",
    desc: "Create login credentials here. Note the User ID shown after creation.",
    color: "bg-blue-600",
  },
  {
    step: 2,
    title: "Create Employee Profile",
    desc: "Go to Employees tab → use the User ID to link the HR profile.",
    color: "bg-purple-600",
  },
  {
    step: 3,
    title: "Employee Logs In",
    desc: "Employee uses their email + password to access the system.",
    color: "bg-emerald-600",
  },
  {
    step: 4,
    title: "Daily Attendance",
    desc: "Employee checks in and out each working day.",
    color: "bg-yellow-500",
  },
  {
    step: 5,
    title: "Monthly Payroll",
    desc: "Admin generates payroll at month end → marks as PAID after transfer.",
    color: "bg-pink-600",
  },
];

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  username: string;
  isEnabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ConfirmDialog({
  open,
  username,
  isEnabled,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 z-10">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isEnabled ? "bg-red-100" : "bg-emerald-100"
          }`}
        >
          {isEnabled ? (
            <ShieldOff size={22} className="text-red-600" />
          ) : (
            <ShieldCheck size={22} className="text-emerald-600" />
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
          {isEnabled ? "Deactivate Account?" : "Activate Account?"}
        </h3>

        <p className="text-sm text-slate-500 text-center mb-5">
          {isEnabled ? (
            <>
              <span className="font-semibold text-slate-800">{username}</span>{" "}
              will no longer be able to log in to the system.
            </>
          ) : (
            <>
              <span className="font-semibold text-slate-800">{username}</span>{" "}
              will regain access and be able to log in again.
            </>
          )}
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 text-white ${
              isEnabled
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading ? "Saving..." : isEnabled ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newUserId, setNewUserId] = useState<number | null>(null);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmUser, setConfirmUser] = useState<{
    id: number;
    username: string;
    isEnabled: boolean;
  } | null>(null);

  const { data: users, isLoading } = useGetUsersQuery();
  const [toggleStatus, { isLoading: toggling }] = useToggleUserStatusMutation();

  // ── Open confirm dialog ───────────────────────────────────────────────────
  const openConfirm = (user: {
    id: number;
    username: string;
    isEnabled: boolean;
  }) => {
    setConfirmUser(user);
    setConfirmOpen(true);
  };

  // ── Execute toggle after confirmation ─────────────────────────────────────
  const handleConfirmToggle = async () => {
    if (!confirmUser) return;
    try {
      await toggleStatus(confirmUser.id).unwrap();
      toast.success(
        confirmUser.isEnabled
          ? `🔴 ${confirmUser.username} has been deactivated`
          : `🟢 ${confirmUser.username} has been activated`,
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update account status");
    } finally {
      setConfirmOpen(false);
      setConfirmUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Manage login accounts — Step 1 of employee onboarding
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create User
        </Button>
      </div>

      {/* Success banner after creating user */}
      {newUserId && (
        <div className="bg-green-50 border border-green-300 rounded-xl px-4 py-3 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">
              User created! User ID:{" "}
              <span className="font-mono bg-green-100 px-1.5 py-0.5 rounded text-green-900">
                {newUserId}
              </span>
            </p>
            <p className="text-sm text-green-700 mt-0.5">
              Now go to the <strong>Employees</strong> tab and use this User ID
              to create the employee HR profile.
            </p>
          </div>
          <button
            onClick={() => setNewUserId(null)}
            className="text-green-600 hover:text-green-800 text-xl leading-none flex-shrink-0"
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
          <div className="flex flex-col md:flex-row gap-3">
            {ONBOARDING_STEPS.map((item, i) => (
              <div
                key={item.step}
                className="flex md:flex-col items-start md:items-center gap-3 md:gap-2 flex-1"
              >
                {/* Circle */}
                <div
                  className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {item.step}
                </div>
                {/* Connector (horizontal on md+) */}
                {i < ONBOARDING_STEPS.length - 1 && (
                  <div className="hidden md:block h-0.5 w-full bg-slate-200 flex-1 mt-4" />
                )}
                {/* Text */}
                <div className="md:text-center">
                  <p className="text-xs font-bold text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
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
            {users?.length ?? 0} user(s) · Active accounts can log in · Disabled
            accounts are blocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable columns={7} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow
                        key={user.id}
                        className={!user.isEnabled ? "bg-red-50/40" : ""}
                      >
                        {/* ID */}
                        <TableCell>
                          <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {user.id}
                          </span>
                        </TableCell>

                        {/* Username */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* Avatar initial */}
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                                user.isEnabled ? "bg-slate-700" : "bg-slate-300"
                              }`}
                            >
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span
                              className={`font-medium ${!user.isEnabled ? "text-slate-400 line-through" : "text-slate-900"}`}
                            >
                              {user.username}
                            </span>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell className="text-slate-500 text-sm">
                          {user.email}
                        </TableCell>

                        {/* Gender */}
                        <TableCell className="text-slate-500 text-sm capitalize">
                          {user.gender ?? "—"}
                        </TableCell>

                        {/* DOB */}
                        <TableCell className="text-slate-500 text-sm">
                          {formatDate(user.dob)}
                        </TableCell>

                        {/* Account Status */}
                        <TableCell>
                          <AccountStatusBadge isEnabled={user.isEnabled} />
                        </TableCell>

                        {/* Toggle Action */}
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`text-xs font-semibold gap-1.5 ${
                              user.isEnabled
                                ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                            }`}
                            onClick={() =>
                              openConfirm({
                                id: user.id,
                                username: user.username,
                                isEnabled: user.isEnabled,
                              })
                            }
                          >
                            {user.isEnabled ? (
                              <>
                                <UserX size={12} /> Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck size={12} /> Activate
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-slate-500 py-10"
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

      {/* Create User Modal */}
      <CreateUserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUserCreated={(id) => setNewUserId(id)}
      />

      {/* Confirm Toggle Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        username={confirmUser?.username ?? ""}
        isEnabled={confirmUser?.isEnabled ?? true}
        onConfirm={handleConfirmToggle}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmUser(null);
        }}
        isLoading={toggling}
      />
    </div>
  );
}
