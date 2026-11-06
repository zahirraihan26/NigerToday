import React from 'react';
import Link from 'next/link';
import { Users, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  showAddButton?: boolean;
}

export default function EmptyState({
  title,
  description,
  showAddButton = false,
}: EmptyStateProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center my-4  flex flex-col items-center justify-center shadow-xs">
      <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <Users className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs mt-1 mb-5">{description}</p>
      {showAddButton && (
        <Link
          href="/customers/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Link>
      )}
    </div>
  );
}