"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarClock,
  Database,
  FolderTree,
  Globe,
  Layers3,
  Lock,
  Network,
  Plane,
  RefreshCw,
  Server,
  Shield,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stackItems = [
  {
    title: "Client UI",
    icon: <Globe className="h-4 w-4" />,
    tone: "bg-blue-50 text-blue-700 border-blue-100",
    items: ["Next.js 16", "React 19", "App Router", "Tailwind CSS 4"],
  },
  {
    title: "State & Data",
    icon: <Layers3 className="h-4 w-4" />,
    tone: "bg-violet-50 text-violet-700 border-violet-100",
    items: [
      "Redux Toolkit store",
      "RTK Query baseApi",
      "Shared cache tags",
      "Feature endpoint injection",
    ],
  },
  {
    title: "Security",
    icon: <Shield className="h-4 w-4" />,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    items: [
      "Bearer token headers",
      "401 logout handling",
      "Cookie route protection",
      "Role-aware navigation",
    ],
  },
  {
    title: "Backend Contract",
    icon: <Server className="h-4 w-4" />,
    tone: "bg-amber-50 text-amber-700 border-amber-100",
    items: [
      "Spring Boot REST API",
      "Feature-based endpoints",
      "Business rules on server",
      "Relational data persistence",
    ],
  },
];

const frontendLayers = [
  {
    title: "Route Layer",
    description: "App Router organizes public auth routes and protected dashboard routes by feature.",
    files: ["app/(auth)/login", "app/(dashboard)/dashboard", "app/(dashboard)/profile", "app/(dashboard)/system", "app/(dashboard)/architecture"],
  },
  {
    title: "Feature API Layer",
    description: "Each business area injects endpoints into one shared RTK Query API instance.",
    files: ["src/feature/auth", "src/feature/employee", "src/feature/attendance", "src/feature/payroll", "src/feature/user", "src/feature/leave"],
  },
  {
    title: "Shared Platform Layer",
    description: "Common store, hooks, base API configuration, export helpers, and reusable components.",
    files: ["src/store.ts", "src/hooks.ts", "src/lib/baseApi.ts", "src/lib/exportUtils.ts", "src/components"],
  },
];

const requestFlow = [
  "User logs in through the auth mutation.",
  "Token and role are stored in the auth slice and persisted in localStorage.",
  "Protected routes are checked by cookie presence inside proxy.ts.",
  "RTK Query requests pass through baseApi and attach Authorization when a token exists.",
  "Feature pages fetch or mutate backend resources and invalidate relevant tags.",
  "Unauthorized responses clear auth state and redirect users back to /login.",
];

const domainModules = [
  {
    name: "Auth",
    icon: <Lock className="h-4 w-4" />,
    description: "Authentication request, token persistence, logout behavior, route access.",
  },
  {
    name: "Employee",
    icon: <UserRound className="h-4 w-4" />,
    description: "Employee directory, self profile, onboarding, updates, status, and image-aware profile views.",
  },
  {
    name: "Attendance",
    icon: <CalendarClock className="h-4 w-4" />,
    description: "Check-in, check-out, individual attendance history, and admin-wide attendance review.",
  },
  {
    name: "Payroll",
    icon: <Wallet className="h-4 w-4" />,
    description: "Payroll generation, payment status changes, net salary details, export support.",
  },
  {
    name: "User",
    icon: <Users className="h-4 w-4" />,
    description: "Admin account management, enable/disable controls, and profile image upload endpoints.",
  },
  {
    name: "Leave",
    icon: <Plane className="h-4 w-4" />,
    description: "Leave requests, review workflow, balances, pending approvals, and admin notes.",
  },
];

const entities = [
  "users",
  "employees",
  "attendances",
  "payrolls",
  "leaves",
];

const apiGroups = [
  "POST /auth/login",
  "POST /auth/register",
  "GET /employees, /employees/me",
  "POST /employees, /employees/onboard",
  "PUT /employees/:id",
  "GET /attendances, /attendances/my",
  "POST /attendances/check-in, /attendances/check-out",
  "GET /payrolls, /payrolls/my",
  "POST /payrolls/generate",
  "PATCH /payrolls/:id/pay",
  "GET /users",
  "PATCH /users/:id/toggle-status",
  "PATCH /users/profile-image",
  "DELETE /users/profile-image",
  "GET /leaves, /leaves/my, /leaves/pending, /leaves/balance",
  "POST /leaves",
  "PATCH /leaves/:id/review",
];

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
      <div className="px-6 py-6 sm:px-8">{children}</div>
    </section>
  );
}

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Architecture
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
          HR Payroll System Architecture
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          This page describes how the application is structured from frontend UI
          to backend integration, using the actual patterns present in this
          repository.
        </p>
      </div>

      <Section
        eyebrow="System Overview"
        title="High-level architecture"
        description="The application follows a layered model: route-driven UI, centralized client state and data fetching, secure API communication, and backend-managed business logic with relational persistence."
      >
        <div className="grid gap-4 lg:grid-cols-4">
          {stackItems.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${item.tone}`}
              >
                {item.icon}
                {item.title}
              </div>
              <div className="mt-4 space-y-2">
                {item.items.map((line) => (
                  <div
                    key={line}
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5">
          <div className="flex min-w-[760px] items-center gap-3 text-sm">
            {[
              { label: "Browser UI", icon: <Globe className="h-4 w-4" /> },
              { label: "App Routes", icon: <FolderTree className="h-4 w-4" /> },
              { label: "Redux + RTK Query", icon: <Layers3 className="h-4 w-4" /> },
              { label: "REST API", icon: <Network className="h-4 w-4" /> },
              { label: "Database", icon: <Database className="h-4 w-4" /> },
            ].map((node, index, arr) => (
              <div key={node.label} className="flex items-center gap-3">
                <div className="flex min-w-[128px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                  {node.icon}
                  <span>{node.label}</span>
                </div>
                {index < arr.length - 1 && (
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Section
          eyebrow="Frontend Design"
          title="How the frontend is organized"
          description="The repository is feature-oriented: routes define screens, APIs define backend contracts, and shared platform files keep state and communication consistent."
        >
          <div className="space-y-3">
            {frontendLayers.map((layer) => (
              <div
                key={layer.title}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FolderTree className="h-4 w-4 text-emerald-600" />
                  {layer.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {layer.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {layer.files.map((file) => (
                    <span
                      key={file}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                    >
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Security & Flow"
          title="Request lifecycle"
          description="Authentication and data flow are centralized so every feature follows the same request pattern."
        >
          <div className="space-y-3">
            {requestFlow.map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-[1.25rem] border border-slate-200 bg-white p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-600">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Shield className="h-4 w-4 text-emerald-600" />
                Route protection
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                `proxy.ts` blocks direct access to protected pages when the auth
                cookie is missing.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <RefreshCw className="h-4 w-4 text-emerald-600" />
                Cache invalidation
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Shared tags keep employee, attendance, payroll, user, and leave
                data aligned after mutations.
              </p>
            </div>
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Section
          eyebrow="Business Modules"
          title="Domain capabilities"
          description="The application is divided into business modules that map directly to the main screens and feature APIs."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {domainModules.map((module) => (
              <div
                key={module.name}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span className="rounded-xl bg-white p-2 text-slate-600 ring-1 ring-slate-200">
                    {module.icon}
                  </span>
                  {module.name}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {module.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Backend Contract"
          title="Entities and API surface"
          description="From the frontend perspective, these are the core entities and endpoint groups the system depends on."
        >
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Core entities</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entities.map((entity) => (
                <span
                  key={entity}
                  className="rounded-full bg-white px-3 py-1 text-xs font-mono text-slate-600 ring-1 ring-slate-200"
                >
                  {entity}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Main API groups</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {apiGroups.map((group) => (
                <span
                  key={group}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600"
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
