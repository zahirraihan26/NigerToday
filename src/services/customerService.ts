/**
 * Customer Service — Mock Implementation (Pure In-Memory JavaScript)
 *
 * This file is the single integration point between the frontend and the backend.
 * All functions return Promises to simulate async API calls.
 *
 * TO INTEGRATE A REAL API:
 *   Replace each function body with a fetch/axios call to your backend endpoint.
 *   The function signatures and return types must stay the same.
 *
 * Example replacement for getCustomers():
 *   export async function getCustomers(): Promise<Customer[]> {
 *     const res = await fetch('/api/customers');
 *     return res.json();
 *   }
 */

import {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  DashboardStats,
} from '../types';
import {
  buildCustomer,
  refreshCustomerStatus,
  formatShortDate,
} from '../lib/customerUtils';
import { MOCK_CUSTOMERS_SEED } from '../data/mockCustomers';

// ─── Pure In-Memory JavaScript State (No localStorage) ───────────────────────
let customersDb: Customer[] = MOCK_CUSTOMERS_SEED.map(refreshCustomerStatus);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Public API functions ─────────────────────────────────────────────────────

/** GET /api/customers — Fetch all customers */
export async function getCustomers(): Promise<Customer[]> {
  await delay(80);
  return customersDb.map(refreshCustomerStatus);
}

/** GET /api/customers/:id — Fetch a single customer */
export async function getCustomerById(id: string): Promise<Customer | null> {
  await delay(60);
  const found = customersDb.find((c) => c.id === id);
  return found ? refreshCustomerStatus(found) : null;
}

/** POST /api/customers — Create a new customer */
export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  await delay(120);
  const id = generateId();
  const customer = buildCustomer(input, id);
  customersDb = [customer, ...customersDb];
  return customer;
}

/** PUT /api/customers/:id — Update an existing customer */
export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput
): Promise<Customer> {
  await delay(120);
  const existing = customersDb.find((c) => c.id === id);
  if (!existing) throw new Error(`Customer ${id} not found`);

  // Merge changes
  const merged = buildCustomer(
    {
      name: input.name ?? existing.name,
      phone: input.phone ?? existing.phone,
      email: input.email ?? existing.email,
      startDate: input.startDate
        ? input.startDate
        : formatInputDateFromShort(existing.startDate),
      durationMonths: input.durationMonths ?? existing.durationMonths,
    },
    id,
    existing.renewalHistory,
    existing.createdAt
  );

  customersDb = customersDb.map((c) => (c.id === id ? merged : c));
  return merged;
}

/** DELETE /api/customers/:id — Delete a customer */
export async function deleteCustomer(id: string): Promise<void> {
  await delay(100);
  customersDb = customersDb.filter((c) => c.id !== id);
}

/** POST /api/customers/:id/renew — Renew a customer's subscription */
export async function renewCustomer(
  id: string,
  durationMonths: 3 | 6 | 12
): Promise<Customer> {
  await delay(120);
  const existing = customersDb.find((c) => c.id === id);
  if (!existing) throw new Error(`Customer ${id} not found`);

  // New start = today, new expiry = today + durationMonths
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newExpiry = new Date(today);
  newExpiry.setMonth(newExpiry.getMonth() + durationMonths);

  const newStartDateStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const renewalRecord = {
    id: generateId(),
    durationMonths,
    fromDate: formatShortDate(today),
    toDate: formatShortDate(newExpiry),
    renewedAt: new Date().toISOString(),
  };

  const renewed = buildCustomer(
    {
      name: existing.name,
      phone: existing.phone,
      email: existing.email,
      startDate: newStartDateStr,
      durationMonths,
    },
    id,
    [...existing.renewalHistory, renewalRecord],
    existing.createdAt
  );

  customersDb = customersDb.map((c) => (c.id === id ? renewed : c));
  return renewed;
}

/** GET /api/stats — Compute dashboard statistics */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(60);
  const refreshed = customersDb.map(refreshCustomerStatus);
  const active = refreshed.filter((c) => c.status === 'active').length;
  const expiring = refreshed.filter((c) => c.status === 'expiring').length;
  const expired = refreshed.filter((c) => c.status === 'expired').length;
  return {
    total: refreshed.length,
    active,
    expiring,
    expired,
    needsAttention: expiring + expired,
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatInputDateFromShort(shortDate: string): string {
  // Convert "Jul 3, 2026" -> "2026-07-03"
  const d = new Date(shortDate);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}
