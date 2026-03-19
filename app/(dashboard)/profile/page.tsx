// app/(dashboard)/profile/page.tsx
"use client";

import { useAppSelector } from "@/src/hooks";
import { useGetMyProfileQuery } from "@/src/feature/employee/employeeApi";
import { ProfileImageUpload } from "@/src/components/profile-image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Briefcase,
  DollarSign,
  CalendarDays,
  Mail,
  User,
  Shield,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSalary(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const role = useAppSelector((s) => s.auth.role);

  // ✅ Hook called INSIDE the component — not outside
  const { data: profile, isLoading, refetch } = useGetMyProfileQuery();

  // ── Loading ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl animate-pulse">
        <div className="h-48 bg-slate-200 rounded-2xl" />
        <div className="h-40 bg-slate-100 rounded-2xl" />
        <div className="h-52 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────────
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <User size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">Profile not found</p>
          <p className="text-slate-400 text-sm mt-1">
            Contact your administrator to set up your employee profile.
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* ── Hero Card ────────────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        {/* Dark banner */}
        <div className="h-28 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20px 20px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
          {/* Role badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                role === "ADMIN"
                  ? "bg-purple-500/30 text-purple-200 border border-purple-500/40"
                  : "bg-emerald-500/30 text-emerald-200 border border-emerald-500/40"
              }`}
            >
              <Shield size={11} />
              {role}
            </span>
          </div>
        </div>

        <CardContent className="px-6 pb-6">
          {/* Avatar + name row — overlaps banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12">
            {/* ✅ Profile image upload */}
            <div className="flex-shrink-0">
              <ProfileImageUpload
                currentImage={profile.profileImage}
                name={fullName}
                onSuccess={refetch}
              />
            </div>

            {/* Name + position + email */}
            <div className="flex-1 pb-1 pt-14 sm:pt-0">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {fullName}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {profile.position || "—"}
                {profile.department && (
                  <span className="text-slate-400">
                    {" "}
                    · {profile.department}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <Mail size={12} className="text-slate-400" />
                <span className="text-xs text-slate-400">{profile.email}</span>
              </div>
            </div>

            {/* Active / Inactive badge */}
            <div className="flex-shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  profile.isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    profile.isActive
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                />
                {profile.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Personal Information ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User size={16} className="text-blue-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "First Name", value: profile.firstName },
              { label: "Last Name", value: profile.lastName },
              {
                label: "Username",
                value: (
                  <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    @{profile.username}
                  </span>
                ),
              },
              {
                label: "Email",
                value: (
                  <span className="flex items-center gap-1.5 text-sm">
                    <Mail size={12} className="text-slate-400 flex-shrink-0" />
                    {profile.email}
                  </span>
                ),
              },
            ].map((field) => (
              <div key={field.label} className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1.5">
                  {field.label}
                </p>
                <div className="text-sm font-semibold text-slate-900">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Employment Details ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase size={16} className="text-emerald-500" />
            Employment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Department",
                value: profile.department || "—",
                icon: <Building2 size={14} className="text-blue-500" />,
                bg: "bg-blue-50 border-blue-100",
              },
              {
                label: "Position",
                value: profile.position || "—",
                icon: <Briefcase size={14} className="text-purple-500" />,
                bg: "bg-purple-50 border-purple-100",
              },
              {
                label: "Base Salary",
                value: formatSalary(profile.baseSalary),
                icon: <DollarSign size={14} className="text-emerald-500" />,
                bg: "bg-emerald-50 border-emerald-100",
              },
              {
                label: "Hire Date",
                value: formatDate(profile.hireDate),
                icon: <CalendarDays size={14} className="text-amber-500" />,
                bg: "bg-amber-50 border-amber-100",
              },
            ].map((field) => (
              <div
                key={field.label}
                className={`rounded-xl border p-4 ${field.bg}`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  {field.icon}
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {field.label}
                  </p>
                </div>
                <p className="font-bold text-slate-900">{field.value}</p>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-start gap-2">
            <Shield size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Employment details are managed by HR. To request changes to your
              department, position, or salary, please contact your
              administrator. You can update your <strong>profile image</strong>{" "}
              above at any time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
