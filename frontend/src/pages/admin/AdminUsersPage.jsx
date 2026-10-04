import React, { useState, useEffect } from 'react';
import {
  Search,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertCircle,
  Filter,
  Mail,
  Calendar,
} from 'lucide-react';
import client from '../../api/client';

const roleBadge = {
  ADMIN: 'bg-rose-900/50 text-rose-300 border-rose-800/50',
  ORGANIZER: 'bg-purple-900/50 text-purple-300 border-purple-800/50',
  USER: 'bg-slate-800 text-slate-300 border-slate-700',
  VISITOR: 'bg-slate-800 text-slate-400 border-slate-700',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client.get('/admin/users');
        if (res.data?.success) setUsers(res.data.users);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleToggle = async (userId) => {
    try {
      const res = await client.patch(`/admin/users/${userId}/toggle-status`);
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: res.data.isActive } : u))
        );
        setToast(res.data.message);
        setTimeout(() => setToast(''), 4000);
      }
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to update user.');
      setTimeout(() => setToast(''), 4000);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q);
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">User Management</h1>
        <p className="text-slate-500 text-sm mt-1">
          Audit, inspect, and control all registered accounts.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {toast}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 appearance-none cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="ORGANIZER">Organizer</option>
            <option value="USER">User</option>
            <option value="VISITOR">Visitor</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm">No users found.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Events</th>
                  <th className="px-6 py-4">Registrations</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">{u.name}</p>
                          <p className="text-slate-500 text-[10px] flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${roleBadge[u.role] || roleBadge.USER}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">{u.eventCount}</td>
                    <td className="px-6 py-4 font-mono text-slate-300">{u.registrationCount}</td>
                    <td className="px-6 py-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.isActive
                            ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50'
                            : 'bg-rose-950/50 text-rose-300 border border-rose-800/50'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {u.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggle(u.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ml-auto ${
                          u.isActive
                            ? 'text-rose-400 hover:bg-rose-950/40 border border-rose-900/50'
                            : 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/50'
                        }`}
                      >
                        {u.isActive ? (
                          <><UserX className="w-3 h-3" /> Block</>
                        ) : (
                          <><UserCheck className="w-3 h-3" /> Unblock</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && (
          <div className="px-6 py-3 border-t border-slate-800 text-xs text-slate-500">
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
}
