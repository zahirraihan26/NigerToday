'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/src/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('admin@email.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect immediately away from login
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(from);
    }
  }, [isAuthenticated, router, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
      router.replace(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side Banner (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden p-12 flex-col justify-between text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("./assets/logins.jpg")',
          }}
        />
        {/* Subtle Overlay to match screenshot readability */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={130}
            height={80}
            className="object-contain"
            priority
          />
        </div>

        {/* Center Content & Stat Pills */}
        <div className="relative z-10 max-w-md space-y-6 my-auto pt-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Know who to call today.
            </h2>
            <p className="text-sm text-white/90 leading-relaxed max-w-sm">
              Track every customer subscription, see who is expiring, and send
              renewal reminders in one place.
            </p>
          </div>

          <div className="flex flex-col items-start space-y-2.5 pt-1">
            <div className="inline-flex items-center gap-2.5 bg-white text-slate-800 px-4 py-2.5 rounded-xl shadow-sm min-w-[175px]">
              <span className="text-emerald-600 font-bold text-base">24</span>
              <span className="text-xs font-medium text-slate-700">
                customers active
              </span>
            </div>

            <div className="inline-flex items-center gap-2.5 bg-white text-slate-800 px-4 py-2.5 rounded-xl shadow-sm min-w-[175px]">
              <span className="text-amber-600 font-bold text-base">4</span>
              <span className="text-xs font-medium text-slate-700">
                expiring this month
              </span>
            </div>

            <div className="inline-flex items-center gap-2.5 bg-white text-slate-800 px-4 py-2.5 rounded-xl shadow-sm min-w-[175px]">
              <span className="text-red-600 font-bold text-base">2</span>
              <span className="text-xs font-medium text-slate-700">
                expired — follow up
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Text */}
        <div className="relative z-10">
          <p className="text-xs text-white/70">
            Private owner dashboard · Works on phone and computer
          </p>
        </div>
      </div>

      {/* Right Side Login Form (Mobile & Desktop) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile Only Logo */}
          <div className="md:hidden mb-2">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={110}
              height={70}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">
              Log in to manage your customers.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Email or username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 md:hidden" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="w-full pl-10 md:pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 md:hidden" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 md:pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                className="text-xs font-medium text-[#4F46E5] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-60 text-white font-semibold rounded-xl text-sm shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
