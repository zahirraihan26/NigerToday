'use client';

import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { Customer } from './../../../src/types';

interface RenewModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (durationMonths: 3 | 6 | 12) => void;
}

export default function RenewModal({
  customer,
  isOpen,
  onClose,
  onConfirm,
}: RenewModalProps) {
  const [duration, setDuration] = useState<3 | 6 | 12>(3);

  if (!isOpen) return null;

  // Compute new expiry preview from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newExpiry = new Date(today);
  newExpiry.setMonth(newExpiry.getMonth() + duration);
  const newExpiryStr = newExpiry.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(duration);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-4 sm:p-6 space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-150 my-6 min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              Renew Subscription
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              Extend subscription for {customer.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Duration Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-600">
            Select renewal duration
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {([3, 6, 12] as const).map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => setDuration(months)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  duration === months
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {months} mo
              </button>
            ))}
          </div>
        </div>

        {/* New Expiry Preview */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-indigo-500">
              New expiration date
            </p>
            <p className="text-sm font-bold text-indigo-700 mt-0.5">
              {newExpiryStr}
            </p>
          </div>
          <span className="text-[11px] font-medium text-indigo-400 bg-white px-2.5 py-1 rounded-md">
            +{duration} months
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Confirm Renewal
          </button>
        </div>
      </div>
    </div>
  );
}
