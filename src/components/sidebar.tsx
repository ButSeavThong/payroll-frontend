"use client";

import { useAppSelector, useAppDispatch } from "@/src/hooks";
import { clearAuth } from "@/src/feature/auth/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const role = useAppSelector((state) => state.auth.role);

  const handleLogout = async () => {
    dispatch(clearAuth());
    document.cookie = "auth_token=; path=/; max-age=0";
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const adminMenu = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/users", icon: Users },
    { label: "Employees", href: "/employees", icon: UserCheck },
    { label: "Attendance", href: "/attendance", icon: Clock },
    { label: "Payroll", href: "/payroll", icon: Banknote },
  ];

  const employeeMenu = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/profile", icon: UserCheck },
    { label: "My Attendance", href: "/attendance", icon: Clock },
    { label: "My Payroll", href: "/payroll", icon: Banknote },
  ];

  const menuItems = role === "ADMIN" ? adminMenu : employeeMenu;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 hover:bg-slate-100 rounded-md"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-slate-900 text-white p-6 z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold">HR Payroll</h1>
          <p className="text-sm text-slate-400">
            {role === "ADMIN" ? "Admin" : "Employee"}
          </p>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3 border-slate-700 text-black hover:bg-slate-800"
        >
          <LogOut size={20} />
          Logout
        </Button>
      </aside>
    </>
  );
}
