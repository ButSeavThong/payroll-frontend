'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRoot() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard/dashboard page
    router.push('/dashboard/dashboard');
  }, [router]);

  return null;
}
