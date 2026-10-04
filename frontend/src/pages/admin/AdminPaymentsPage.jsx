import React from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';

/**
 * AdminPaymentsPage — placeholder until Razorpay integration is complete.
 * Will be wired to /api/admin/payments once Payment model is deployed.
 */
export default function AdminPaymentsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Payments</h1>
        <p className="text-slate-500 text-sm mt-1">
          Platform-wide transaction history and revenue tracking.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 rounded-2xl bg-slate-900 border border-slate-800 border-dashed space-y-4">
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/30">
          <CreditCard className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg">Razorpay Integration Pending</p>
          <p className="text-slate-500 text-sm mt-1 max-w-md">
            Payment history will appear here once the Razorpay payment gateway is integrated.
            The backend <code className="text-indigo-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">Payment</code> model
            and API routes are being set up.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-800/30 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4" />
          Coming in the next implementation phase
        </div>
      </div>
    </div>
  );
}
