// app/(dashboard)/system/page.tsx
"use client";

import {
  Server,
  Globe,
  Database,
  Shield,
  Zap,
  GitBranch,
  Mail,
  Github,
  Code2,
  Layers,
  Package,
  Lock,
  RefreshCw,
  Box,
  ExternalLink,
  Cpu,
  Workflow,
  MessageSquare,
  Phone,
} from "lucide-react";

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-20 font-sans">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest uppercase text-emerald-500 mb-1">
          Technical Documentation
        </p>
        <h1
          className="text-4xl text-slate-900 mb-2 tracking-tight"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          System Architecture
        </h1>
        <p className="text-sm text-slate-400 font-light max-w-xl leading-relaxed">
          Full-stack HR & Payroll platform built with Spring Boot and Next.js.
          Modular monolith backend with feature-based packaging, RTK Query
          frontend.
        </p>
      </div>

      {/* ── Architecture Diagram ─────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl p-6 mb-6 overflow-x-auto">
        <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-4">
          System Overview
        </p>

        {/* Flow */}
        <div className="flex items-stretch gap-3 min-w-[700px]">
          {/* Client */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Globe size={14} className="text-blue-400" />
              </div>
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                Client
              </span>
            </div>
            <div className="space-y-2">
              {[
                "Next.js 16",
                "App Router",
                "RTK Query",
                "Tailwind CSS",
                "TypeScript",
              ].map((t) => (
                <div
                  key={t}
                  className="bg-white/5 rounded-md px-2.5 py-1.5 text-xs text-white/60 font-mono"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center gap-1 px-1">
            <div className="text-emerald-400">
              <div className="text-xs text-white/30 text-center mb-1 font-mono">
                JWT
              </div>
              <div className="flex items-center gap-1">
                <div className="w-16 h-px bg-emerald-500/50" />
                <div className="text-emerald-400">▶</div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="text-emerald-400">◀</div>
                <div className="w-16 h-px bg-emerald-500/50" />
              </div>
              <div className="text-xs text-white/30 text-center mt-1 font-mono">
                JSON
              </div>
            </div>
          </div>

          {/* Backend */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Server size={14} className="text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                Backend
              </span>
            </div>
            <div className="space-y-2">
              {[
                "Spring Boot 4.0",
                "Spring Security",
                "JWT RS256",
                "JPA/Hibernate",
                "Gradle ",
              ].map((t) => (
                <div
                  key={t}
                  className="bg-white/5 rounded-md px-2.5 py-1.5 text-xs text-white/60 font-mono"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center gap-1 px-1">
            <div className="text-emerald-400">
              <div className="text-xs text-white/30 text-center mb-1 font-mono">
                SQL
              </div>
              <div className="flex items-center gap-1">
                <div className="w-10 h-px bg-purple-500/50" />
                <div className="text-purple-400">▶</div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="text-purple-400">◀</div>
                <div className="w-10 h-px bg-purple-500/50" />
              </div>
              <div className="text-xs text-white/30 text-center mt-1 font-mono">
                ORM
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Database size={14} className="text-purple-400" />
              </div>
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                Database
              </span>
            </div>
            <div className="space-y-2">
              {[
                "PostgreSQL",
                "users",
                "employees",
                "attendances",
                "payrolls",
              ].map((t, i) => (
                <div
                  key={t}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-mono ${
                    i === 0
                      ? "bg-white/5 text-white/60"
                      : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  }`}
                >
                  {i > 0 ? `⬡ ${t}` : t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security flow */}
        <div className="mt-4 bg-white/3 border border-white/6 rounded-xl p-4">
          <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-3">
            Auth Flow
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              {
                label: "POST /auth/login",
                color: "text-blue-300 bg-blue-500/10 border-blue-500/20",
              },
              { label: "→", color: "text-white/20" },
              {
                label: "RS256 JWT signed",
                color:
                  "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
              },
              { label: "→", color: "text-white/20" },
              {
                label: "Bearer token",
                color: "text-yellow-300 bg-yellow-500/10 border-yellow-500/20",
              },
              { label: "→", color: "text-white/20" },
              {
                label: "Role: ADMIN | EMPLOYEE",
                color: "text-purple-300 bg-purple-500/10 border-purple-500/20",
              },
              { label: "→", color: "text-white/20" },
              {
                label: "@PreAuthorize",
                color: "text-pink-300 bg-pink-500/10 border-pink-500/20",
              },
            ].map((item, i) => (
              <span
                key={i}
                className={`text-xs font-mono px-2 py-1 rounded-md border ${item.color}`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two Column: Backend + Frontend ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Backend */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-content-center justify-center">
              <Server size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Backend — Spring Boot
              </p>
              <p className="text-xs text-slate-400 font-light">
                Modular monolith · Port 8080
              </p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Feature packages */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Feature-Based Packages
              </p>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs space-y-1 leading-relaxed">
                <div className="text-slate-400">com.thong.feature/</div>
                {[
                  {
                    pkg: "├── auth/",
                    items: ["AuthController", "User", "Role"],
                    color: "text-blue-400",
                  },
                  {
                    pkg: "├── user/",
                    items: ["UserController", "UserProfileResponse"],
                    color: "text-purple-400",
                  },
                  {
                    pkg: "├── employee/",
                    items: ["EmployeeController", "EmployeeService"],
                    color: "text-emerald-400",
                  },
                  {
                    pkg: "├── attendance/",
                    items: ["AttendanceController", "CheckIn/Out"],
                    color: "text-yellow-400",
                  },
                  {
                    pkg: "└── payroll/",
                    items: ["PayrollController", "GeneratePayroll"],
                    color: "text-pink-400",
                  },
                ].map((item) => (
                  <div key={item.pkg}>
                    <span className={`${item.color} font-medium`}>
                      {item.pkg}
                    </span>
                    {item.items.map((i) => (
                      <div key={i} className="ml-6 text-slate-500">
                        └── {i}.java
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* API Endpoints */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                REST API Endpoints
              </p>
              <div className="space-y-1.5">
                {[
                  {
                    method: "POST",
                    path: "/auth/login",
                    role: "Public",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    method: "POST",
                    path: "/auth/register",
                    role: "Public",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    method: "GET",
                    path: "/employees",
                    role: "ADMIN",
                    color: "bg-purple-100 text-purple-700",
                  },
                  {
                    method: "GET",
                    path: "/employees/me",
                    role: "ANY",
                    color: "bg-emerald-100 text-emerald-700",
                  },
                  {
                    method: "POST",
                    path: "/attendance/check-in",
                    role: "EMPLOYEE",
                    color: "bg-yellow-100 text-yellow-700",
                  },
                  {
                    method: "POST",
                    path: "/attendance/check-out",
                    role: "EMPLOYEE",
                    color: "bg-yellow-100 text-yellow-700",
                  },
                  {
                    method: "POST",
                    path: "/payrolls/generate",
                    role: "ADMIN",
                    color: "bg-purple-100 text-purple-700",
                  },
                  {
                    method: "PATCH",
                    path: "/payrolls/{id}/pay",
                    role: "ADMIN",
                    color: "bg-purple-100 text-purple-700",
                  },
                ].map((ep) => (
                  <div
                    key={ep.path}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-xs w-12 text-center
                      ${
                        ep.method === "GET"
                          ? "bg-emerald-100 text-emerald-700"
                          : ep.method === "POST"
                            ? "bg-blue-100 text-blue-700"
                            : ep.method === "PATCH"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-slate-600 flex-1">
                      /api/v1{ep.path}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs font-semibold ${ep.color}`}
                    >
                      {ep.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech badges */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Key Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: "RS256 JWT",
                    icon: <Lock size={11} />,
                    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  },
                  {
                    label: "BigDecimal",
                    icon: <Zap size={11} />,
                    color: "bg-blue-50 text-blue-700 border-blue-200",
                  },
                  {
                    label: "CORS PATCH",
                    icon: <Shield size={11} />,
                    color: "bg-purple-50 text-purple-700 border-purple-200",
                  },
                  {
                    label: "@Transactional",
                    icon: <RefreshCw size={11} />,
                    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
                  },
                  {
                    label: "LAZY Loading",
                    icon: <Package size={11} />,
                    color: "bg-pink-50 text-pink-700 border-pink-200",
                  },
                  {
                    label: "Record DTO",
                    icon: <Box size={11} />,
                    color: "bg-slate-100 text-slate-700 border-slate-200",
                  },
                ].map((b) => (
                  <span
                    key={b.label}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${b.color}`}
                  >
                    {b.icon} {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Frontend */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Globe size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Frontend — Next.js 14
              </p>
              <p className="text-xs text-slate-400 font-light">
                App Router · Port 3000
              </p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Project structure */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Project Structure
              </p>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs space-y-0.5 leading-relaxed">
                <div className="text-slate-400">src/</div>
                {[
                  { path: "├── app/", color: "text-blue-400" },
                  { path: "│   ├── (auth)/login/", color: "text-slate-500" },
                  { path: "│   └── (dashboard)/", color: "text-slate-500" },
                  { path: "│       ├── dashboard/", color: "text-slate-600" },
                  { path: "│       ├── employees/", color: "text-slate-600" },
                  { path: "│       ├── attendance/", color: "text-slate-600" },
                  { path: "│       ├── payroll/", color: "text-slate-600" },
                  { path: "│       └── system/", color: "text-emerald-400" },
                  { path: "├── feature/", color: "text-purple-400" },
                  {
                    path: "│   ├── auth/authSlice.ts",
                    color: "text-slate-500",
                  },
                  {
                    path: "│   ├── employee/employeeApi.ts",
                    color: "text-slate-500",
                  },
                  {
                    path: "│   ├── attendance/attendanceApi.ts",
                    color: "text-slate-500",
                  },
                  {
                    path: "│   └── payroll/payrollApi.ts",
                    color: "text-slate-500",
                  },
                  { path: "├── lib/baseApi.ts", color: "text-yellow-400" },
                  { path: "├── lib/jwtUtils.ts", color: "text-yellow-400" },
                  { path: "└── store.ts", color: "text-pink-400" },
                ].map((item) => (
                  <div key={item.path} className={item.color}>
                    {item.path}
                  </div>
                ))}
              </div>
            </div>

            {/* State management */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                State & Data Flow
              </p>
              <div className="space-y-2">
                {[
                  {
                    label: "Redux Toolkit",
                    desc: "authSlice — token, role, username persisted to localStorage",
                    icon: <Layers size={13} />,
                    color: "bg-purple-50 border-purple-100",
                  },
                  {
                    label: "RTK Query (baseApi)",
                    desc: "Single createApi — all features inject endpoints",
                    icon: <Zap size={13} />,
                    color: "bg-blue-50 border-blue-100",
                  },
                  {
                    label: "JWT Decoder",
                    desc: "RS256 base64url decode → extract scope → role",
                    icon: <Lock size={13} />,
                    color: "bg-emerald-50 border-emerald-100",
                  },
                  {
                    label: "Middleware.ts",
                    desc: "Cookie-based route protection — /dashboard, /payroll…",
                    icon: <Shield size={13} />,
                    color: "bg-yellow-50 border-yellow-100",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border ${item.color}`}
                  >
                    <span className="text-slate-500 mt-0.5 flex-shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-400 font-light mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech badges */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Key Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: "Next.js 14",
                    color: "bg-slate-100 text-slate-700 border-slate-200",
                  },
                  {
                    label: "TypeScript",
                    color: "bg-blue-50 text-blue-700 border-blue-200",
                  },
                  {
                    label: "Tailwind CSS",
                    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
                  },
                  {
                    label: "RTK Query",
                    color: "bg-purple-50 text-purple-700 border-purple-200",
                  },
                  {
                    label: "Zod Validation",
                    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  },
                  {
                    label: "React Hook Form",
                    color: "bg-pink-50 text-pink-700 border-pink-200",
                  },
                  {
                    label: "Sonner Toasts",
                    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
                  },
                  {
                    label: "shadcn/ui",
                    color: "bg-slate-100 text-slate-700 border-slate-200",
                  },
                ].map((b) => (
                  <span
                    key={b.label}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${b.color}`}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Database Schema ───────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Database size={16} className="text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">
              Database Schema — PostgreSQL
            </p>
            <p className="text-xs text-slate-400 font-light">
              4 tables · JPA/Hibernate ORM · Unique constraints enforced
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                table: "users",
                color: "border-blue-200 bg-blue-50",
                headerColor: "bg-blue-500",
                fields: [
                  { name: "id", type: "SERIAL PK" },
                  { name: "username", type: "VARCHAR UNIQUE" },
                  { name: "email", type: "VARCHAR UNIQUE" },
                  { name: "password", type: "VARCHAR" },
                  { name: "gender", type: "VARCHAR" },
                  { name: "dob", type: "DATE" },
                  { name: "is_deleted", type: "BOOLEAN" },
                ],
              },
              {
                table: "employees",
                color: "border-emerald-200 bg-emerald-50",
                headerColor: "bg-emerald-500",
                fields: [
                  { name: "id", type: "SERIAL PK" },
                  { name: "user_id", type: "FK → users UNIQUE" },
                  { name: "first_name", type: "VARCHAR" },
                  { name: "last_name", type: "VARCHAR" },
                  { name: "department", type: "VARCHAR" },
                  { name: "position", type: "VARCHAR" },
                  { name: "base_salary", type: "NUMERIC(15,2)" },
                  { name: "hire_date", type: "DATE" },
                  { name: "is_active", type: "BOOLEAN" },
                ],
              },
              {
                table: "attendances",
                color: "border-yellow-200 bg-yellow-50",
                headerColor: "bg-yellow-500",
                fields: [
                  { name: "id", type: "SERIAL PK" },
                  { name: "employee_id", type: "FK → employees" },
                  { name: "date", type: "DATE" },
                  { name: "check_in_time", type: "TIMESTAMP" },
                  { name: "check_out_time", type: "TIMESTAMP" },
                  { name: "total_hours", type: "DOUBLE" },
                  { name: "overtime_hours", type: "DOUBLE" },
                  { name: "★ UNIQUE", type: "(employee_id, date)" },
                ],
              },
              {
                table: "payrolls",
                color: "border-pink-200 bg-pink-50",
                headerColor: "bg-pink-500",
                fields: [
                  { name: "id", type: "SERIAL PK" },
                  { name: "employee_id", type: "FK → employees" },
                  { name: "month", type: "VARCHAR(7)" },
                  { name: "base_salary", type: "NUMERIC(15,2)" },
                  { name: "overtime_pay", type: "NUMERIC(15,2)" },
                  { name: "tax", type: "NUMERIC(15,2)" },
                  { name: "net_salary", type: "NUMERIC(15,2)" },
                  { name: "status", type: "GENERATED | PAID" },
                  { name: "★ UNIQUE", type: "(employee_id, month)" },
                ],
              },
            ].map((tbl) => (
              <div
                key={tbl.table}
                className={`border rounded-xl overflow-hidden ${tbl.color}`}
              >
                <div className={`${tbl.headerColor} px-3 py-2`}>
                  <p className="text-white text-xs font-bold font-mono tracking-wide">
                    {tbl.table}
                  </p>
                </div>
                <div className="p-3 space-y-1">
                  {tbl.fields.map((f) => (
                    <div key={f.name} className="flex items-start gap-1.5">
                      <span className="font-mono text-xs font-semibold text-slate-700 flex-shrink-0">
                        {f.name}
                      </span>
                      <span className="font-mono text-xs text-slate-400 leading-tight">
                        {f.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Payroll formula */}
          <div className="mt-4 bg-slate-900 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">
              Payroll Calculation Formula
            </p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {[
                {
                  expr: "hourlyRate = baseSalary ÷ 160",
                  color: "text-blue-300 bg-blue-500/10 border-blue-500/20",
                },
                {
                  expr: "→",
                  color: "text-white/20 border-transparent bg-transparent",
                },
                {
                  expr: "overtimePay = hours × rate × 1.5",
                  color:
                    "text-yellow-300 bg-yellow-500/10 border-yellow-500/20",
                },
                {
                  expr: "→",
                  color: "text-white/20 border-transparent bg-transparent",
                },
                {
                  expr: "tax = (base + overtime) × 10%",
                  color: "text-red-300 bg-red-500/10 border-red-500/20",
                },
                {
                  expr: "→",
                  color: "text-white/20 border-transparent bg-transparent",
                },
                {
                  expr: "netSalary = gross − tax",
                  color:
                    "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
                },
              ].map((item, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1.5 rounded-lg border ${item.color}`}
                >
                  {item.expr}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Developer Contact ─────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/06">
          <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-1">
            Developer Support
          </p>
          <h2
            className="text-2xl text-white tracking-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Need help or found a bug?
          </h2>
          <p className="text-sm text-white/40 font-light mt-1">
            Reach out directly — happy to assist with integration questions,
            issues, or feature requests.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dev card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            {/* Avatar */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <span
                  className="text-white text-xl"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  T
                </span>
              </div>
              <div>
                <p className="text-white font-semibold text-base">
                  Thong Fazon
                </p>
                <p className="text-white/40 text-xs font-light">
                  Full-Stack Developer
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-xs">
                    Available for support
                  </span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {[
                "Spring Boot",
                "Next.js",
                "PostgreSQL",
                "JWT",
                "REST API",
                "TypeScript",
              ].map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 bg-white/8 border border-white/10 rounded-full text-xs text-white/50 font-mono"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Contact buttons */}
            <div className="space-y-2.5">
              <a
                href="mailto:tong24772@gmail.com"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/25 hover:bg-emerald-500/25 transition-colors group"
              >
                <Mail size={16} className="text-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/50 font-light">Email</p>
                  <p className="text-sm text-white font-medium truncate">
                    tong24772@gmail.com
                  </p>
                </div>
                <ExternalLink
                  size={12}
                  className="text-white/20 group-hover:text-white/50 transition-colors"
                />
              </a>

              <a
                href="https://github.com/ButSeavThong"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <Github size={16} className="text-white/60 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-white/40 font-light">GitHub</p>
                  <p className="text-sm text-white/80 font-medium">
                    github.com/ButSeavThong
                  </p>
                </div>
                <ExternalLink
                  size={12}
                  className="text-white/20 group-hover:text-white/50 transition-colors"
                />
              </a>
            </div>
          </div>

          {/* Right side: Project + Quick info */}
          <div className="space-y-4">
            {/* Project links */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                Project Repositories
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    label: "Backend — Spring Boot",
                    sub: "Java · Maven · Port 8080",
                    href: "https://github.com/ButSeavThong",
                    icon: <Server size={15} />,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                  },
                  {
                    label: "Frontend — Next.js",
                    sub: "TypeScript · Tailwind · Port 3000",
                    href: "https://github.com/thongfazon",
                    icon: <Globe size={15} />,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10 border-blue-500/20",
                  },
                ].map((repo) => (
                  <a
                    key={repo.label}
                    href={repo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition-opacity ${repo.bg}`}
                  >
                    <span className={repo.color}>{repo.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white/80">
                        {repo.label}
                      </p>
                      <p className="text-xs text-white/35 font-mono">
                        {repo.sub}
                      </p>
                    </div>
                    <Github size={13} className="text-white/25" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick help */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                Common Support Topics
              </p>
              <div className="space-y-2">
                {[
                  {
                    q: "CORS issues with PATCH?",
                    a: "Add PATCH to allowed methods in SecurityConfig",
                  },
                  {
                    q: "JWT role not loading?",
                    a: "Extract from scope field, not role field",
                  },
                  {
                    q: "Page logs out on refresh?",
                    a: "localStorage + cookie both must be set",
                  },
                  {
                    q: "Payroll calculation wrong?",
                    a: "Check BigDecimal RoundingMode.HALF_UP",
                  },
                ].map((item) => (
                  <div
                    key={item.q}
                    className="bg-white/4 rounded-xl px-3.5 py-2.5"
                  >
                    <p className="text-xs font-semibold text-white/70 mb-0.5">
                      {item.q}
                    </p>
                    <p className="text-xs text-white/35 font-light">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-6 py-4 border-t border-white/06 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-white/25 font-light">
            HR Payroll System · Spring Boot 3 + Next.js 14 · Built by Thong
            Fazon
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">
              System operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
