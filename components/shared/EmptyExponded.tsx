import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface EmptyExpondedProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function EmptyExponded({
  title = 'No expired subscriptions',
  description = 'Every customer subscription is still active.',
  className = '',
}: EmptyExpondedProps) {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-6 py-20 sm:py-24 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mb-1">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// Exported alias
export { EmptyExponded as EmptyExpired };
