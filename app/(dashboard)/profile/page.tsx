"use client";

import type { ReactNode } from "react";
import { useAppSelector } from "@/src/hooks";
import { useGetMyProfileQuery } from "@/src/feature/employee/employeeApi";
import {
  Avatar,
  ProfileImageUpload,
} from "@/src/components/profile-image-upload";
import {
  Briefcase,
  Building2,
  CalendarDays,
  DollarSign,
  Mail,
  Shield,
  User,
  UserRound,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

function StatusPill({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-slate-200 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          {label}
        </p>
        <div className="mt-1 text-sm font-medium text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function InfoBlock({
  eyebrow,
  title,
  description,
  children,
  tone = "white",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  tone?: "white" | "soft";
}) {
  const shell =
    tone === "soft"
      ? "bg-emerald-50/50 border-emerald-100"
      : "bg-white border-slate-200";

  return (
    <Card className={`overflow-hidden rounded-[1.75rem] border shadow-sm ${shell}`}>
      <CardContent className="grid p-0 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="border-b border-slate-200/80 px-6 py-7 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {eyebrow}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <div className="px-6 py-7">{children}</div>
      </CardContent>
    </Card>
  );
}

function MetaPill({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
      <span className="text-slate-400">{icon}</span>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const role = useAppSelector((state) => state.auth.role);
  const { data: profile, isLoading, refetch } = useGetMyProfileQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-52 animate-pulse rounded-[1.75rem] bg-slate-200" />
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="h-80 animate-pulse rounded-[1.75rem] bg-slate-100" />
          <div className="h-80 animate-pulse rounded-[1.75rem] bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="mx-auto max-w-2xl rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="rounded-[1.5rem] bg-slate-100 p-5">
            <UserRound className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">
            Profile not found
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            Your employee profile has not been created yet. Contact your
            administrator so the account can be fully prepared for payroll and
            self-service access.
          </p>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const roleLabel = role === "ADMIN" ? "Administrator" : "Employee";

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Profile
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
          My Profile
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          A calmer view of your account and payroll details, using the same
          visual language as the rest of the dashboard.
        </p>
      </div>

      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_58%,#ecfdf5_100%)] px-6 py-7 sm:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <Avatar
                profileImage={profile.profileImage}
                name={fullName}
                size="xl"
              />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      <Shield className="h-3.5 w-3.5 text-emerald-600" />
                      {roleLabel}
                    </span>
                    <StatusPill isActive={profile.isActive} />
                  </div>

                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                    {fullName}
                  </h2>
                  <p className="mt-2 text-base text-slate-600">
                    {profile.position || "Team member"}
                    {profile.department ? ` in ${profile.department}` : ""}
                  </p>
                </div>
              </div>

              <div className="sm:self-start">
                <MetaPill icon={<CalendarDays className="h-4 w-4" />}>
                  Joined {formatDate(profile.hireDate)}
                </MetaPill>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <MetaPill icon={<Mail className="h-4 w-4" />}>
                {profile.email || "No email"}
              </MetaPill>
              <MetaPill icon={<User className="h-4 w-4 font-sans" />}>
                <span className="font-mono">@{profile.username}</span>
              </MetaPill>
            </div>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="border-b border-slate-200 xl:border-b-0 xl:border-r">
            <div className="px-6 py-7 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Identity
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Personal details
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Your core account information appears here exactly as it is used
                throughout the system.
              </p>

              <div className="mt-8">
                <DetailRow
                  label="Full Name"
                  value={fullName}
                  icon={<User className="h-4 w-4" />}
                />
                <DetailRow
                  label="Username"
                  value={<span className="font-mono">@{profile.username}</span>}
                  icon={<User className="h-4 w-4" />}
                />
                <DetailRow
                  label="Email"
                  value={profile.email || "-"}
                  icon={<Mail className="h-4 w-4" />}
                />
                <DetailRow
                  label="Account Role"
                  value={roleLabel}
                  icon={<Shield className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50/70 px-6 py-7 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Profile Photo
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Keep it personal, keep it consistent
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Upload a photo anytime. Until then, the default avatar keeps the
              page feeling complete without introducing a different style.
            </p>

            <div className="mt-8 flex justify-center rounded-[1.5rem] border border-slate-200 bg-white px-4 py-6">
              <ProfileImageUpload
                currentImage={profile.profileImage}
                name={fullName}
                onSuccess={refetch}
              />
            </div>
          </div>
        </div>
      </section>

      <InfoBlock
        eyebrow="Work Record"
        title="Employment details"
        description="These fields are part of the HR-managed record used for payroll and employment history."
        tone="soft"
      >
        <DetailRow
          label="Department"
          value={profile.department || "-"}
          icon={<Building2 className="h-4 w-4" />}
        />
        <DetailRow
          label="Position"
          value={profile.position || "-"}
          icon={<Briefcase className="h-4 w-4" />}
        />
        <DetailRow
          label="Base Salary"
          value={formatSalary(profile.baseSalary)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <DetailRow
          label="Hire Date"
          value={formatDate(profile.hireDate)}
          icon={<CalendarDays className="h-4 w-4" />}
        />
      </InfoBlock>
    </div>
  );
}
