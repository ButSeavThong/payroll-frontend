// src/components/sidebar.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/src/hooks";
import { clearAuth } from "@/src/feature/auth/authSlice";
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
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  { label: "System", href: "/system", icon: Cpu },
];

const employeeMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/profile", icon: UserCheck },
  { label: "My Attendance", href: "/attendance", icon: Clock },
  { label: "My Payroll", href: "/payroll", icon: Banknote },
  { label: "System", href: "/system", icon: Cpu },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const role = useAppSelector((state) => state.auth.role);
  const username = useAppSelector((state) => state.auth.username);

  const menuItems = role === "ADMIN" ? adminMenu : employeeMenu;
  const isAdmin = role === "ADMIN";

  const handleLogout = () => {
    logout(dispatch, router);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Brand */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">HR Payroll</span>
        </div>
      </div>

      {/* User badge */}
      <div className="border-b border-gray-200 px-5 py-5">
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(username ?? "U")[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-800 truncate">
              {username ?? "User"}
            </div>
            <div
              className={`text-xs font-bold uppercase tracking-wider ${
                isAdmin ? "text-blue-600" : "text-blue-500"
              }`}
            >
              {role ?? "Employee"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 px-3 pb-3 mb-2">
          Navigation
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname?.includes(item.href.split("/").pop() || "") ||
            pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all relative ${
                isActive
                  ? "bg-blue-50 border border-blue-200 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 border border-transparent"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r" />
              )}
              <Icon
                size={20}
                className={isActive ? "text-blue-600" : "text-gray-600"}
              />
              <span className={`text-base font-${isActive ? "600" : "500"}`}>
                {item.label}
              </span>
              {isActive && (
                <ChevronRight size={16} className="ml-auto text-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 px-4 py-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all text-base font-medium"
        >
          <LogOut size={20} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-btn fixed top-4 left-4 z-50 p-2 bg-white border border-gray-300 rounded-lg hidden items-center justify-center"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={24} className="text-gray-800" />
        ) : (
          <Menu size={24} className="text-gray-800" />
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Desktop sidebar */}
      <aside className="desktop-sidebar w-64 flex-shrink-0 h-screen sticky top-0 border-r border-gray-200">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`mobile-sidebar fixed top-0 left-0 h-screen w-72 z-45 border-r border-gray-200 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar { display: none !important; }
        }
      `}</style>
    </>
  );
}
