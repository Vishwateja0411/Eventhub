import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  Plus,
  QrCode,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, icon: Icon, iconClass }) => (
  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 transition-colors">
    <div className={`p-3 rounded-xl flex-shrink-0 ${iconClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

export default function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const totalAttendees = events.reduce((s, e) => s + (e._count?.registrations || 0), 0);
  const totalCapacity = events.reduce((s, e) => s + (e.capacity || 0), 0);
  const totalCheckedIn = events.reduce((s, e) => s + (e._count?.attendance || 0), 0);
  const avgTurnout = totalAttendees > 0 ? Math.round((totalCheckedIn / totalAttendees) * 100) : 0;

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest border border-indigo-200 dark:border-indigo-700/40">
              <Sparkles className="w-3 h-3" /> Organizer Portal
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Here's your event performance overview.
          </p>
        </div>
        <Link
          to="/organizer/create-event"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Event
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Events"
          value={events.length}
          icon={Calendar}
          iconClass="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          label="Total Registrations"
          value={totalAttendees}
          icon={Users}
          iconClass="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          label="Check-ins"
          value={totalCheckedIn}
          icon={CheckCircle2}
          iconClass="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Avg Turnout"
          value={`${avgTurnout}%`}
          icon={TrendingUp}
          iconClass="bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/organizer/create-event"
          className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 dark:from-indigo-900/40 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800/40 hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-xs transition-colors group"
        >
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-bold text-sm">Create Event</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Launch a new event</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ml-auto transition-colors" />
        </Link>
        <Link
          to="/organizer/registrations"
          className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-colors group"
        >
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-bold text-sm">Registrations</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">View attendee rosters</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 ml-auto transition-colors" />
        </Link>
        <Link
          to="/organizer/scanner"
          className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-colors group"
        >
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-bold text-sm">QR Scanner</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Check-in attendees</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 ml-auto transition-colors" />
        </Link>
      </div>

      {/* Recent Events */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Events</h3>
          <Link
            to="/organizer/events"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
            No events yet.{' '}
            <Link to="/organizer/create-event" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Create your first event!
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                {ev.bannerUrl ? (
                  <img
                    src={ev.bannerUrl}
                    alt={ev.title}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{ev.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ev.startDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {ev.city}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {ev._count?.registrations || 0}
                    </span>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    ev.status === 'PUBLISHED'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                      : ev.status === 'DRAFT'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50'
                  }`}
                >
                  {ev.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
