// app/page.tsx — Public landing / welcome page
"use client";

import Link from "next/link";
import { useAppSelector } from "@/src/hooks";
import {
  Users,
  Clock,
  Banknote,
  CalendarDays,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Building2,
  CheckCircle2,
} from "lucide-react";

// ─── Feature cards data ───────────────────────────────────────────────────────

const features = [
  {
    icon: Users,
    title: "Employee Management",
    desc: "Onboard employees, manage profiles, and control access with role-based permissions.",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    desc: "Real-time check-in and check-out with overtime calculation in Asia/Phnom_Penh timezone.",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Banknote,
    title: "Payroll Generation",
    desc: "Auto-compute net salary with overtime, unpaid leave deductions, and 10% income tax.",
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: CalendarDays,
    title: "Leave Management",
    desc: "Annual, sick, and unpaid leave requests with balance tracking and admin approval flow.",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: BarChart3,
    title: "Dashboard & Analytics",
    desc: "Visual charts for attendance trends, payroll payout history, and workforce summaries.",
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Role-Based",
    desc: "RS256 JWT authentication with separate views and permissions for Admin and Employee roles.",
    color: "from-rose-500 to-rose-600",
    bg: "bg-rose-50",
  },
];

const highlights = [
  "RS256 JWT Authentication",
  "Cloudinary Profile Images",
  "Excel & PDF Payslip Export",
  "Cambodia Timezone Support",
  "Real-time Payroll Calculation",
  "Leave Balance Management",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const role = useAppSelector((s) => s.auth.role);
  const isLoggedIn = !!role;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-sans">
      {/* ── Navbar ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              HR<span className="text-indigo-600">Payroll</span>
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm shadow-indigo-200 hover:shadow-indigo-300"
              >
                Go to Dashboard
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm shadow-indigo-200 hover:shadow-indigo-300"
              >
                Login to System
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 text-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-indigo-200/40 via-blue-100/30 to-violet-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Spring Boot + Next.js · PostgreSQL · Deployed on Render &amp; Vercel
          </span>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
            HR Payroll
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              {" "}Management{" "}
            </span>
            System
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
            A full-stack HR platform for managing employees, tracking attendance,
            processing payroll, and approving leave — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-base shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/50 transition-all"
              >
                Open Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-base shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/50 transition-all"
                >
                  Login to System
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold text-base transition-all shadow-sm"
                >
                  Explore Features
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Highlights strip ─────────────────────────────────────────────────── */}
      <section className="py-6 bg-slate-900 overflow-hidden">
        <div className="flex items-center gap-0">
          <div className="flex items-center gap-10 animate-none flex-wrap justify-center w-full px-8 py-2">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 flex-shrink-0">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-slate-300 text-sm font-medium whitespace-nowrap">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything HR needs, in one system
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Purpose-built for growing teams who need reliable, automated HR workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-5`}>
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                      <Icon size={15} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Salary formula card ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Transparent Payroll Calculation
          </h2>
          <p className="text-slate-400 mb-10">
            Every payslip is calculated using a clear, consistent formula.
          </p>
          <div className="bg-slate-800 rounded-2xl p-6 text-left font-mono text-sm leading-8 overflow-x-auto">
            <p>
              <span className="text-slate-500">// Hourly &amp; Daily rates</span>
            </p>
            <p>
              <span className="text-blue-400">hourlyRate</span>
              <span className="text-white/60"> = baseSalary ÷ 160</span>
            </p>
            <p>
              <span className="text-blue-400">dailyRate</span>
              <span className="text-white/60"> = hourlyRate × 8</span>
            </p>
            <p className="mt-2">
              <span className="text-slate-500">// Additions &amp; Deductions</span>
            </p>
            <p>
              <span className="text-emerald-400">overtimePay</span>
              <span className="text-white/60"> = overtimeHours × hourlyRate × 1.5</span>
            </p>
            <p>
              <span className="text-red-400">unpaidDeduction</span>
              <span className="text-white/60"> = unpaidDays × dailyRate</span>
            </p>
            <p className="mt-2">
              <span className="text-slate-500">// Final calculation</span>
            </p>
            <p>
              <span className="text-white/80">gross</span>
              <span className="text-white/60"> = baseSalary + overtimePay − unpaidDeduction</span>
            </p>
            <p>
              <span className="text-orange-400">tax</span>
              <span className="text-white/60"> = gross × 10%</span>
            </p>
            <p>
              <span className="text-emerald-400 font-bold">netSalary</span>
              <span className="text-white/60"> = gross − tax</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-300/40">
            <Building2 size={28} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Sign in to access your HR dashboard and manage your team effortlessly.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-base shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/60 transition-all"
          >
            Login to System
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
              <Building2 size={12} className="text-white" />
            </div>
            <span className="font-semibold text-slate-600">HR Payroll System</span>
          </div>
          <span>Built by <span className="text-indigo-600 font-medium">Thong Fazon</span> · Spring Boot + Next.js + PostgreSQL</span>
          <span>© {new Date().getFullYear()} HR Payroll Management</span>
        </div>
      </footer>
    </div>
  );
}
