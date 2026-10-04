import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Users, Eye, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import client from '../../api/client';

const statusColors = {
  PUBLISHED: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50',
  DRAFT: 'bg-amber-950/50 text-amber-300 border-amber-800/50',
  CANCELLED: 'bg-rose-950/50 text-rose-300 border-rose-800/50',
  COMPLETED: 'bg-indigo-950/50 text-indigo-300 border-indigo-800/50',
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client.get('/events?limit=100&page=1');
        if (res.data?.success) setEvents(res.data.events || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = events.filter((ev) => {
    const q = search.toLowerCase();
    const matchSearch =
      ev.title?.toLowerCase().includes(q) ||
      ev.city?.toLowerCase().includes(q) ||
      ev.organizer?.name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || ev.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Events</h1>
        <p className="text-slate-500 text-sm mt-1">All events across the platform.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, city, organizer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-sm">No events found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden transition-colors"
            >
              {ev.bannerUrl ? (
                <img
                  src={ev.bannerUrl}
                  alt={ev.title}
                  className="w-full h-36 object-cover"
                />
              ) : (
                <div className="w-full h-36 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-slate-700" />
                </div>
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">{ev.title}</h3>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[ev.status] || ''}`}
                  >
                    {ev.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {ev.city}, {ev.country}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(ev.startDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-slate-500" />
                    {ev._count?.registrations ?? 0} / {ev.capacity} registered
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">by {ev.organizer?.name || 'Unknown'}</span>
                  <div className="flex items-center gap-1.5">
                    {ev.isFeatured && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured
                      </span>
                    )}
                    <span className={`text-xs font-bold ${ev.isFree ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {ev.isFree ? 'FREE' : `₹${ev.price}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <p className="text-xs text-slate-600 text-center">
          Showing {filtered.length} of {events.length} events
        </p>
      )}
    </div>
  );
}
