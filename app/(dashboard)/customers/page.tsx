'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import { SubscriptionStatus } from './../../../src/types';
import { useCustomerStore } from '@/src/context/CustomerContext';
import CustomerCard from '@/components/customers/CustomerCard';
import CustomerTable from '@/components/customers/CustomerTable';
import EmptyState from '@/components/shared/EmptyState';

type FilterTab = 'all' | SubscriptionStatus;

export default function CustomersPage() {
  const { customers, stats, isLoading } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const tabs: {
    label: string;
    shortLabel?: string;
    value: FilterTab;
    count: number;
  }[] = [
    { label: 'All', value: 'all', count: stats.total },
    { label: 'Active', value: 'active', count: stats.active },
    {
      label: 'Expiring soon',
      shortLabel: 'Expiring',
      value: 'expiring',
      count: stats.expiring,
    },
    { label: 'Expired', value: 'expired', count: stats.expired },
  ];

  const filteredCustomers = customers.filter((customer) => {
    const matchesTab = activeTab === 'all' || customer.status === activeTab;
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full min-w-0">
      {/* ── Top Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Customers
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isLoading ? '…' : `${stats.total} customers`}
          </p>
        </div>

        {/* Mobile [+] Button */}
        <Link
          href="/customers/add"
          className="sm:hidden w-10 h-10 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-2xl flex items-center justify-center shadow-xs transition shrink-0"
          aria-label="Add customer"
        >
          <Plus className="w-5 h-5" />
        </Link>

        {/* Desktop Search & Add Customer Button */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone or email"
              className="w-56 lg:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition shadow-2xs"
            />
          </div>

          <Link
            href="/customers/add"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Link>
        </div>
      </div>

      {/* ── Mobile-Only Search Input ─────────────────────────── */}
      <div className="sm:hidden relative w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search name, phone or email"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition shadow-2xs"
        />
      </div>

      {/* ── Filter Tabs Bar (4 Columns on Mobile, Flex on Desktop) ── */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 sm:flex sm:items-center sm:w-auto w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 sm:px-4 rounded-full text-xs font-medium sm:font-semibold transition cursor-pointer whitespace-nowrap text-center ${
                isActive
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              <span>
                <span className="sm:hidden">{tab.shortLabel || tab.label}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
              <span
                className={`hidden sm:inline text-xs ${
                  isActive
                    ? 'text-indigo-100 font-medium'
                    : 'text-slate-400 font-normal'
                }`}
              >
                {isLoading ? '…' : tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 space-y-4 animate-pulse shadow-xs w-full">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-2 min-w-0">
                    <div className="h-3.5 w-28 sm:w-32 bg-slate-200 rounded" />
                    <div className="h-2.5 w-32 sm:w-40 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Try adjusting your search or filter, or add a new customer to get started."
          showAddButton
        />
      ) : (
        <>
          {/* Mobile Cards View (Exactly matches mockup) */}
          <div className="md:hidden space-y-2.5 w-full">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                showChatIcon={false}
              />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block w-full">
            <CustomerTable customers={filteredCustomers} />
          </div>
        </>
      )}
    </div>
  );
}
