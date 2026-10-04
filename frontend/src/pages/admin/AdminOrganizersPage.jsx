import React, { useState, useEffect } from 'react';
import { Search, Calendar, Star, UserCheck, UserX, ShieldCheck, Mail } from 'lucide-react';
import client from '../../api/client';

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client.get('/admin/users');
        if (res.data?.success) {
          setOrganizers(res.data.users.filter((u) => u.role === 'ORGANIZER'));
        }
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
        setOrganizers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: res.data.isActive } : u))
        );
        setToast(res.data.message);
        setTimeout(() => setToast(''), 4000);
      }
    } catch (e) {
      setToast('Failed to update organizer status.');
      setTimeout(() => setToast(''), 4000);
    }
  };

  const filtered = organizers.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Organizer Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Monitor and control all event organizers on the platform.
        </p>
      </div>

      {toast && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-sm">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          {toast}
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search organizers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-sm">No organizers found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800/50 shadow-xs transition-colors p-5 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {u.name?.charAt(0)?.toUpperCase() || 'O'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3" /> {u.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                  <p className="text-lg font-black text-purple-600 dark:text-purple-400">{u.eventCount}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Events</p>
                </div>
                <div className="py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{u.registrationCount}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Bookings</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    u.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50'
                      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                  {u.isActive ? 'Active' : 'Blocked'}
                </span>

                <button
                  onClick={() => handleToggle(u.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    u.isActive
                      ? 'text-rose-600 border-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:border-rose-900/50 dark:hover:bg-rose-950/40'
                      : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-900/50 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  {u.isActive ? (
                    <><UserX className="w-3 h-3" /> Block</>
                  ) : (
                    <><UserCheck className="w-3 h-3" /> Unblock</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
