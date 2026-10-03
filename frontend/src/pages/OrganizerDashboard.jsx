import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  Plus,
  QrCode,
  Search,
  ExternalLink,
  ChevronRight,
  X,
  AlertCircle,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventRoster, setSelectedEventRoster] = useState(null);
  const [rosterAttendees, setRosterAttendees] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchOrganizerEvents = async () => {
    try {
      setLoading(true);
      const res = await client.get('/api/events/organizer/my-events');
      if (res.data?.success) {
        setEvents(res.data.events || []);
      }
    } catch (err) {
      console.error('Error fetching organizer events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  // Compute aggregate KPIs
  const totalEvents = events.length;
  const totalAttendees = events.reduce((sum, e) => sum + (e.attendeeCount || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const totalCheckedIn = events.reduce((sum, e) => sum + (e._count?.attendance || 0), 0);
  const avgTurnout = totalAttendees > 0 ? Math.round((totalCheckedIn / totalAttendees) * 100) : 0;

  // Open Attendee Roster Modal
  const openRoster = async (event) => {
    setSelectedEventRoster(event);
    setRosterAttendees([]);
    setRosterSearch('');
    try {
      setRosterLoading(true);
      const res = await client.get(`/api/registrations/event/${event.id}/attendees`);
      if (res.data?.success) {
        setRosterAttendees(res.data.attendees || []);
      }
    } catch (err) {
      console.error('Error fetching roster:', err);
    } finally {
      setRosterLoading(false);
    }
  };

  // Manual Check-in from Roster
  const handleManualCheckIn = async (ticketCode) => {
    try {
      const res = await client.post('/api/attendance/check-in', { ticketCode });
      if (res.data?.success) {
        setActionSuccess(`Checked in ${res.data.attendee.name}!`);
        // Refresh roster
        setRosterAttendees((prev) =>
          prev.map((att) =>
            att.ticketCode === ticketCode
              ? { ...att, isCheckedIn: true, checkedInAt: new Date().toISOString() }
              : att
          )
        );
        fetchOrganizerEvents();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed.');
    }
  };

  const filteredAttendees = rosterAttendees.filter((att) => {
    const q = rosterSearch.toLowerCase();
    return (
      att.user?.name?.toLowerCase().includes(q) ||
      att.user?.email?.toLowerCase().includes(q) ||
      att.ticketCode?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                Organizer Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Organizer Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Manage your hosted events, monitor capacity, review attendee rosters, and scan tickets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
            >
              <QrCode className="w-4 h-4 text-primary-500" />
              Venue QR Scanner
            </Link>
            <Link
              to="/events/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-lg shadow-primary-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Link>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium">{actionSuccess}</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Hosted Events
              </span>
              <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {totalEvents}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active & upcoming programs
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Registrations
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {totalAttendees}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across all hosted events
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Checked In
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {totalCheckedIn}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verified at venue
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Average Turnout
              </span>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {avgTurnout}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Attendance conversion rate
            </p>
          </div>
        </div>

        {/* Events Table / Cards */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hosted Events</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track capacity fill, check-ins, and inspect attendee rosters.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading your hosted events...
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No events hosted yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Ready to organize your first workshop, meetup, or conference? Create one in seconds.
              </p>
              <Link
                to="/events/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500"
              >
                <Plus className="w-4 h-4" />
                Create First Event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {events.map((evt) => {
                const fillPercent = Math.min(
                  100,
                  Math.round(((evt.attendeeCount || 0) / (evt.capacity || 1)) * 100)
                );
                return (
                  <div
                    key={evt.id}
                    className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {evt.bannerUrl ? (
                        <img
                          src={evt.bannerUrl}
                          alt={evt.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shrink-0 font-bold text-xl">
                          {evt.title.charAt(0)}
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {evt.category?.name || 'General'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              evt.status === 'PUBLISHED'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {evt.status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {evt.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(evt.startDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {evt.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Progress */}
                    <div className="lg:w-64 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          Capacity Fill
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {evt.attendeeCount || 0} / {evt.capacity} ({fillPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            fillPercent >= 90
                              ? 'bg-rose-500'
                              : fillPercent >= 50
                              ? 'bg-amber-500'
                              : 'bg-primary-500'
                          }`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 text-right">
                        {evt.spotsLeft} spots available
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => openRoster(evt)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-primary-500" />
                        Attendee Roster
                      </button>
                      <Link
                        to={`/scanner?eventId=${evt.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 dark:hover:bg-primary-900/60 flex items-center gap-1.5 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Scan QR
                      </Link>
                      <Link
                        to={`/events/${evt.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Attendee Roster Modal */}
        {selectedEventRoster && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Attendee Roster
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedEventRoster.title} • {rosterAttendees.length} confirmed registrations
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEventRoster(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search in Roster */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by attendee name, email, or ticket code..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Roster List */}
              <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
                {rosterLoading ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading attendees...
                  </div>
                ) : filteredAttendees.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No matching attendees found.
                  </div>
                ) : (
                  filteredAttendees.map((att) => (
                    <div
                      key={att.registrationId}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-xs">
                          {att.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {att.user?.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {att.user?.email}
                          </p>
                          <p className="text-[10px] font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                            Ticket: {att.ticketCode}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {att.isCheckedIn ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Checked In
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Pending
                            </span>
                            <button
                              onClick={() => handleManualCheckIn(att.ticketCode)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                            >
                              Check In
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
