// proxy.ts  (renamed from middleware.ts)
import { NextRequest, NextResponse } from 'next/server';

// ✅ Function must be named "proxy" not "middleware" in Next.js 16
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token    = request.cookies.get('auth_token')?.value;

  // '/' is now a public landing page — NOT in isPublicRoute (no login redirect)
  const isPublicRoute    = pathname === '/' || pathname.startsWith('/login');
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/employees') ||
    pathname.startsWith('/attendance') ||
    pathname.startsWith('/payroll')    ||
    pathname.startsWith('/users')      ||
    pathname.startsWith('/leave')      ||
    pathname.startsWith('/system')     ||
    pathname.startsWith('/architecture') ||
    pathname.startsWith('/profile');

  // Already logged in → redirect away from login (but NOT from '/')
  if (pathname.startsWith('/login') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Not logged in → redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
