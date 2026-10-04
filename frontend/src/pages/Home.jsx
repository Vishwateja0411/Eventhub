import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import EventCard from '../components/events/EventCard';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  QrCode,
  Zap,
  Search,
  MapPin,
  Star,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

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

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCity.trim()) params.set('city', selectedCity.trim());
    navigate(`/events?${params.toString()}`);
  };

  return (
    <div className="space-y-24 pb-24">
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-8 sm:pt-14 pb-16 overflow-hidden">
        {/* Ambient lighting mesh background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/15 dark:from-indigo-600/15 dark:via-purple-600/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 mb-6 backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>The Modern Event Platform for Creators & Communities</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-5 max-w-4xl mx-auto">
            Discover Unforgettable Experiences with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Instant QR Ticketing
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Find tech conferences, design summits, hands-on workshops, and music fests. Register in seconds and gain seamless check-in entry with cryptographic digital passes.
          </p>

          {/* Interactive Hero Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="w-full max-w-3xl mx-auto p-2 sm:p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-500/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4"
          >
            {/* Keyword Input */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2 text-slate-400">
              <Search className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conferences, workshops, festivals, topics..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
              />
            </div>

            {/* Location selector */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 border-l border-slate-200 dark:border-slate-800 text-slate-400">
              <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-300 outline-none cursor-pointer pr-2"
              >
                <option value="" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">All Cities</option>
                <option value="Bengaluru" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Bengaluru</option>
                <option value="Mumbai" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Mumbai</option>
                <option value="Delhi" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Delhi NCR</option>
                <option value="Hyderabad" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Hyderabad</option>
                <option value="Online" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Online / Virtual</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Find Events
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Discovery Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Popular:
            </span>
            {[
              { label: '🔥 Trending', query: 'sortBy=date' },
              { label: '💻 Tech & AI', query: 'category=technology' },
              { label: '🎨 Design', query: 'category=design' },
              { label: '🎵 Music', query: 'category=music' },
              { label: '💼 Business', query: 'category=business' },
              { label: '⚡ Free Events', query: 'isFree=true' },
            ].map((pill, idx) => (
              <Link
                key={idx}
                to={`/events?${pill.query}`}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-all hover:scale-105"
              >
                {pill.label}
              </Link>
            ))}
          </div>

          {/* Social Proof & Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 mb-12">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  AK
                </div>
                <div className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  SR
                </div>
                <div className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  VT
                </div>
                <div className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  +
                </div>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">12,500+ attendees</span> registered
            </div>

            <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>

            <div className="flex items-center gap-1.5 font-medium">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">4.9/5</span> rating
            </div>

            <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>

            <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cryptographic QR Verified</span>
            </div>
          </div>

          {/* Highlights bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-sm hover:border-indigo-400/50 transition-all">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">QR Check-in</p>
                <p className="text-xs text-slate-500">1-second gate scan</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-sm hover:border-emerald-400/50 transition-all">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Safe & Verified</p>
                <p className="text-xs text-slate-500">Cryptographic tickets</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-sm hover:border-purple-400/50 transition-all">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Zero Waitlist</p>
                <p className="text-xs text-slate-500">Instant registration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-sm hover:border-amber-400/50 transition-all">
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
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
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
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
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
