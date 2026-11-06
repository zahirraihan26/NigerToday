'use client';

import { useState, useEffect, useCallback } from 'react';
import { Customer, CreateCustomerInput, UpdateCustomerInput, DashboardStats } from '../types';
import * as customerService from '../services/customerService';

interface UseCustomersReturn {
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

const DEFAULT_STATS: DashboardStats = { total: 0, active: 0, expiring: 0, expired: 0, needsAttention: 0 };

export function useCustomers(): UseCustomersReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [data, dashStats] = await Promise.all([
        customerService.getCustomers(),
        customerService.getDashboardStats(),
      ]);
      setCustomers(data);
      setStats(dashStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createCustomer = useCallback(async (input: CreateCustomerInput): Promise<Customer> => {
    const created = await customerService.createCustomer(input);
    await load();
    return created;
  }, [load]);

  const updateCustomer = useCallback(async (id: string, input: UpdateCustomerInput): Promise<Customer> => {
    const updated = await customerService.updateCustomer(id, input);
    await load();
    return updated;
  }, [load]);

  const deleteCustomer = useCallback(async (id: string): Promise<void> => {
    await customerService.deleteCustomer(id);
    await load();
  }, [load]);

  const renewCustomer = useCallback(async (id: string, durationMonths: 3 | 6 | 12): Promise<Customer> => {
    const renewed = await customerService.renewCustomer(id, durationMonths);
    await load();
    return renewed;
  }, [load]);

  return {
    customers,
    stats,
    isLoading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    renewCustomer,
    refresh: load,
  };
}

