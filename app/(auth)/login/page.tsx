// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/src/feature/auth/authApi";
import { useAppDispatch } from "@/src/hooks";
import { setAuth } from "@/src/feature/auth/authSlice";
import { decodeJwt, extractRole } from "@/src/lib/jwtUtils";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Building2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email, password }).unwrap();
      const token = response.accessToken;
      const payload = decodeJwt(token);
      const role = extractRole(token);

      dispatch(setAuth({ token, role, username: payload.sub }));

      document.cookie = [
        `auth_token=${token}`,
        "path=/",
        "max-age=604800",
        "SameSite=Lax",
      ].join("; ");

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-12 bg-gradient-to-b from-white to-gray-50 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 opacity-40 bg-gradient-radial from-blue-100 to-transparent pointer-events-none" />

      {/* Form card */}
      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Secure Portal
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Welcome
            <br />
            back.
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to access your HR dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Email address
            </label>
            <div className="relative group">
              <input
                type="email"
                className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 group-hover:shadow-md"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 group-hover:shadow-md pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-4 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin group-hover:animate-spin"
                />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500 font-medium">
            Protected by JWT authentication · HR Payroll System
          </p>
        </div>
      </div>

      {/* Mobile-only brand */}
      <div className="lg:hidden absolute top-6 left-6 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-gray-800">HR Payroll</span>
        </div>
      </div>
    </div>
  );
}
