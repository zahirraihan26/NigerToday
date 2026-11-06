'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CustomerForm from '@/components/customers/CustomerForm';
import { useCustomerStore } from '@/src/context/CustomerContext';
import { CreateCustomerInput, UpdateCustomerInput } from '@/src/types';

export default function AddCustomerPage() {
  const router = useRouter();
  const { createCustomer } = useCustomerStore();

  const handleCreate = async (input: CreateCustomerInput | UpdateCustomerInput) => {
    await createCustomer(input as CreateCustomerInput);
    router.push('/customers');
  };

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B44F6] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Customers
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add Customer</h1>
        <p className="text-xs text-slate-400 mt-0.5">Fill in the details to add a new customer</p>
      </div>
      <CustomerForm onSubmit={handleCreate} />
    </div>
  );
}
