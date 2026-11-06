'use client';

import React from 'react';
import { useCustomerStore } from '@/src/context/CustomerContext';
import CustomerCard from '@/components/customers/CustomerCard';
import CustomerTable from '@/components/customers/CustomerTable';
import EmptyExponded from '@/components/shared/EmptyExponded';

export default function ExpiringPage() {
  const { customers, isLoading } = useCustomerStore();

  const expiringCustomers = customers.filter(
    (c) => c.status === 'expiring' || c.status === 'expired'
  );

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full min-w-0">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Expiring &amp; Expired
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Customers whose subscriptions need renewal soon
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 space-y-4 animate-pulse shadow-xs w-full">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-slate-50 rounded-xl" />
            ))}
          </div>
        </div>
      ) : expiringCustomers.length === 0 ? (
        <EmptyExponded
          title="All caught up!"
          description="No customers are expiring or expired right now."
        />
      ) : (
        <>
          {/* Mobile View Cards */}
          <div className="md:hidden space-y-2.5 w-full">
            {expiringCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                showChatIcon={false}
              />
            ))}
          </div>

          {/* Desktop View Table */}
          <div className="hidden md:block w-full">
            <CustomerTable customers={expiringCustomers} />
          </div>
        </>
      )}
    </div>
  );
}
