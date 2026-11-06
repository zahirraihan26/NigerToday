import React from 'react';
import { SubscriptionStatus } from './../../src/types';

interface StatusBadgeProps {
  status: SubscriptionStatus;
  text: string;
}

export default function StatusBadge({ status, text }: StatusBadgeProps) {
  const styles = {
    expired: {
      bg: 'bg-[#FEE2E2] text-[#DC2626]',
      dot: 'bg-[#DC2626]',
    },
    expiring: {
      bg: 'bg-[#FEF3C7] text-[#B45309]',
      dot: 'bg-[#D97706]',
    },
    active: {
      bg: 'bg-[#DCFCE7] text-[#16A34A]',
      dot: 'bg-[#16A34A]',
    },
  }[status];

  // In mobile card view, "Expired 2 days ago" cleanly becomes "2 days ago" to prevent truncation
  let label = text;
  if (status === 'expired' && text.toLowerCase().startsWith('expired ')) {
    label = text.replace(/^expired\s+/i, '');
  } else if (status === 'active') {
    label = 'Active';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 whitespace-nowrap ${styles.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
      {label}
    </span>
  );
}
