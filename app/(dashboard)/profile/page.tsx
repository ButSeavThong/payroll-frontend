// app/(dashboard)/profile/page.tsx
"use client";

import { useAppSelector } from "@/src/hooks";
import { useGetMyProfileQuery } from "@/src/feature/employee/employeeApi";
import {
  ArrowLeft,
  Mail,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

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
    month: "long",
    day: "numeric",
  });
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="h-48 bg-gray-200 rounded-2xl animate-pulse mb-6" />
        <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: employee, isLoading, isError } = useGetMyProfileQuery();

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !employee) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 mb-8"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="border border-gray-200 rounded-2xl bg-white p-12 text-center">
            <p className="text-gray-600">
              No employee profile found. Please contact your HR administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const initials =
    `${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>

        {/* ── Hero Banner ──────────────────────────────── */}
        <div className="border border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-white text-2xl font-bold flex-shrink-0">
              {initials}
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Employee Profile
              </p>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                {employee.firstName} {employee.lastName}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {employee.position && (
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Briefcase size={14} />
                    {employee.position}
                  </span>
                )}
                {employee.department && (
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    {employee.department}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    employee.isActive
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {employee.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Personal Information ─────────────────────── */}
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden mb-6">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <User size={16} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  First Name
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {employee.firstName}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Last Name
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {employee.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Username
                </p>
                <p className="inline-block font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                  @{employee.username}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Email
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <Mail size={14} className="text-gray-600" />
                  {employee.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Employment Details ───────────────────────── */}
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden mb-6">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <Briefcase size={16} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Employment Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 mb-3">
                  <Briefcase size={14} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Department
                </p>
                <p className="text-gray-800 font-medium">
                  {employee.department || "N/A"}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 mb-3">
                  <MapPin size={14} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Position
                </p>
                <p className="text-gray-800 font-medium">
                  {employee.position || "N/A"}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 mb-3">
                  <DollarSign size={14} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Base Salary
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {formatSalary(employee.baseSalary)}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 mb-3">
                  <Calendar size={14} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Hire Date
                </p>
                <p className="text-gray-800 font-medium">
                  {formatDate(employee.hireDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── HR Note ──────────────────────────────────── */}
        <div className="border border-gray-200 rounded-2xl bg-gray-50 p-4 flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 flex-shrink-0 mt-0.5">
            <ShieldCheck size={16} />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Read-only profile.</span> To update
            your name, department, salary, or any other details — please reach
            out to your <span className="font-semibold">HR administrator</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
