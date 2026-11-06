'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import { CustomerProvider } from '@/src/context/CustomerContext';
import { SidebarProvider } from '@/src/context/SidebarContext';
import { useAuth } from '@/src/context/AuthContext';

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading state while verifying auth session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, prevent rendering protected layout while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <CustomerProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex w-full max-w-full overflow-x-hidden">
            {/* Desktop & Mobile Drawer Sidebar with Suspense boundary */}
            <Suspense fallback={null}>
              <Sidebar />
            </Suspense>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 w-full md:ml-64 pb-20 md:pb-10 min-h-screen overflow-x-hidden">
              <div className="max-w-10xl mx-auto p-4 sm:p-6 md:p-8 w-full min-w-0">
                <Suspense fallback={null}>{children}</Suspense>
              </div>
            </main>

            {/* Mobile Bottom Nav */}
            <Suspense fallback={null}>
              <BottomNav />
            </Suspense>
          </div>
        </SidebarProvider>
      </CustomerProvider>
    </DashboardGuard>
  );
}
