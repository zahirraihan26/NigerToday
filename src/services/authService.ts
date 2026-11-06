/**
 * Auth Service — Mock Implementation & Backend Integration Point
 *
 * TO INTEGRATE A REAL BACKEND:
 *   Replace each function body with a fetch/axios call to your backend endpoints.
 *   e.g.:
 *     export async function login(input: LoginInput): Promise<AuthResponse> {
 *       const res = await fetch('/api/auth/login', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify(input),
 *       });
 *       if (!res.ok) throw new Error('Invalid credentials');
 *       return res.json();
 *     }
 */

import {
  User,
  LoginInput,
  AuthResponse,
  UpdateProfileInput,
  ChangePasswordInput,
} from '../types';

const STORAGE_KEY_USER = 'gtv_user';
const STORAGE_KEY_TOKEN = 'gtv_token';
const COOKIE_NAME = 'gtv_token';

// Initially null: unauthenticated users cannot access protected routes without logging in
let currentUser: User | null = null;
let currentToken: string | null = null;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/** POST /api/auth/login */
export async function login(input: LoginInput): Promise<AuthResponse> {
  await delay(150);

  if (!input.email || !input.password) {
    throw new Error('Email and password are required');
  }

  // Demo user data (replace with backend response)
  const user: User = {
    id: 'usr-1',
    name: input.email.includes('@')
      ? input.email.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase())
      : 'Alex Owner',
    email: input.email,
    role: 'owner',
  };

  const token = `jwt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  currentUser = user;
  currentToken = token;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
      setCookie(COOKIE_NAME, token);
    } catch {
      // Ignore
    }
  }

  return { user, token };
}

/** POST /api/auth/logout */
export async function logout(): Promise<void> {
  await delay(60);
  currentUser = null;
  currentToken = null;

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      removeCookie(COOKIE_NAME);
    } catch {
      // Ignore
    }
  }
}

/** GET /api/auth/me */
export async function getCurrentUser(): Promise<User | null> {
  await delay(50);

  if (typeof window !== 'undefined') {
    try {
      const cookieToken = getCookie(COOKIE_NAME);
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);

      // Verify token exists (either in cookie or localStorage)
      if ((cookieToken || savedToken) && savedUser) {
        currentUser = JSON.parse(savedUser);
        currentToken = cookieToken || savedToken;
        if (!cookieToken && currentToken) {
          setCookie(COOKIE_NAME, currentToken);
        }
        return currentUser;
      }
    } catch {
      // Fallback
    }
  }

  return currentUser;
}

/** PUT /api/auth/profile */
export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  await delay(100);

  if (!currentUser) throw new Error('Not authenticated');

  currentUser = {
    ...currentUser,
    name: input.name,
    email: input.email,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch {
      // Ignore
    }
  }

  return currentUser;
}

/** PUT /api/auth/change-password */
export async function changePassword(input: ChangePasswordInput): Promise<void> {
  await delay(120);

  if (!input.currentPassword || !input.newPassword) {
    throw new Error('Please fill in both current and new password');
  }

  if (input.newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters');
  }

  // Success
}
