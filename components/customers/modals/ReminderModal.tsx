'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Loader2,
  Check,
} from 'lucide-react';
import { Customer } from './../../../src/types';

interface ReminderModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSend?: (customer: Customer, message: string) => void;
}

type TemplateType = '7 days left' | '3 days left' | '1 day left' | 'Expired';

export default function ReminderModal({
  customer,
  isOpen,
  onClose,
  onSend,
}: ReminderModalProps) {
  // Determine best default template based on customer's status/days
  const defaultTemplate: TemplateType = useMemo(() => {
    if (customer.status === 'expired') return 'Expired';
    if (customer.daysRemaining !== undefined) {
      if (customer.daysRemaining <= 1) return '1 day left';
      if (customer.daysRemaining <= 3) return '3 days left';
      return '7 days left';
    }
    return '3 days left';
  }, [customer]);

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(defaultTemplate);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Helper to generate message based on template
  const generateMessage = useCallback((template: TemplateType): string => {
    const firstName = customer.name.split(' ')[0] || customer.name;
    const expiresDate = customer.expiresDate || 'soon';

    switch (template) {
      case '7 days left':
        return `Hi ${firstName}, your TV subscription expires on ${expiresDate} (7 days left). Please renew to keep your service running. Thank you!`;
      case '3 days left':
        return `Hi ${firstName}, your TV subscription expires on ${expiresDate} (3 days left). Please renew to keep your service running. Thank you!`;
      case '1 day left':
        return `Hi ${firstName}, your TV subscription expires tomorrow on ${expiresDate} (1 day left). Please renew to keep your service running. Thank you!`;
      case 'Expired':
        return `Hi ${firstName}, your TV subscription has expired on ${expiresDate}. Please renew now to restore your service. Thank you!`;
      default:
        return `Hi ${firstName}, your TV subscription expires on ${expiresDate}. Please renew to keep your service running. Thank you!`;
    }
  }, [customer]);

  const [message, setMessage] = useState(() => generateMessage(defaultTemplate));

  // Reset when modal opens or customer changes
  useEffect(() => {
    if (isOpen) {
      setSelectedTemplate(defaultTemplate);
      setMessage(generateMessage(defaultTemplate));
      setIsSending(false);
      setIsSent(false);
    }
  }, [isOpen, customer, defaultTemplate, generateMessage]);

  // Handle template selection
  const handleSelectTemplate = (template: TemplateType) => {
    setSelectedTemplate(template);
    setMessage(generateMessage(template));
  };

  // Handle Send Reminder
  const handleSendReminder = async () => {
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSending(false);
    setIsSent(true);

    onSend?.(customer, message);

    // Auto-close after showing success
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  const templates: TemplateType[] = [
    '7 days left',
    '3 days left',
    '1 day left',
    'Expired',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-5 sm:p-6 space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#4F46E5]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                Send reminder
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                {customer.name} · {customer.phone}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick template selector */}
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-2">
            Quick template
          </label>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate === tpl;
              return (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium transition cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#4F46E5] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50'
                  }`}
                >
                  {tpl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Input Box */}
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1.5">
            Message
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 sm:p-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition resize-none shadow-2xs"
          />
        </div>

        {/* Action Buttons: Just Cancel and Send */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSending || isSent}
            onClick={handleSendReminder}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer ${
              isSent
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-[#4F46E5] hover:bg-[#4338CA]'
            }`}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : isSent ? (
              <>
                <Check className="w-4 h-4" />
                <span>Sent!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
