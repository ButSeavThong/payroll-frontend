"use client";

import type { ReactNode } from "react";
import { useAppSelector } from "@/src/hooks";
import {
  BadgeCheck,
  Banknote,
  CalendarCheck2,
  CalendarDays,
  Clock3,
  FileSpreadsheet,
  Shield,
  UserCheck,
  UserCog,
  Users,
  WalletCards,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type GuideStep = {
  title: string;
  description: string;
  tips?: string[];
};

type GuideSection = {
  title: string;
  description: string;
  icon: ReactNode;
  steps: GuideStep[];
};

const employeeSections: GuideSection[] = [
  {
    title: "Manage Your Profile",
    description: "Keep your account identity up to date and make your profile easier to recognize.",
    icon: <UserCheck className="h-5 w-5" />,
    steps: [
      {
        title: "Open My Profile",
        description: "Use the left sidebar and go to `My Profile` to review your name, email, job title, and department.",
      },
      {
        title: "Upload a profile photo",
        description: "In the photo section, click upload or drag in an image. The system will use your default avatar until a real image is added.",
      },
      {
        title: "Review HR-managed details",
        description: "Your department, position, salary, and hire date are controlled by HR/Admin. If something is incorrect, contact them instead of expecting to edit it yourself.",
      },
    ],
  },
  {
    title: "Track Attendance",
    description: "Use the attendance page as your daily timekeeping area.",
    icon: <Clock3 className="h-5 w-5" />,
    steps: [
      {
        title: "Check in at the start of work",
        description: "Go to `My Attendance` and use the check-in action once your workday begins.",
      },
      {
        title: "Check out when work is complete",
        description: "Return to the same page and record your check-out so your total hours can be calculated correctly.",
      },
      {
        title: "Review your history",
        description: "Use the attendance table to confirm your dates, working hours, and overtime records.",
      },
    ],
  },
  {
    title: "View Payroll",
    description: "Use payroll to understand your salary calculations and payment status.",
    icon: <WalletCards className="h-5 w-5" />,
    steps: [
      {
        title: "Open My Payroll",
        description: "Visit `My Payroll` from the sidebar to see generated payroll records by month.",
      },
      {
        title: "Check salary components",
        description: "Review base salary, overtime pay, deductions, tax, and net salary to understand how your total was produced.",
      },
      {
        title: "Confirm payment status",
        description: "Use the status badge to see whether payroll is still generated or already marked as paid.",
      },
    ],
  },
  {
    title: "Request Leave",
    description: "Submit leave requests and monitor approvals from one place.",
    icon: <CalendarDays className="h-5 w-5" />,
    steps: [
      {
        title: "Open My Leave",
        description: "Go to `My Leave` to request annual, sick, or unpaid leave.",
      },
      {
        title: "Complete the request form carefully",
        description: "Choose leave type, start date, end date, and include a reason when needed.",
      },
      {
        title: "Track approval results",
        description: "Return to the page to see whether the request is pending, approved, or rejected, and review any admin note.",
      },
    ],
  },
];

const adminSections: GuideSection[] = [
  {
    title: "Manage User Accounts",
    description: "Create and control who can log into the system.",
    icon: <Users className="h-5 w-5" />,
    steps: [
      {
        title: "Create a user account",
        description: "Open `Users` and create a login account with the required identity fields.",
      },
      {
        title: "Enable or disable user access",
        description: "Use the user status control when someone should temporarily lose or regain access to the platform.",
      },
      {
        title: "Link account usage to employee records",
        description: "After a user exists, continue to the employee area so that the HR profile is connected properly.",
      },
    ],
  },
  {
    title: "Create and Maintain Employee Profiles",
    description: "Build the HR profile that powers attendance, leave, and payroll.",
    icon: <UserCog className="h-5 w-5" />,
    steps: [
      {
        title: "Use employee onboarding",
        description: "From `Employees`, create a full employee profile or onboard a new staff member in one flow if your process supports it.",
      },
      {
        title: "Update department and position",
        description: "Keep employee department, position, base salary, and hire date accurate because these fields affect reporting and payroll.",
      },
      {
        title: "Monitor active status",
        description: "Employee profile activity status should reflect whether the person is currently active in the organization.",
      },
    ],
  },
  {
    title: "Review Attendance",
    description: "Use attendance records to verify presence, working hours, and overtime.",
    icon: <CalendarCheck2 className="h-5 w-5" />,
    steps: [
      {
        title: "Open Attendance",
        description: "Go to `Attendance` to review all staff records instead of only your own.",
      },
      {
        title: "Check daily records",
        description: "Look for missing check-out entries, unusual hour totals, or overtime patterns that need attention.",
      },
      {
        title: "Use records before payroll generation",
        description: "Confirm attendance quality before generating payroll so salary and overtime calculations stay reliable.",
      },
    ],
  },
  {
    title: "Generate and Pay Payroll",
    description: "Payroll is one of the main admin workflows and should be done in order.",
    icon: <Banknote className="h-5 w-5" />,
    steps: [
      {
        title: "Generate payroll for the target month",
        description: "Open `Payroll`, choose the month, and run payroll generation for the selected employee or group.",
      },
      {
        title: "Review calculation output",
        description: "Check base salary, overtime, leave deductions, tax, and net salary before confirming payment steps.",
        tips: [
          "Review unpaid leave deductions carefully.",
          "Check that overtime hours look reasonable before finalizing.",
        ],
      },
      {
        title: "Mark payroll as paid",
        description: "After disbursement is complete, use the pay action so the record status moves from generated to paid.",
      },
      {
        title: "Export reports when needed",
        description: "Use the export tools for Excel or PDF reporting during reviews, approvals, or presentations.",
      },
    ],
  },
  {
    title: "Process Leave Requests",
    description: "Leave review belongs to Admin or HR and should be handled consistently.",
    icon: <BadgeCheck className="h-5 w-5" />,
    steps: [
      {
        title: "Open the Leave page",
        description: "Use `Leave` to review all requests and focus on pending items first.",
      },
      {
        title: "Approve or reject with context",
        description: "When making a decision, include a clear admin note if the employee needs explanation or follow-up.",
      },
      {
        title: "Watch leave balance impact",
        description: "Approved requests should align with the employee's available balance and company policy.",
      },
    ],
  },
];

const quickStart = [
  "Login with your assigned account.",
  "Use the sidebar to open the pages available for your role.",
  "Employees mainly work in Profile, Attendance, Payroll, and Leave.",
  "Admin/HR users additionally manage Users, Employees, all Attendance, and Payroll generation.",
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function GuideCard({ section }: { section: GuideSection }) {
  return (
    <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-700">
              {section.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {section.description}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="space-y-4">
            {section.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.25rem] border border-slate-200 bg-white p-4"
              >
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>
                    {step.tips && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {step.tips.map((tip) => (
                          <span
                            key={tip}
                            className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                          >
                            {tip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SystemPage() {
  const role = useAppSelector((state) => state.auth.role);
  const isAdmin = role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          User Guide
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
          How To Use The HR Payroll System
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          This guide explains the main workflows for both employees and
          Admin/HR users. Use it for onboarding, presentation, and day-to-day
          reference.
        </p>
      </div>

      <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <SectionHeader
            eyebrow="Getting Started"
            title="Start with your role"
            description="The system shows different pages depending on whether you are an employee or an Admin/HR user. Follow the track that matches your account."
          />
          <div className="grid gap-4 px-6 py-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              {quickStart.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_55%,#ecfdf5_100%)] p-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                <Shield className="h-3.5 w-3.5" />
                Current Role
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">
                {isAdmin ? "Admin / HR" : "Employee"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isAdmin
                  ? "Your account can manage users, employees, attendance review, leave approval, and payroll generation."
                  : "Your account focuses on self-service tasks like profile updates, attendance, payroll viewing, and leave requests."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Employee Guide
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Main tasks for employees
          </h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {employeeSections.map((section) => (
            <GuideCard key={section.title} section={section} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Admin / HR Guide
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Main tasks for Admin and HR users
          </h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {adminSections.map((section) => (
            <GuideCard key={section.title} section={section} />
          ))}
        </div>
      </section>

      <Card className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 shadow-sm">
        <CardContent className="px-6 py-5 sm:px-8">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-700">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Presentation tip
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                If you are presenting the system, walk through the employee flow
                first because it is easier to understand, then switch to the
                Admin/HR guide to show how the organization manages records,
                approvals, and payroll.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
