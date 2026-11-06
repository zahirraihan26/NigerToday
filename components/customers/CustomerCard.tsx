import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Customer } from '../../src/types';
import StatusBadge from './StatusBadge';

interface CustomerCardProps {
  customer: Customer;
  showChatIcon?: boolean;
  onChatClick?: (e: React.MouseEvent) => void;
}

export default function CustomerCard({
  customer,
  showChatIcon = false,
  onChatClick,
}: CustomerCardProps) {
  const isExpired = customer.status === 'expired';
  const subtitle = isExpired
    ? `Expired ${customer.expiresDate}`
    : `Expires ${customer.expiresDate}`;

  return (
    <Link
      href={`/customers/${customer.id}`}
      className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-200 transition gap-2 sm:gap-3 w-full"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Initials Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4F46E5] font-semibold text-xs flex items-center justify-center shrink-0">
          {customer.initials}
        </div>

        {/* Name & Subtitle */}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-900 leading-tight truncate">
            {customer.name}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Side Status or Chat Button */}
      <div className="shrink-0 pl-1">
        {showChatIcon ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChatClick?.(e);
            }}
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        ) : (
          <StatusBadge status={customer.status} text={customer.daysText} />
        )}
      </div>
    </Link>
  );
}
