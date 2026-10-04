import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  User,
  ShieldCheck,
  Receipt,
  Download,
} from 'lucide-react';
import api from '../../api/client';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [totalVolume, setTotalVolume] = useState(0);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/payments', { params });
      if (res.data?.success) {
        setPayments(res.data.payments || []);
        setTotalVolume(res.data.totalVolume || 0);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const capturedCount = payments.filter((p) => p.status === 'CAPTURED').length;
  const avgOrderValue = capturedCount > 0 ? Math.round(totalVolume / capturedCount) : 0;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Payment Transactions</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time transaction tracking, gateway settlements, and ticket revenue
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Revenue</p>
            <p className="text-2xl font-extrabold text-white mt-1">
              ₹{totalVolume.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" /> All captured payments
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Transactions</p>
            <p className="text-2xl font-extrabold text-white mt-1">{payments.length}</p>
            <span className="text-[11px] text-indigo-400 flex items-center gap-1 mt-1 font-medium">
              <Receipt className="w-3 h-3" /> Processed orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Successful Captured</p>
            <p className="text-2xl font-extrabold text-white mt-1">{capturedCount}</p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> 100% Success Rate
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Avg. Ticket Value</p>
            <p className="text-2xl font-extrabold text-white mt-1">
              ₹{avgOrderValue.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-purple-400 flex items-center gap-1 mt-1 font-medium">
              <ShieldCheck className="w-3 h-3" /> Average order value
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, User, or Event..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-400 w-full md:w-auto">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:text-white'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('CAPTURED')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'CAPTURED'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Captured
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading platform transactions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Receipt className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-white">No payments found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Transactions will appear in real-time as users register and book paid tickets.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Gateway</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-xs text-slate-300">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-300">
                      <span className="text-indigo-400">{p.razorpayPaymentId || p.razorpayOrderId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                          {p.user?.name?.slice(0, 2)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{p.user?.name || 'Customer'}</p>
                          <p className="text-[10px] text-slate-400">{p.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-white line-clamp-1">{p.event?.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {p.event?.startDate
                          ? new Date(p.event.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : ''}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{p.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.status === 'CAPTURED'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : p.status === 'PENDING'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono border border-slate-700">
                        UPI / Razorpay
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
