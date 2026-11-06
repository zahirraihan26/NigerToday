'use client';

import React, { useState, useEffect } from 'react';
import { Lock, X, Check } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';

export default function SettingsPage() {
  const { user, updateProfile, changePassword } = useAuth();

  // Account Form State
  const [name, setName] = useState(user?.name || 'Alex Owner');
  const [email, setEmail] = useState(user?.email || 'owner@email.com');
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Reminder Toggle States (all defaulted to true as in screenshot)
  const [remind7Days, setRemind7Days] = useState(true);
  const [remind3Days, setRemind3Days] = useState(true);
  const [remind1Day, setRemind1Day] = useState(true);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    try {
      await updateProfile({ name, email });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordUpdated(true);
      setTimeout(() => {
        setPasswordUpdated(false);
        setIsPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account and password.
        </p>
      </div>

      {/* 1. Account Card */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
        <h2 className="text-base font-bold text-slate-900">Account</h2>

        {saveError && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
            {saveError}
          </p>
        )}

        <form onSubmit={handleSaveAccount} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save changes</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Password Card */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Password</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Use a strong password that only you know.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPasswordModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 shadow-2xs"
        >
          <Lock className="w-4 h-4 text-slate-500" />
          <span>Change password</span>
        </button>
      </div>

      {/* 3. Reminder settings Card */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Reminder settings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose when a customer shows up as &ldquo;Expiring soon&rdquo;.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 shrink-0">
            Optional
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm pt-2">
          {[
            {
              label: 'Remind me 7 days before expiry',
              state: remind7Days,
              setter: setRemind7Days,
            },
            {
              label: 'Remind me 3 days before expiry',
              state: remind3Days,
              setter: setRemind3Days,
            },
            {
              label: 'Remind me 1 day before expiry',
              state: remind1Day,
              setter: setRemind1Day,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="py-3.5 flex items-center justify-between gap-3"
            >
              <span className="text-slate-700 font-medium">{item.label}</span>
              <button
                type="button"
                onClick={() => item.setter(!item.state)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                  item.state ? 'bg-[#4F46E5]' : 'bg-slate-200'
                }`}
                aria-label={item.label}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    item.state ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-4 sm:p-6 space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-150 my-6 min-w-0 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#4F46E5]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                    Change password
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                    Use at least 8 characters
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {passwordError && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {passwordError}
                </p>
              )}
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Current password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  New password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Confirm new password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
                >
                  {passwordUpdated ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Updated!</span>
                    </>
                  ) : (
                    <span>Update password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
