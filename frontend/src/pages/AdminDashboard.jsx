import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Activity,
  Layers,
  IndianRupee,
  UserCheck,
  UserX,
} from 'lucide-react';
import client from '../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        client.get('/api/admin/stats'),
        client.get('/api/admin/users'),
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data);
      }
      if (usersRes.data?.success) {
        setUsers(usersRes.data.users || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await client.patch(`/api/admin/users/${userId}/toggle-status`);
      if (res.data?.success) {
        setStatusMessage(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: res.data.isActive } : u))
        );
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading platform telemetry & administration console...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Root Administration
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Platform Administration
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Global system monitoring, aggregate platform metrics, and user account management.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Environment: Neon PostgreSQL • Production Node API
          </div>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium">{statusMessage}</span>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Users
              </span>
              <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {stats?.stats?.totalUsers || 0}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active registered accounts
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Events
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {stats?.stats?.totalEvents || 0}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Published & draft events
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Registrations
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {stats?.stats?.totalRegistrations || 0}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Issued admission tickets
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Turnout Rate
              </span>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {stats?.stats?.turnoutRate || '0%'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats?.stats?.totalCheckedIn || 0} verified check-ins
            </p>
          </div>
        </div>

        {/* Visual Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Roles */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Users by Role</h3>
            </div>
            <div className="space-y-3">
              {stats?.rolesBreakdown?.map((role) => (
                <div key={role.role} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {role.role}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    {role.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Events by Status */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Events by Status</h3>
            </div>
            <div className="space-y-3">
              {stats?.eventsByStatus?.map((status) => (
                <div key={status.status} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {status.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Category Distribution
              </h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats?.categoriesBreakdown?.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 truncate max-w-[180px]">
                    {cat.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                    {cat.count} events
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Accounts</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit registered users, inspect roles, and activate or deactivate accounts.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name, email, role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Registrations</th>
                  <th className="px-6 py-3.5">Events Hosted</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-xs">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'ADMIN'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : u.role === 'ORGANIZER'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">{u.registrationCount}</td>
                    <td className="px-6 py-4 font-mono">{u.eventCount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.isActive
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          u.isActive
                            ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                            : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Log */}
        {stats?.recentActivity && stats.recentActivity.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Platform Activity
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recentActivity.map((act) => (
                <div key={act.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-primary-600 dark:text-primary-400 font-semibold text-[11px]">
                      {act.action}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {act.user ? `${act.user.name} (${act.user.email})` : 'System'}
                      {act.event ? ` on "${act.event.title}"` : ''}
                    </span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {new Date(act.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
