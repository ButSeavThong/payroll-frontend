// src/components/sidebar.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/src/hooks";
import { clearAuth } from "@/src/feature/auth/authSlice";
import { useGetMyProfileQuery } from "@/src/feature/employee/employeeApi";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Clock,
  Banknote,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Building2,
  Cpu,
  CalendarDays,
} from "lucide-react";
import { Avatar } from "./profile-image-upload";

// ─── Logout helper ────────────────────────────────────────────────────────────

function logout(
  dispatch: ReturnType<typeof useAppDispatch>,
  router: ReturnType<typeof useRouter>,
) {
  dispatch(clearAuth());
  document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
  toast.success("Logged out successfully");
  router.push("/login");
}

// ─── Menu config ──────────────────────────────────────────────────────────────

const adminMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "Employees", href: "/employees", icon: UserCheck },
  { label: "Attendance", href: "/attendance", icon: Clock },
  { label: "Payroll", href: "/payroll", icon: Banknote },
  { label: "Leave", href: "/leave", icon: CalendarDays },
  { label: "System", href: "/system", icon: Cpu },
];

const employeeMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/profile", icon: UserCheck },
  { label: "My Attendance", href: "/attendance", icon: Clock },
  { label: "My Payroll", href: "/payroll", icon: Banknote },
  { label: "My Leave", href: "/leave", icon: CalendarDays },
  { label: "System", href: "/system", icon: Cpu },
];

// ✅ Defined OUTSIDE components — stable reference, no re-creation on render
const QUERY_OPTIONS = {
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
} as const;

// ─── SidebarContent ───────────────────────────────────────────────────────────
// ✅ CRITICAL: Defined OUTSIDE Sidebar so React never unmounts/remounts it.
//    If defined inside Sidebar, React sees a new component type every render
//    and remounts it — causing RTK Query hooks inside to refetch every time.

interface SidebarContentProps {
  username: string;
  role: string | null;
  isAdmin: boolean;
  pathname: string | null;
  onLinkClick: () => void;
  onLogout: () => void;
}

function SidebarContent({
  username,
  role,
  isAdmin,
  pathname,
  onLinkClick,
  onLogout,
}: SidebarContentProps) {
  const menuItems = isAdmin ? adminMenu : employeeMenu;

  //  QUERY_OPTIONS prevents refetch on focus / reconnect / mount
  const { data: profile } = useGetMyProfileQuery(undefined, QUERY_OPTIONS);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 px-6 py-5">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">HR Payroll</span>
        </Link>
      </div>

      {/* ── User Badge ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
          {/* ✅ Avatar — shows profile image or initial fallback */}
          <Avatar
            profileImage={profile?.profileImage}
            name={username}
            size="md"
          />

          {/* Name + Role */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {username}
            </p>
            <span
              className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                isAdmin
                  ? "bg-purple-100 text-purple-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {role ?? "EMPLOYEE"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="flex-1 px-4 py-5 overflow-y-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 pb-3">
          Navigation
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all ${
                isActive
                  ? "bg-blue-50 border border-blue-200 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 border border-transparent hover:text-gray-900"
              }`}
            >
              {/* Active left bar */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r" />
              )}

              <Icon
                size={18}
                className={isActive ? "text-blue-600" : "text-gray-500"}
              />

              <span
                className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}
              >
                {item.label}
              </span>

              {isActive && (
                <ChevronRight size={14} className="ml-auto text-blue-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ─────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 px-4 py-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const role = useAppSelector((s) => s.auth.role);
  const username = useAppSelector((s) => s.auth.username) ?? "User";

  const isAdmin = role === "ADMIN";

  const handleLogout = () => {
    logout(dispatch, router);
    setIsOpen(false);
  };

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-btn fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hidden items-center justify-center"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={22} className="text-gray-800" />
        ) : (
          <Menu size={22} className="text-gray-800" />
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Desktop sidebar */}
      <aside className="desktop-sidebar w-64 flex-shrink-0 h-screen sticky top-0 border-r border-gray-200 shadow-sm">
        <SidebarContent
          username={username}
          role={role}
          isAdmin={isAdmin}
          pathname={pathname}
          onLinkClick={handleLinkClick}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`mobile-sidebar fixed top-0 left-0 h-screen w-72 z-45 bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          username={username}
          role={role}
          isAdmin={isAdmin}
          pathname={pathname}
          onLinkClick={handleLinkClick}
          onLogout={handleLogout}
        />
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar  { display: none !important; }
        }
      `}</style>
    </>
  );
}
