'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Plus,
  Users,
  Clock,
  Check,
  ArrowRight,
  Search,
  MessageCircle,
} from 'lucide-react';
import { useCustomerStore } from '@/src/context/CustomerContext';
import { useAuth } from '@/src/context/AuthContext';
import { Customer } from '@/src/types';
import ReminderModal from '@/components/customers/modals/ReminderModal';

export default function DashboardPage() {
  const router = useRouter();
  const { customers, stats, isLoading } = useCustomerStore();
  const { user } = useAuth();
  const [reminderCustomer, setReminderCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AO';

  const [currentDate, setCurrentDate] = useState({
    short: 'Mon, Oct 5',
    long: 'Monday, October 5, 2026',
  });

  useEffect(() => {
    const now = new Date();
    // Default to the designer's reference date or live date formatted cleanly
    setCurrentDate({
      short: now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      long: now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    });
  }, []);

  const expiringCustomers = customers.filter((c) => c.status === 'expiring');
  const expiredCustomers = customers.filter((c) => c.status === 'expired');

  // On mobile, "Needs your attention" displays all expired and expiring customers
  const attentionCustomers = customers.filter((c) => c.status !== 'active');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-8 w-44 bg-slate-200 rounded-lg" />
            <div className="h-3 w-56 bg-slate-100 rounded" />
          </div>
          <div className="hidden sm:flex gap-3">
            <div className="h-10 w-64 bg-slate-100 rounded-xl" />
            <div className="h-10 w-32 bg-slate-200 rounded-xl" />
          </div>
        </div>

        {/* Warning Banner Skeleton */}
        <div className="h-14 bg-amber-50/80 border border-amber-100 rounded-2xl" />

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-xs"
            >
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-8 w-14 bg-slate-200 rounded" />
              <div className="h-2.5 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>

        {/* Bottom Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="h-5 w-32 bg-slate-200 rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-50 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="h-5 w-28 bg-slate-200 rounded" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-slate-50 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ── Top Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            {/* Mobile Date (e.g. Mon, Oct 5) */}
            <p className="sm:hidden text-xs font-medium text-slate-400">
              {currentDate.short}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            {/* Desktop Subtitle */}
            <p className="hidden sm:block text-xs text-slate-400 mt-1">
              {currentDate.long} · Here is who needs your attention today
            </p>
          </div>

          {/* Mobile Profile Avatar */}
          <div className="sm:hidden w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center text-xs font-bold shrink-0">
            {userInitials}
          </div>
        </div>

        {/* Desktop Search & Add Customer Button */}
        <div className="hidden sm:flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone or email"
              className="w-64 pl-9 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4B44F6] transition shadow-2xs"
            />
          </form>

          <Link
            href="/customers/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Link>
        </div>
      </div>

      {/* ── Warning Banner ────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309]">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
          <p className="text-xs font-medium">
            <span className="font-semibold">
              {stats.needsAttention} customers need your attention
            </span>
            <span className="hidden sm:inline">
              {' '}
              — {stats.expiring} expire within 10 days and {stats.expired} have already expired.
            </span>
          </p>
        </div>

        <Link
          href="/expiring"
          className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-white border border-amber-200/80 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition shrink-0 shadow-2xs"
        >
          Review now
        </Link>
      </div>

      {/* ── Desktop Stat Cards (4 Cards) ──────────────────────── */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {/* 1. Total customers */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-500">
              Total customers
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-[11px] text-slate-400">All saved customers</p>
        </div>

        {/* 2. Active */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-500">Active</span>
          </div>
          <p className="text-3xl font-bold text-[#16A34A]">{stats.active}</p>
          <p className="text-[11px] text-slate-400">More than 10 days left</p>
        </div>

        {/* 3. Expiring soon */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-500">
              Expiring soon
            </span>
          </div>
          <p className="text-3xl font-bold text-[#D97706]">{stats.expiring}</p>
          <p className="text-[11px] text-slate-400">Within the next 10 days</p>
        </div>

        {/* 4. Expired */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-500">Expired</span>
          </div>
          <p className="text-3xl font-bold text-[#DC2626]">{stats.expired}</p>
          <p className="text-[11px] text-slate-400">Follow up to renew</p>
        </div>
      </div>

      {/* ── Mobile Stat Cards (3 Colored Columns) ─────────────── */}
      <div className="grid grid-cols-3 gap-3 md:hidden">
        {/* Card 1: Expired (Red) */}
        <div className="p-3.5 rounded-2xl bg-[#FEE2E2] flex flex-col justify-between">
          <span className="text-2xl font-bold text-[#DC2626]">{stats.expired}</span>
          <span className="text-xs font-medium text-[#DC2626] mt-1">
            Expired
          </span>
        </div>

        {/* Card 2: Expiring (Amber) */}
        <div className="p-3.5 rounded-2xl bg-[#FEF3C7] flex flex-col justify-between">
          <span className="text-2xl font-bold text-[#D97706]">
            {stats.expiring}
          </span>
          <span className="text-xs font-medium text-[#B45309] mt-1">
            Expiring
          </span>
        </div>

        {/* Card 3: Active (Green) */}
        <div className="p-3.5 rounded-2xl bg-[#DCFCE7] flex flex-col justify-between">
          <span className="text-2xl font-bold text-[#16A34A]">
            {stats.active}
          </span>
          <span className="text-xs font-medium text-[#15803D] mt-1">
            Active
          </span>
        </div>
      </div>

      {/* ── Mobile Only: "Needs your attention" List ──────────── */}
      <div className="md:hidden space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Needs your attention
          </h2>
          <Link
            href="/customers"
            className="text-xs font-semibold text-[#4F46E5] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="space-y-2.5">
          {attentionCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white border border-slate-200/70 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-semibold text-xs flex items-center justify-center shrink-0">
                  {customer.initials}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-semibold text-sm text-slate-900 hover:text-[#4F46E5] transition block truncate"
                  >
                    {customer.name}
                  </Link>
                  <div className="mt-1">
                    {customer.status === 'expired' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEE2E2] text-[#DC2626]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                        {customer.daysText}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                        {customer.daysText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Speech bubble / message action button */}
              <button
                type="button"
                onClick={() => setReminderCustomer(customer)}
                className="w-10 h-10 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-slate-700 flex items-center justify-center shrink-0 cursor-pointer transition shadow-2xs"
                aria-label={`Send reminder to ${customer.name}`}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          ))}

          {attentionCustomers.length === 0 && (
            <div className="bg-white border border-slate-200/70 rounded-2xl p-6 text-center text-xs text-slate-400">
              No customers need attention right now
            </div>
          )}
        </div>
      </div>

      {/* ── Desktop Only: Expiring Soon Table & Recently Expired ── */}
      <div className="hidden md:grid md:grid-cols-3 gap-5 items-start">
        {/* Left Card: Expiring Soon Table */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-5 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Expiring Soon
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Sorted by days left</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-slate-100 bg-[#F8FAFC] text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-5">Customer</th>
                  <th className="py-2.5 px-4">Expires</th>
                  <th className="py-2.5 px-4">Remaining</th>
                  <th className="py-2.5 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {expiringCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    <td className="py-3.5 px-5">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-semibold text-xs flex items-center justify-center shrink-0">
                          {customer.initials}
                        </div>
                        <span className="font-semibold text-slate-900 hover:text-[#4F46E5] transition">
                          {customer.name}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {customer.expiresDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                        {customer.daysText}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        type="button"
                        onClick={() => setReminderCustomer(customer)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF2FF] hover:bg-indigo-100 text-[#4F46E5] text-xs font-semibold transition cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                ))}
                {expiringCustomers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                      No customers expiring soon
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Recently Expired */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recently Expired
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Renew or follow up</p>
          </div>

          <div className="divide-y divide-slate-100 mt-3">
            {expiredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="py-3.5 flex items-center justify-between gap-3"
              >
                <Link
                  href={`/customers/${customer.id}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-semibold text-xs flex items-center justify-center shrink-0">
                    {customer.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {customer.name}
                    </p>
                    <p className="text-[11px] text-[#DC2626] mt-0.5">
                      {customer.daysText}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setReminderCustomer(customer)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shrink-0 cursor-pointer"
                >
                  Message
                </button>
              </div>
            ))}
            {expiredCustomers.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">
                No recently expired customers
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-1">
            <Link
              href="/expired"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:underline"
            >
              View all expired <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Reminder Modal ────────────────────────────────────── */}
      {reminderCustomer && (
        <ReminderModal
          customer={reminderCustomer}
          isOpen={!!reminderCustomer}
          onClose={() => setReminderCustomer(null)}
        />
      )}
    </div>
  );
}
