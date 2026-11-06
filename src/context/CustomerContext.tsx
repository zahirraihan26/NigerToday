'use client';

import React, { createContext, useContext } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Customer, CreateCustomerInput, UpdateCustomerInput, DashboardStats } from '../types';

interface CustomerContextType {
  customers: Customer[];
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  createCustomer: (input: CreateCustomerInput) => Promise<Customer>;
  updateCustomer: (id: string, input: UpdateCustomerInput) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  renewCustomer: (id: string, durationMonths: 3 | 6 | 12) => Promise<Customer>;
  refresh: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const store = useCustomers();
  return (
    <CustomerContext.Provider value={store}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomerStore() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomerStore must be used within CustomerProvider');
  return ctx;
}

