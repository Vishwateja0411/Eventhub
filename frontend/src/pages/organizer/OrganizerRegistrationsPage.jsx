import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Mail,
  Calendar,
} from 'lucide-react';
import client from '../../api/client';

export default function OrganizerRegistrationsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [rosters, setRosters] = useState({});
  const [rosterLoading, setRosterLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client.get('/events/organizer/my-events');
        if (res.data?.success) setEvents(res.data.events || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const toggleExpand = async (eventId) => {
    if (expanded === eventId) {
      setExpanded(null);
      return;
    }
    setExpanded(eventId);
    if (rosters[eventId]) return; // already loaded

    setRosterLoading(true);
    try {
      const res = await client.get(`/events/${eventId}/registrations`);
      if (res.data?.success) {
        setRosters((prev) => ({ ...prev, [eventId]: res.data.registrations || [] }));
      }
    } catch (e) {
      console.error(e);
      setRosters((prev) => ({ ...prev, [eventId]: [] }));
    } finally {
      setRosterLoading(false);
    }
  };

  const filteredEvents = events.filter((ev) =>
    ev.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Registrations</h1>
        <p className="text-slate-500 text-sm mt-1">
          View and manage attendee rosters for your events.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search your events…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-sm">No events found.</div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden"
            >
              {/* Event Row */}
              <button
                onClick={() => toggleExpand(ev.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm truncate">{ev.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(ev.startDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {ev._count?.registrations || 0} registrations
                    </span>
                  </div>
                </div>
                {expanded === ev.id ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {/* Expanded Roster */}
              {expanded === ev.id && (
                <div className="border-t border-slate-800">
                  {rosterLoading && !rosters[ev.id] ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (rosters[ev.id] || []).length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No registrations yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3">Attendee</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Registered</th>
                            <th className="px-5 py-3">Check-in</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {(rosters[ev.id] || []).map((reg) => (
                            <tr key={reg.id} className="hover:bg-slate-800/20">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-indigo-900/60 text-indigo-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                                    {reg.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-200">{reg.user?.name}</p>
                                    <p className="text-slate-500 flex items-center gap-1">
                                      <Mail className="w-2.5 h-2.5" /> {reg.user?.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                    reg.status === 'CONFIRMED'
                                      ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50'
                                      : 'bg-amber-950/50 text-amber-300 border-amber-800/50'
                                  }`}
                                >
                                  {reg.status}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(reg.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                  })}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                {reg.ticket?.attendance ? (
                                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                                  </span>
                                ) : (
                                  <span className="text-slate-600">Pending</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
