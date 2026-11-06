import { Customer, SubscriptionStatus, RenewalRecord } from '../types';

// Parse "YYYY-MM-DD" safely without timezone shift
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

// Format Date to "Jul 3, 2026"
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format Date to "YYYY-MM-DD"
export function formatInputDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Parse "Jul 3, 2026" back to Date
export function parseShortDate(dateStr: string): Date {
  return new Date(dateStr);
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('');
}

// Compute status and days info from today's date
export function computeStatus(expiresDateStr: string): {
  status: SubscriptionStatus;
  daysText: string;
  daysRemaining: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expires = parseShortDate(expiresDateStr);
  expires.setHours(0, 0, 0, 0);

  const diffMs = expires.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const ago = Math.abs(diffDays);
    return {
      status: 'expired',
      daysText: ago === 1 ? 'Expired 1 day ago' : `Expired ${ago} days ago`,
      daysRemaining: 0,
    };
  } else if (diffDays === 0) {
    return { status: 'expiring', daysText: 'Expires today', daysRemaining: 0 };
  } else if (diffDays <= 10) {
    return {
      status: 'expiring',
      daysText: diffDays === 1 ? '1 day left' : `${diffDays} days left`,
      daysRemaining: diffDays,
    };
  } else {
    return { status: 'active', daysText: 'Active', daysRemaining: diffDays };
  }
}

// Build a full Customer object from input
export function buildCustomer(
  input: { name: string; phone: string; email: string; startDate: string; durationMonths: 3 | 6 | 12 },
  id: string,
  renewalHistory: RenewalRecord[] = [],
  createdAt: string = new Date().toISOString()
): Customer {
  const startDateObj = parseLocalDate(input.startDate);
  const expiresDateObj = new Date(startDateObj);
  expiresDateObj.setMonth(expiresDateObj.getMonth() + input.durationMonths);

  const startDateFormatted = formatShortDate(startDateObj);
  const expiresDateFormatted = formatShortDate(expiresDateObj);

  const totalDays = Math.round(
    (expiresDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
  );

  const { status, daysText, daysRemaining } = computeStatus(expiresDateFormatted);

  return {
    id,
    name: input.name,
    initials: getInitials(input.name),
    email: input.email,
    phone: input.phone,
    startDate: startDateFormatted,
    durationMonths: input.durationMonths,
    expiresDate: expiresDateFormatted,
    status,
    daysText,
    daysRemaining,
    totalDays,
    renewalHistory,
    createdAt,
  };
}

// Recompute live status on existing customer (call on load to refresh)
export function refreshCustomerStatus(customer: Customer): Customer {
  // If customer already has defined status and daysText, preserve it
  if (customer.status && customer.daysText !== undefined && customer.daysRemaining !== undefined) {
    return customer;
  }
  const { status, daysText, daysRemaining } = computeStatus(customer.expiresDate);
  return { ...customer, status, daysText, daysRemaining };
}

