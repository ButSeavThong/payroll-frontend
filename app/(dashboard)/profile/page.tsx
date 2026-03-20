"use client";

import type { ReactNode } from "react";
import { useAppSelector } from "@/src/hooks";
import { useGetMyProfileQuery } from "@/src/feature/employee/employeeApi";
import {
  Avatar,
  ProfileImageUpload,
} from "@/src/components/profile-image-upload";
import {
  Building2,
  Briefcase,
  CalendarDays,
  DollarSign,
  Mail,
  Shield,
  User,
  UserRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatSalary(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-800"
          : "bg-red-100 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-[0.2em]">
          {label}
        </p>
      </div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const role = useAppSelector((state) => state.auth.role);
  const { data: profile, isLoading, refetch } = useGetMyProfileQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-44 animate-pulse rounded-3xl bg-slate-200" />
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="mx-auto max-w-2xl border-slate-200 shadow-sm">
        <CardContent className="flex min-h-72 flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-3xl bg-slate-100 p-5">
            <UserRound className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Profile not found</h1>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Your employee profile has not been created yet. Contact your
            administrator so they can finish your account setup.
          </p>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const roleTone =
    role === "ADMIN"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-emerald-100 text-emerald-700 border-emerald-200";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Keep your personal identity polished and review the details HR manages
          for your payroll record.
        </p>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-7 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.3),transparent_30%),radial-gradient(circle_at_left,rgba(59,130,246,0.24),transparent_32%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <Avatar
                profileImage={profile.profileImage}
                name={fullName}
                size="xl"
              />
              <div className="pt-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${roleTone}`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {role}
                  </span>
                  <StatusBadge isActive={profile.isActive} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{fullName}</h2>
                <p className="mt-1 text-sm text-slate-300">
                  {profile.position || "Team member"}
                  {profile.department ? ` - ${profile.department}` : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                    <Mail className="h-4 w-4" />
                    {profile.email || "No email"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono">
                    <User className="h-4 w-4 font-sans" />
                    @{profile.username}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Department
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {profile.department || "Not set"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Hire Date
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatDate(profile.hireDate)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Base Salary
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatSalary(profile.baseSalary)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                <User className="h-4 w-4 text-blue-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <InfoCard
                icon={<User className="h-4 w-4 text-blue-500" />}
                label="First Name"
                value={profile.firstName}
              />
              <InfoCard
                icon={<User className="h-4 w-4 text-cyan-500" />}
                label="Last Name"
                value={profile.lastName}
              />
              <InfoCard
                icon={<Mail className="h-4 w-4 text-emerald-500" />}
                label="Email"
                value={profile.email || "-"}
              />
              <InfoCard
                icon={<Shield className="h-4 w-4 text-amber-500" />}
                label="Account Role"
                value={role || "Employee"}
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                <Briefcase className="h-4 w-4 text-emerald-500" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <InfoCard
                icon={<Building2 className="h-4 w-4 text-blue-500" />}
                label="Department"
                value={profile.department || "-"}
              />
              <InfoCard
                icon={<Briefcase className="h-4 w-4 text-violet-500" />}
                label="Position"
                value={profile.position || "-"}
              />
              <InfoCard
                icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
                label="Base Salary"
                value={formatSalary(profile.baseSalary)}
              />
              <InfoCard
                icon={<CalendarDays className="h-4 w-4 text-amber-500" />}
                label="Hire Date"
                value={formatDate(profile.hireDate)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">
                Profile Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileImageUpload
                currentImage={profile.profileImage}
                name={fullName}
                onSuccess={refetch}
              />
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Your default avatar now appears automatically until you upload a
                photo, so the profile card always looks complete.
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">
                Update Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Identity details like your name and email appear here exactly as
                they are stored in payroll.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                HR manages department, position, salary, and hire date. Reach
                out to your administrator if any of those need correction.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
