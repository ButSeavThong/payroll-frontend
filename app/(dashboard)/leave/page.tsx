// app/(dashboard)/leave/page.tsx
"use client";

import { useState } from "react";
import { useAppSelector } from "@/src/hooks";
import {
  useGetMyLeavesQuery,
  useGetAllLeavesQuery,
  useRequestLeaveMutation,
  useReviewLeaveMutation,
  useGetMyLeaveBalanceQuery,
  LeaveResponse,
  LeaveType,
} from "@/src/feature/leave/leaveApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  Palmtree,
  Stethoscope,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function LeaveTypeBadge({ type }: { type: LeaveType }) {
  const map: Record<LeaveType, { label: string; cls: string }> = {
    ANNUAL_LEAVE: { label: "🌴 Annual", cls: "bg-blue-100 text-blue-800" },
    SICK_LEAVE: { label: "🤒 Sick", cls: "bg-yellow-100 text-yellow-800" },
    UNPAID_LEAVE: { label: "📋 Unpaid", cls: "bg-slate-100 text-slate-700" },
  };
  const t = map[type];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${t.cls}`}
    >
      {t.label}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: "PENDING" | "APPROVED" | "REJECTED";
}) {
  const map = {
    PENDING: {
      label: "Pending",
      cls: "bg-yellow-100 text-yellow-800",
      icon: <Clock size={10} />,
    },
    APPROVED: {
      label: "Approved",
      cls: "bg-green-100 text-green-800",
      icon: <CheckCircle size={10} />,
    },
    REJECTED: {
      label: "Rejected",
      cls: "bg-red-100 text-red-800",
      icon: <XCircle size={10} />,
    },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}
    >
      {s.icon} {s.label}
    </span>
  );
}

// ─── Balance Card ─────────────────────────────────────────────────────────────

function BalanceBar({
  used,
  total,
  color,
}: {
  used: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
      <div
        className={`h-1.5 rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function LeaveBalanceSection() {
  const { data: balance, isLoading } = useGetMyLeaveBalanceQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-32 bg-slate-100 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (!balance) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Annual Leave */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Palmtree size={15} className="text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Annual Leave</p>
          </div>
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            Paid
          </span>
        </div>
        <BalanceBar
          used={balance.annualLeaveUsed}
          total={balance.annualLeaveTotal}
          color="bg-blue-500"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-400">
            {balance.annualLeaveUsed} used
          </span>
          <span className="text-xs font-bold text-slate-900">
            {balance.annualLeaveRemaining}
            <span className="text-slate-400 font-normal">
              {" "}
              / {balance.annualLeaveTotal} days left
            </span>
          </span>
        </div>
        {balance.annualLeaveRemaining === 0 && (
          <p className="text-xs text-red-500 font-medium mt-2">
            ⚠ No annual leave remaining this year
          </p>
        )}
      </div>

      {/* Sick Leave */}
      <div className="bg-white border border-yellow-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Stethoscope size={15} className="text-yellow-500" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Sick Leave</p>
          </div>
          <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Paid
          </span>
        </div>
        <BalanceBar
          used={balance.sickLeaveUsed}
          total={balance.sickLeaveTotal}
          color="bg-yellow-400"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-400">
            {balance.sickLeaveUsed} used
          </span>
          <span className="text-xs font-bold text-slate-900">
            {balance.sickLeaveRemaining}
            <span className="text-slate-400 font-normal">
              {" "}
              / {balance.sickLeaveTotal} days left
            </span>
          </span>
        </div>
        {balance.sickLeaveRemaining === 0 && (
          <p className="text-xs text-red-500 font-medium mt-2">
            ⚠ No sick leave remaining this year
          </p>
        )}
      </div>

      {/* Unpaid Leave */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Ban size={15} className="text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Unpaid Leave</p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            Deducted
          </span>
        </div>
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <p className="text-xs text-amber-700">
            Unpaid leave has <strong>no cap</strong> but daily rate will be
            deducted from your monthly salary when payroll is generated.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Request Leave Modal ──────────────────────────────────────────────────────

const leaveSchema = z
  .object({
    leaveType: z.enum(["ANNUAL_LEAVE", "SICK_LEAVE", "UNPAID_LEAVE"], {
      required_error: "Please select a leave type",
    }),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z
      .string()
      .max(500, "Reason must not exceed 500 characters")
      .optional(),
  })
  .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

type LeaveFormData = z.infer<typeof leaveSchema>;

function RequestLeaveModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [requestLeave, { isLoading }] = useRequestLeaveMutation();
  const { data: balance } = useGetMyLeaveBalanceQuery();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<LeaveFormData>({ resolver: zodResolver(leaveSchema) });

  const selectedType = watch("leaveType");

  const onSubmit = async (data: LeaveFormData) => {
    try {
      await requestLeave(data).unwrap();
      toast.success("Leave request submitted! Awaiting admin approval.");
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit leave request");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // Warn if selecting paid leave but balance is 0
  const showAnnualWarning =
    selectedType === "ANNUAL_LEAVE" && balance?.annualLeaveRemaining === 0;
  const showSickWarning =
    selectedType === "SICK_LEAVE" && balance?.sickLeaveRemaining === 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>
            Submit a leave request — admin will approve or reject it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label>Leave Type *</Label>
            <Select
              onValueChange={(v) =>
                setValue("leaveType", v as LeaveFormData["leaveType"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANNUAL_LEAVE">
                  <div className="flex items-center justify-between w-full gap-8">
                    <span>🌴 Annual Leave</span>
                    <span className="text-xs text-blue-600 font-semibold">
                      {balance
                        ? `${balance.annualLeaveRemaining}d left`
                        : "Paid"}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="SICK_LEAVE">
                  <div className="flex items-center justify-between w-full gap-8">
                    <span>🤒 Sick Leave</span>
                    <span className="text-xs text-yellow-600 font-semibold">
                      {balance ? `${balance.sickLeaveRemaining}d left` : "Paid"}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="UNPAID_LEAVE">
                  <div className="flex items-center justify-between w-full gap-8">
                    <span>📋 Unpaid Leave</span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Salary deducted
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.leaveType && (
              <p className="text-xs text-red-500">{errors.leaveType.message}</p>
            )}

            {/* Balance warnings */}
            {showAnnualWarning && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-xs text-red-700">
                  ⚠ You have <strong>0 annual leave days remaining</strong>.
                  Request will still be submitted but may be rejected by admin.
                </p>
              </div>
            )}
            {showSickWarning && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-xs text-red-700">
                  ⚠ You have <strong>0 sick leave days remaining</strong>.
                  Request will still be submitted but may be rejected by admin.
                </p>
              </div>
            )}
            {selectedType === "UNPAID_LEAVE" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <p className="text-xs text-amber-700">
                  📋 Unpaid leave days will be{" "}
                  <strong>deducted from your salary</strong> when payroll is
                  generated for that month.
                </p>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Input
                type="date"
                min={today}
                {...register("startDate")}
                disabled={isLoading}
              />
              {errors.startDate && (
                <p className="text-xs text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Input
                type="date"
                min={today}
                {...register("endDate")}
                disabled={isLoading}
              />
              {errors.endDate && (
                <p className="text-xs text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>
              Reason
              <span className="text-slate-400 font-normal ml-1">
                (optional)
              </span>
            </Label>
            <Textarea
              placeholder="Briefly explain the reason for your leave..."
              rows={3}
              {...register("reason")}
              disabled={isLoading}
            />
            {errors.reason && (
              <p className="text-xs text-red-500">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Review Modal (Admin) ─────────────────────────────────────────────────────

function ReviewModal({
  leave,
  open,
  onOpenChange,
}: {
  leave: LeaveResponse | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [reviewLeave, { isLoading }] = useReviewLeaveMutation();
  const [adminNote, setAdminNote] = useState("");

  const handle = async (status: "APPROVED" | "REJECTED") => {
    if (!leave) return;
    try {
      await reviewLeave({ id: leave.id, body: { status, adminNote } }).unwrap();
      toast.success(`Leave ${status.toLowerCase()} successfully`);
      setAdminNote("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to review leave");
    }
  };

  if (!leave) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Leave Request</DialogTitle>
          <DialogDescription>
            Approve or reject this leave request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">
                {leave.employeeName}
              </p>
              <LeaveTypeBadge type={leave.leaveType} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">From</p>
                <p className="font-medium">{formatDate(leave.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">To</p>
                <p className="font-medium">{formatDate(leave.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Working Days</p>
                <p className="font-bold text-slate-900">{leave.totalDays}d</p>
              </div>
            </div>

            {leave.leaveType === "UNPAID_LEAVE" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <p className="text-xs text-amber-700">
                  ⚠ This is <strong>Unpaid Leave</strong> — if approved,
                  {leave.totalDays} day(s) will be deducted from employee's
                  salary.
                </p>
              </div>
            )}

            {leave.reason && (
              <div>
                <p className="text-xs text-slate-400">Reason from employee</p>
                <p className="text-sm text-slate-700 mt-0.5">{leave.reason}</p>
              </div>
            )}
          </div>

          {/* Admin note */}
          <div className="space-y-2">
            <Label>
              Note to Employee
              <span className="text-slate-400 font-normal ml-1">
                (optional)
              </span>
            </Label>
            <Textarea
              placeholder="e.g. Approved. Have a good rest. / Rejected due to busy season."
              rows={2}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handle("REJECTED")}
              disabled={isLoading}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle size={14} className="mr-1.5" /> Reject
            </Button>
            <Button
              onClick={() => handle("APPROVED")}
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle size={14} className="mr-1.5" /> Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LeavePage() {
  const role = useAppSelector((s) => s.auth.role);
  const isAdmin = role === "ADMIN";

  const [requestOpen, setRequestOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selected, setSelected] = useState<LeaveResponse | null>(null);
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");

  const { data: myLeaves, isLoading: myLoading } = useGetMyLeavesQuery(
    undefined,
    { skip: isAdmin },
  );
  // console.log("my leave history : ", myLeaves);

  const { data: allLeaves, isLoading: allLoading } = useGetAllLeavesQuery(
    undefined,
    { skip: !isAdmin },
  );

  const openReview = (leave: LeaveResponse) => {
    setSelected(leave);
    setReviewOpen(true);
  };

  const pending = allLeaves?.filter((l) => l.status === "PENDING").length ?? 0;
  const approved =
    allLeaves?.filter((l) => l.status === "APPROVED").length ?? 0;
  const rejected =
    allLeaves?.filter((l) => l.status === "REJECTED").length ?? 0;

  const filtered =
    filter === "ALL"
      ? allLeaves
      : allLeaves?.filter((l) => l.status === filter);

  // ── EMPLOYEE VIEW ─────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Leave</h1>
            <p className="text-slate-500 text-sm mt-1">
              Request and track your leave — pending requests require admin
              approval
            </p>
          </div>
          <Button onClick={() => setRequestOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Request Leave
          </Button>
        </div>

        {/* ✅ Balance cards with progress bars */}
        <LeaveBalanceSection />

        {/* Leave history */}
        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
            <CardDescription>
              {myLeaves?.length ?? 0} total request(s) — all years
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-slate-100 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : myLeaves && myLeaves.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Admin Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myLeaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>
                          <LeaveTypeBadge type={leave.leaveType} />
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(leave.startDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(leave.endDate)}
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-slate-900">
                            {leave.totalDays}
                          </span>
                          <span className="text-slate-400 text-xs ml-0.5">
                            d
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm max-w-[140px] truncate">
                          {leave.reason ?? "—"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={leave.status} />
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm max-w-[160px] truncate">
                          {leave.adminNote ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarDays className="mx-auto h-12 w-12 text-slate-200 mb-3" />
                <p className="text-slate-500 text-sm mb-1">
                  No leave requests yet
                </p>
                <p className="text-slate-400 text-xs mb-4">
                  You have {10} annual and {7} sick leave days available this
                  year
                </p>
                <Button variant="outline" onClick={() => setRequestOpen(true)}>
                  <Plus size={14} className="mr-2" /> Request your first leave
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <RequestLeaveModal open={requestOpen} onOpenChange={setRequestOpen} />
      </div>
    );
  }

  // ── ADMIN VIEW ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Leave Management</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review and approve employee leave requests
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Pending Review",
            value: pending,
            bg: "bg-yellow-50 border-yellow-200",
            val: "text-yellow-600",
          },
          {
            label: "Approved",
            value: approved,
            bg: "bg-green-50 border-green-200",
            val: "text-green-600",
          },
          {
            label: "Rejected",
            value: rejected,
            bg: "bg-red-50 border-red-200",
            val: "text-red-600",
          },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {s.label}
            </p>
            <p
              className={`text-4xl font-bold ${s.val}`}
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === f
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f === "ALL" ? `All (${allLeaves?.length ?? 0})` : f}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
          <CardDescription>{filtered?.length ?? 0} request(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {allLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-100 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">
                        {leave.employeeName}
                      </TableCell>
                      <TableCell>
                        <LeaveTypeBadge type={leave.leaveType} />
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(leave.startDate)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(leave.endDate)}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold">{leave.totalDays}</span>
                        <span className="text-slate-400 text-xs ml-0.5">d</span>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm max-w-[140px] truncate">
                        {leave.reason ?? "—"}
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs">
                        {formatDate(leave.createdAt)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={leave.status} />
                      </TableCell>
                      <TableCell>
                        {leave.status === "PENDING" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => openReview(leave)}
                          >
                            Review
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {leave.adminNote ? (
                              <span
                                title={leave.adminNote}
                                className="cursor-help underline decoration-dotted"
                              >
                                Note
                              </span>
                            ) : (
                              "—"
                            )}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="mx-auto h-12 w-12 text-slate-200 mb-3" />
              <p className="text-slate-500 text-sm">No leave requests found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ReviewModal
        leave={selected}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
      />
    </div>
  );
}
