'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  MessageCircle,
  Pencil,
  Trash2,
  X,
  Phone,
  Mail,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { useCustomer } from '@/src/hooks/useCustomer';
import * as customerService from '@/src/services/customerService';
import { UpdateCustomerInput } from '@/src/types';
import StatusBadge from '@/components/customers/StatusBadge';
import CustomerForm from '@/components/customers/CustomerForm';
import RenewModal from '@/components/customers/modals/RenewModal';
import ReminderModal from '@/components/customers/modals/ReminderModal';
import DeleteModal from '@/components/customers/modals/DeleteModal';

function CustomerDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto w-full min-w-0 space-y-4 animate-pulse">
      <div className="h-3.5 w-16 bg-slate-200 rounded" />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-36 bg-slate-200 rounded" />
            <div className="h-4 w-20 bg-slate-100 rounded-full" />
          </div>
        </div>
        <div className="hidden lg:flex gap-2">
          <div className="h-8 w-16 bg-slate-100 rounded-xl" />
          <div className="h-8 w-28 bg-slate-100 rounded-xl" />
          <div className="h-8 w-32 bg-slate-200 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 space-y-3.5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
            <div className="h-3 w-24 bg-slate-100 rounded" />
            <div className="h-7 w-40 bg-slate-200 rounded" />
            <div className="h-2 w-full bg-slate-100 rounded-full" />
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
            <div className="h-3.5 w-full bg-slate-100 rounded" />
            <div className="h-3.5 w-full bg-slate-100 rounded" />
            <div className="h-3.5 w-full bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const customerId = (params?.id as string) || '';

  const { customer, isLoading, refresh } = useCustomer(customerId);

  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  const [modalType, setModalType] = useState<
    'renew' | 'remind' | 'edit' | 'delete' | null
  >(action === 'remind' ? 'remind' : action === 'renew' ? 'renew' : null);

  useEffect(() => {
    if (action === 'remind') {
      setModalType('remind');
    } else if (action === 'renew') {
      setModalType('renew');
    }
  }, [action]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async () => {
    await customerService.deleteCustomer(customerId);
    setModalType(null);
    router.push('/customers');
  };

  const handleRenew = async (durationMonths: 3 | 6 | 12) => {
    await customerService.renewCustomer(customerId, durationMonths);
    await refresh();
  };

  const handleUpdate = async (input: UpdateCustomerInput) => {
    await customerService.updateCustomer(customerId, input);
    await refresh();
    setModalType(null);
  };

  if (isLoading) {
    return <CustomerDetailsSkeleton />;
  }

  if (!customer) {
    return (
      <div className="max-w-5xl mx-auto w-full min-w-0 space-y-5">
        <div>
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B44F6] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Customers
          </Link>
        </div>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80">
          <p className="text-sm font-medium text-slate-700">Customer not found</p>
          <p className="text-xs text-slate-400 mt-1">
            The customer you are looking for may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  const progressPercent =
    customer.status === 'expired'
      ? 100
      : customer.status === 'expiring'
      ? 88
      : 35;

  const progressColor =
    customer.status === 'expired'
      ? 'bg-red-500'
      : customer.status === 'expiring'
      ? 'bg-[#D97706]'
      : 'bg-emerald-500';

  const textColor =
    customer.status === 'expired'
      ? 'text-red-600'
      : customer.status === 'expiring'
      ? 'text-[#D97706]'
      : 'text-emerald-600';

  const mobileBadgeText =
    customer.status === 'expiring'
      ? 'Expiring'
      : customer.status === 'expired'
      ? 'Expired'
      : 'Active';

  return (
    <div className="max-w-5xl mx-auto w-full min-w-0 space-y-3.5 sm:space-y-5 overflow-x-hidden">
      {/* Top Back Link */}
      <div>
        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B44F6] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Customers
        </Link>
      </div>

      {/* Customer Profile Header & Desktop Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#4B44F6] font-medium text-sm flex items-center justify-center shrink-0">
            {customer.initials}
          </div>

          <div className="min-w-0">
            {/* Mobile View: Slimmer Name & Badge underneath */}
            <div className="lg:hidden space-y-1">
              <h1 className="text-lg font-semibold text-slate-900 leading-snug truncate">
                {customer.name}
              </h1>
              <div className="scale-95 origin-left">
                <StatusBadge status={customer.status} text={mobileBadgeText} />
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-semibold text-slate-900 leading-tight">
                  {customer.name}
                </h1>
                <StatusBadge status={customer.status} text={customer.daysText} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customer since {customer.startDate}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Action Buttons Top Right */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setModalType('edit')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-medium shadow-2xs transition cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-500" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => setModalType('remind')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEF2FF] hover:bg-indigo-100 text-[#4B44F6] text-xs font-medium transition cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Send Reminder
          </button>

          <button
            type="button"
            onClick={() => setModalType('renew')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4B44F6] hover:bg-[#3f38e0] text-white text-xs font-medium shadow-xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Renew Subscription
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 lg:gap-6 items-start">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-3.5 lg:space-y-5 min-w-0">
          {/* Time Remaining Progress Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/75 shadow-2xs space-y-2.5 sm:space-y-3">
            {/* Mobile Label */}
            <p className="lg:hidden text-[11px] font-normal text-slate-400">
              Time remaining
            </p>

            {/* Desktop Header */}
            <div className="hidden lg:flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400">Subscription</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Current plan details
                </p>
              </div>
              <span className="text-xs font-medium text-slate-600">
                Expires {customer.expiresDate}
              </span>
            </div>

            <div>
              <p className={`text-2xl font-bold tracking-tight ${textColor}`}>
                {customer.daysText}
              </p>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Desktop Dates Footer */}
            <div className="hidden lg:flex justify-between items-center text-[11px] text-slate-400 pt-0.5">
              <span>{customer.startDate}</span>
              <span>{customer.expiresDate}</span>
            </div>
          </div>

          {/* Unified Info + Contact Rows Card (Slim text & medium weight) */}
          <div className="bg-white px-4 sm:px-5 py-0.5 rounded-2xl border border-slate-200/75 shadow-2xs divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-400 font-normal">Start date</span>
              <span className="font-medium text-slate-800 text-right">
                {customer.startDate}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-400 font-normal">Duration</span>
              <span className="font-medium text-slate-800 text-right">
                {customer.durationMonths} months
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-400 font-normal">
                <span className="lg:hidden">Expires</span>
                <span className="hidden lg:inline">Expiration date</span>
              </span>
              <span className="font-medium text-slate-800 text-right">
                {customer.expiresDate}
              </span>
            </div>

            {/* Mobile-Only Phone & Email rows */}
            <div className="lg:hidden py-3 flex items-center justify-between gap-4">
              <span className="text-slate-400 font-normal shrink-0">Phone</span>
              <span className="font-medium text-slate-800 text-right truncate">
                {customer.phone}
              </span>
            </div>

            <div className="lg:hidden py-3 flex items-center justify-between gap-4">
              <span className="text-slate-400 font-normal shrink-0">Email</span>
              <span className="font-medium text-slate-800 text-right truncate">
                {customer.email}
              </span>
            </div>
          </div>

          {/* Mobile Stacked Action Buttons (Slimmer height & font) */}
          <div className="lg:hidden space-y-2 pt-0.5">
            <button
              type="button"
              onClick={() => setModalType('renew')}
              className="w-full py-3 px-4 rounded-xl bg-[#4B44F6] hover:bg-[#3f38e0] text-white text-xs font-medium shadow-2xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Renew Subscription
            </button>

            <button
              type="button"
              onClick={() => setModalType('remind')}
              className="w-full py-3 px-4 rounded-xl bg-[#EEF2FF] hover:bg-indigo-100 text-[#4B44F6] text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Send Reminder
            </button>

            <button
              type="button"
              onClick={() => setModalType('edit')}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-medium shadow-2xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-500" />
              Edit customer
            </button>
          </div>

          {/* Renewal History Section (Desktop Only) */}
          <div className="hidden lg:block bg-white p-5 rounded-2xl border border-slate-200/75 shadow-2xs space-y-3.5">
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Renewal history
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Every time this subscription was renewed
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {customer.renewalHistory && customer.renewalHistory.length > 0 ? (
                customer.renewalHistory.map((rec) => (
                  <div key={rec.id} className="py-3 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-800">
                        Renewed for {rec.durationMonths} months
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {rec.fromDate} → {rec.toDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-3 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800">
                      Initial subscription · {customer.durationMonths} months
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {customer.startDate} → {customer.expiresDate}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column (Desktop Contact & Delete Cards) */}
        <div className="hidden lg:block space-y-5 min-w-0">
          {/* Contact Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/75 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-semibold text-slate-900">Contact</h3>

            <div className="space-y-3 text-xs">
              {/* Phone */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-normal">
                      Phone
                    </p>
                    <p className="font-medium text-slate-800 mt-0.5 truncate">
                      {customer.phone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(customer.phone, 'phone')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition cursor-pointer shrink-0"
                  title="Copy phone"
                >
                  {copiedField === 'phone' ? (
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Copied!
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-normal">
                      Email
                    </p>
                    <p className="font-medium text-slate-800 mt-0.5 truncate">
                      {customer.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(customer.email, 'email')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition cursor-pointer shrink-0"
                  title="Copy email"
                >
                  {copiedField === 'email' ? (
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Copied!
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Delete Customer Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/75 shadow-2xs space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Delete customer
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Removes this customer and their subscription records. This cannot
                be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalType('delete')}
              className="w-full py-2 px-4 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete customer
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RenewModal
        customer={customer}
        isOpen={modalType === 'renew'}
        onClose={() => setModalType(null)}
        onConfirm={handleRenew}
      />

      <ReminderModal
        customer={customer}
        isOpen={modalType === 'remind'}
        onClose={() => setModalType(null)}
      />

      <DeleteModal
        customer={customer}
        isOpen={modalType === 'delete'}
        onClose={() => setModalType(null)}
        onConfirm={handleDelete}
      />

      {/* Edit Customer Modal */}
      {modalType === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-4 sm:p-6 space-y-4 my-6 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Edit Customer
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <CustomerForm
              initialData={customer}
              onSubmit={handleUpdate}
              isModal
            />
          </div>
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function CustomerDetailsPage() {
  return (
    <Suspense fallback={<CustomerDetailsSkeleton />}>
      <CustomerDetailsContent />
    </Suspense>
  );
}