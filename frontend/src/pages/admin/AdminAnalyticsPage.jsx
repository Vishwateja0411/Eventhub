import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  IndianRupee,
  BarChart3,
} from 'lucide-react';
import client from '../../api/client';

const BAR_COLORS = [
  'bg-indigo-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-pink-500',
  'bg-teal-500',
];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client.get('/admin/stats');
        if (res.data?.success) setStats(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxCatCount = Math.max(...(stats?.categoriesBreakdown?.map((c) => c.count) || [1]), 1);
  const maxRoleCount = Math.max(...(stats?.rolesBreakdown?.map((r) => r.count) || [1]), 1);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">
          Platform-wide metrics and performance insights.
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Users', value: stats?.stats?.totalUsers, icon: Users, color: 'text-indigo-400' },
          { label: 'Total Events', value: stats?.stats?.totalEvents, icon: Calendar, color: 'text-purple-400' },
          { label: 'Registrations', value: stats?.stats?.totalRegistrations, icon: Ticket, color: 'text-emerald-400' },
          { label: 'Turnout Rate', value: stats?.stats?.turnoutRate, icon: TrendingUp, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
            <p className={`text-2xl font-black ${color}`}>{value ?? '—'}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Events per Category</h3>
          </div>
          <div className="space-y-3">
            {stats?.categoriesBreakdown
              ?.sort((a, b) => b.count - a.count)
              .slice(0, 8)
              .map((cat, i) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[200px]">{cat.name}</span>
                    <span className="font-mono text-slate-400">{cat.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-700`}
                      style={{ width: `${(cat.count / maxCatCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">User Role Distribution</h3>
          </div>
          <div className="space-y-3">
            {stats?.rolesBreakdown?.map((r, i) => (
              <div key={r.role} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{r.role}</span>
                  <span className="font-mono text-slate-400">{r.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${BAR_COLORS[(i + 3) % BAR_COLORS.length]} transition-all duration-700`}
                    style={{ width: `${(r.count / maxRoleCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-900/30 via-slate-900 to-slate-900 border border-rose-800/30 space-y-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Revenue</h3>
          </div>
          <p className="text-5xl font-black text-white">
            ₹{((stats?.stats?.totalRevenue || 0) / 100).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-500">Total from confirmed registrations (excl. refunds)</p>
        </div>

        {/* Turnout */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/20 via-slate-900 to-slate-900 border border-emerald-800/30 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Turnout Rate</h3>
          </div>
          <div>
            <p className="text-5xl font-black text-emerald-400">{stats?.stats?.turnoutRate || '0%'}</p>
            <p className="text-xs text-slate-500 mt-1">
              {stats?.stats?.totalCheckedIn || 0} checked-in out of{' '}
              {stats?.stats?.totalRegistrations || 0} registrations
            </p>
          </div>
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-3 rounded-full bg-emerald-500 transition-all duration-1000"
              style={{
                width: stats?.stats?.turnoutRate
                  ? `${parseFloat(stats.stats.turnoutRate)}%`
                  : '0%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
