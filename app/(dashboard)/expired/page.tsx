'use client';

import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useCustomerStore } from '@/src/context/CustomerContext';
import { Customer } from '@/src/types';
import CustomerCard from '@/components/customers/CustomerCard';
import CustomerTable from '@/components/customers/CustomerTable';
import EmptyExponded from '@/components/shared/EmptyExponded';
import RenewModal from '@/components/customers/modals/RenewModal';
import ReminderModal from '@/components/customers/modals/ReminderModal';

export default function ExpiredCustomersPage() {
  const { customers, isLoading, renewCustomer } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalType, setModalType] = useState<'renew' | 'remind' | null>(null);

  const expiredCustomers = customers.filter((customer) => {
    const isExpired = customer.status === 'expired';
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);

    return isExpired && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Expired Subscriptions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
              {isLoading ? '…' : expiredCustomers.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Customers whose subscriptions have already ended and need immediate renewal
          </p>
        </div>
      </div>

      {/* Red Alert Banner */}
      {!isLoading && expiredCustomers.length > 0 && (
        <div className="bg-red-50/90 border border-red-200/80 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-xs font-semibold text-red-800">
              {expiredCustomers.length} customer(s) have expired subscriptions. Send them a reminder to renew!
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search expired customer by name or phone..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
        />
      </div>

      {/* Expired Customers List / Table / Loading */}
      {isLoading ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 space-y-4 animate-pulse shadow-xs w-full">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-50 rounded-xl" />
            ))}
          </div>
        </div>
      ) : expiredCustomers.length === 0 ? (
        <EmptyExponded
          title="No expired subscriptions"
          description="Every customer subscription is still active."
        />
      ) : (
        <>
          {/* Mobile View Cards */}
          <div className="md:hidden space-y-2.5 w-full">
            {expiredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                showChatIcon={false}
              />
            ))}
          </div>

          {/* Desktop View Table */}
          <div className="hidden md:block w-full">
            <CustomerTable customers={expiredCustomers} />
          </div>
        </>
      )}

      {/* Modals for Quick Action */}
      {selectedCustomer && (
        <>
          <RenewModal
            customer={selectedCustomer}
            isOpen={modalType === 'renew'}
            onClose={() => {
              setModalType(null);
              setSelectedCustomer(null);
            }}
            onConfirm={async (duration) => {
              await renewCustomer(selectedCustomer.id, duration);
              setModalType(null);
              setSelectedCustomer(null);
            }}
          />
          <ReminderModal
            customer={selectedCustomer}
            isOpen={modalType === 'remind'}
            onClose={() => {
              setModalType(null);
              setSelectedCustomer(null);
            }}
          />
        </>
      )}
    </div>
  );
}
