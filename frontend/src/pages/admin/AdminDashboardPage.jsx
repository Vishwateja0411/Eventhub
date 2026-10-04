import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  IndianRupee,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import client from '../../api/client';

const StatCard = ({ label, value, icon: Icon, iconClass, trend, sub }) => (
  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className={`p-2.5 rounded-xl ${iconClass}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-3xl font-extrabold text-white">{value}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    {trend && (
      <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
        <ArrowUpRight className="w-3 h-3" /> {trend}
      </p>
    )}
  </div>
);

export default function AdminDashboardPage() {
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading platform data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-900/40 text-rose-300 text-[10px] font-bold uppercase tracking-widest border border-rose-800/50">
            <ShieldCheck className="w-3 h-3" /> Root Admin
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Platform Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Global system monitoring, platform metrics, and live activity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Total Users"
          value={stats?.stats?.totalUsers ?? '—'}
          icon={Users}
          iconClass="bg-indigo-950/60 text-indigo-400"
          sub="Registered accounts"
        />
        <StatCard
          label="Total Events"
          value={stats?.stats?.totalEvents ?? '—'}
          icon={Calendar}
          iconClass="bg-purple-950/60 text-purple-400"
          sub="Published & draft"
        />
        <StatCard
          label="Registrations"
          value={stats?.stats?.totalRegistrations ?? '—'}
          icon={Ticket}
          iconClass="bg-emerald-950/60 text-emerald-400"
          sub="Confirmed tickets"
        />
        <StatCard
          label="Turnout Rate"
          value={stats?.stats?.turnoutRate ?? '0%'}
          icon={TrendingUp}
          iconClass="bg-amber-950/60 text-amber-400"
          sub={`${stats?.stats?.totalCheckedIn ?? 0} check-ins`}
        />
      </div>

      {/* Revenue + Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-900/30 via-slate-900 to-slate-900 border border-rose-800/30">
          <div className="flex items-center gap-2 mb-3">
            <IndianRupee className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-bold text-white">Total Revenue</span>
          </div>
          <p className="text-4xl font-black text-white">
            ₹{((stats?.stats?.totalRevenue || 0) / 100).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-500 mt-1">Confirmed payments</p>
        </div>

        {/* Users by Role */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Users by Role</h3>
          </div>
          <div className="space-y-2.5">
            {stats?.rolesBreakdown?.map((r) => (
              <div key={r.role} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{r.role}</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono bg-slate-800 text-slate-200 border border-slate-700">
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Events by Status */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Events by Status</h3>
          </div>
          <div className="space-y-2.5">
            {stats?.eventsByStatus?.map((s) => {
              const colors = {
                PUBLISHED: 'text-emerald-300',
                DRAFT: 'text-amber-300',
                CANCELLED: 'text-rose-300',
                COMPLETED: 'text-indigo-300',
              };
              return (
                <div key={s.status} className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${colors[s.status] || 'text-slate-300'}`}>
                    {s.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-mono bg-slate-800 text-slate-200 border border-slate-700">
                    {s.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Category Distribution</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {stats?.categoriesBreakdown?.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs"
            >
              <span className="text-slate-300 truncate">{cat.name}</span>
              <span className="ml-2 font-mono text-slate-400 flex-shrink-0">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity?.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Live Platform Activity</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {stats.recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-rose-400 font-semibold text-[11px]">
                    {act.action}
                  </span>
                  <span className="text-slate-400">
                    {act.user ? `${act.user.name}` : 'System'}
                    {act.event ? ` — "${act.event.title}"` : ''}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px] flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(act.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
