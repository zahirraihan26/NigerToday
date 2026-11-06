'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Customer } from './../../../src/types';

interface DeleteModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  customer,
  isOpen,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl w-full max-w-sm p-4 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 my-6 min-w-0 overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">
            Delete customer?
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Are you sure you want to remove{' '}
            <strong className="text-slate-800">{customer.name}</strong>? This
            action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
