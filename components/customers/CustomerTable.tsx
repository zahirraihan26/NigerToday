import React from 'react';
import Link from 'next/link';
import { Customer } from '../../src/types';
import StatusBadge from './StatusBadge';

interface CustomerTableProps {
  customers: Customer[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <div className="hidden md:block bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 bg-[#F8FAFC] text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">Customer</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Start Date</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Expires</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {customers.map((customer) => {
              const isExpired = customer.status === 'expired';

              return (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50/80 transition group"
                >
                  <td className="py-3.5 px-5">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-semibold text-xs flex items-center justify-center shrink-0">
                        {customer.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-[#4F46E5] transition text-xs">
                          {customer.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {customer.email}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {customer.phone}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {customer.startDate}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {customer.durationMonths} mo
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {customer.expiresDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      status={customer.status}
                      text={customer.daysText}
                    />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isExpired ? (
                        <>
                          <Link
                            href={`/customers/${customer.id}?action=renew`}
                            className="px-3 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition shadow-2xs"
                          >
                            Renew
                          </Link>
                          <Link
                            href={`/customers/${customer.id}?action=remind`}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                          >
                            Message
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/customers/${customer.id}?action=remind`}
                            className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] hover:bg-indigo-100 text-[#4F46E5] text-xs font-semibold transition"
                          >
                            Message
                          </Link>
                          <Link
                            href={`/customers/${customer.id}?action=renew`}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                          >
                            Renew
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
