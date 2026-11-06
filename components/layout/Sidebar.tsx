'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  Clock,
  AlertTriangle,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useSidebar } from '@/src/context/SidebarContext';
import { useCustomerStore } from '@/src/context/CustomerContext';
import { useAuth } from '@/src/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const { stats } = useCustomerStore();
  const { user, logout } = useAuth();

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AO';

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutGrid },
    { name: 'Customers', href: '/customers', icon: Users },
    {
      name: 'Expiring',
      href: '/expiring',
      icon: Clock,
      badge: stats.expiring || 0,
      badgeColor: 'bg-[#D97706] text-white',
    },
    {
      name: 'Expired',
      href: '/expired',
      icon: AlertTriangle,
      badge: stats.expired || 0,
      badgeColor: 'bg-[#DC2626] text-white',
    },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <aside
        className={`flex flex-col w-72 sm:w-80 md:w-60 bg-[#F4F5FA] border-r border-slate-200/70 min-h-screen px-4 py-6 fixed left-0 top-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 md:shadow-none'
        }`}
      >
        {/* Brand Logo & Mobile Close Button */}
        <div className="flex items-center justify-between px-2 mb-7">
          <Link href="/" onClick={close} className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={95}
              height={55}
              priority
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain"
            />
          </Link>

          {/* Close 'X' Button on Mobile */}
          <button
            type="button"
            onClick={close}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={close}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#4B44F6] text-white shadow-xs'
                    : 'text-[#64748B] hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-[#64748B]'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-white text-[#4B44F6]' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Area */}
        <div className="pt-4 mt-auto border-t border-slate-200/60">
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center text-xs font-bold shrink-0">
                {userInitials}
              </div>
              <div className="leading-tight min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {user?.name || 'Alex Owner'}
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                  {user?.role === 'owner' ? 'Business owner' : 'User'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                close();
                logout();
              }}
              className="p-1.5 text-[#64748B] hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
