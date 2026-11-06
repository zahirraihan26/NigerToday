export type SubscriptionStatus = 'active' | 'expiring' | 'expired';

export interface Customer {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  startDate: string;       // "Jul 3, 2026"
  durationMonths: 3 | 6 | 12;
  expiresDate: string;     // "Oct 3, 2026"
  status: SubscriptionStatus;
  daysText: string;
  daysRemaining: number;
  totalDays: number;
  renewalHistory: RenewalRecord[];
  createdAt: string;       // ISO string
}

export interface RenewalRecord {
  id: string;
  durationMonths: 3 | 6 | 12;
  fromDate: string;
  toDate: string;
  renewedAt: string; // ISO string
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  email: string;
  startDate: string; // "YYYY-MM-DD"
  durationMonths: 3 | 6 | 12;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string;
  email?: string;
  startDate?: string; // "YYYY-MM-DD"
  durationMonths?: 3 | 6 | 12;
}

export interface DashboardStats {
  total: number;
  active: number;
  expiring: number;
  expired: number;
  needsAttention: number;
}

// ── Auth Types ──────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileInput {
  name: string;
  email: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
