import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import EventCard from '../components/events/EventCard';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  QrCode,
  Zap,
} from 'lucide-react';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, catsRes] = await Promise.all([
          api.get('/events/featured'),
          api.get('/categories'),
        ]);
        setFeaturedEvents(eventsRes.data.events || []);
        setCategories(catsRes.data.categories || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow orb background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-6 backdrop-blur-md shadow-xs animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>The Modern Event Platform for Creators & Communities</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Discover Unforgettable Experiences with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Instant QR Ticketing
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
            Find tech conferences, design summits, hands-on workshops, and music fests. Register in seconds and gain seamless check-in entry with cryptographic digital passes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
            >
              Explore All Events <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/events/create"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl glass-card font-semibold text-slate-800 dark:text-slate-100 hover:border-indigo-400 transition-all text-center"
            >
              Host an Event
            </Link>
          </div>

          {/* Highlights bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto pt-10 border-t border-slate-200/60 dark:border-slate-800/60 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">QR Check-in</p>
                <p className="text-xs text-slate-500">1-second gate scan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Safe & Verified</p>
                <p className="text-xs text-slate-500">Cryptographic tickets</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Zero Waitlist</p>
                <p className="text-xs text-slate-500">Instant registration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Live Analytics</p>
                <p className="text-xs text-slate-500">Turnout tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── POPULAR CATEGORIES ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Explore Categories</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Find events curated by topic and discipline
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/events?category=${cat.slug}`}
              className="glass-card p-5 rounded-2xl hover:border-indigo-400 hover:shadow-glow transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {cat.icon || '🎯'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {cat.eventCount || 0} upcoming
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED EVENTS ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Events</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hand-picked conferences and workshops not to miss
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            See all events <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-card rounded-2xl">
            <p className="text-sm text-slate-500">No featured events found right now.</p>
          </div>
        )}
      </section>

      {/* ─── ORGANIZER BANNER CTA ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 sm:p-14 shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md inline-block">
              For Organizers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Host Your Next Gathering?
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Create an event in under 2 minutes. Manage registrations, set capacity limits, upload media banners, and check in your guests at the venue with the built-in QR scanner.
            </p>
            <div className="pt-2">
              <Link
                to="/events/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm hover:bg-indigo-50 shadow-lg hover:scale-105 transition-all"
              >
                Create Event Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
