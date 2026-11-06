'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Users, Clock, Menu } from 'lucide-react';
import { useSidebar } from '@/src/context/SidebarContext';

const mobileNavItems = [
  { name: 'Dashboard', href: '/', icon: LayoutGrid },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Expiring', href: '/expiring', icon: Clock },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  const isMoreActive =
    isOpen ||
    pathname === '/settings' ||
    pathname === '/expired' ||
    pathname === '/reminders';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-40 shadow-lg">
      {mobileNavItems.map((item) => {
        const isActive =
          !isOpen &&
          (pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href)));
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition ${
              isActive
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-medium">{item.name}</span>
          </Link>
        );
      })}

      {/* "More" button to toggle slide-over Sidebar */}
      <button
        type="button"
        onClick={toggle}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition cursor-pointer ${
          isMoreActive
            ? 'text-indigo-600 font-semibold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[11px] font-medium">More</span>
      </button>
    </nav>
  );
}
