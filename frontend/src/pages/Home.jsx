import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import EventCard from '../components/events/EventCard';
import {
  Search,
  MapPin,
  ArrowRight,
  QrCode,
  ShieldCheck,
  CreditCard,
  BarChart3,
  CheckCircle2,
  Lock,
  Zap,
  Calendar,
  Layers,
  Sparkles,
  Ticket,
} from 'lucide-react';

const CATEGORY_IMAGES = {
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
  Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  Arts: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&auto=format&fit=crop&q=80',
  Business: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
  Education: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
  Food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
  Health: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
};

const FALLBACK_FEATURED_EVENTS = [
  {
    id: 'f-1',
    slug: 'global-tech-summit-2026',
    title: 'Global AI & Web3 Summit 2026',
    description: 'Join industry pioneers for deep dives into autonomous AI systems, blockchain infrastructure, and developer ecosystems.',
    category: { name: 'Technology' },
    city: 'Bengaluru',
    startDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    price: 999,
    spotsLeft: 84,
    organizer: { name: 'TechCon Innovations' },
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'f-2',
    slug: 'pulse-electronic-music-fest',
    title: 'Pulse Neon Music & Lights Festival',
    description: 'An immersive audio-visual festival featuring headline international electronic artists and multi-genre stages.',
    category: { name: 'Music' },
    city: 'Mumbai',
    startDate: new Date(Date.now() + 86400000 * 22).toISOString(),
    price: 1499,
    spotsLeft: 120,
    organizer: { name: 'VibeWorks Live' },
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'f-3',
    slug: 'founder-scaleup-conclave',
    title: 'NextScale Founders & Product Conclave',
    description: 'Exclusive masterclasses, venture pitch sessions, and product design roundtables with tier-1 founders.',
    category: { name: 'Business' },
    city: 'Delhi NCR',
    startDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    price: 0,
    isFree: true,
    spotsLeft: 35,
    organizer: { name: 'VentureScale Network' },
    bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
  },
];

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
        const eventsData = eventsRes.data.events || [];
        setFeaturedEvents(eventsData.length > 0 ? eventsData : FALLBACK_FEATURED_EVENTS);
        setCategories(catsRes.data.categories || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
        setFeaturedEvents(FALLBACK_FEATURED_EVENTS);
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
    <div className="space-y-24 sm:space-y-32 pb-24 bg-white dark:bg-[#070B1A] transition-colors">
      
      {/* ─── 1. ENTERPRISE CINEMATIC HERO SECTION ─────────────────────── */}
      <section className="relative min-h-[85vh] lg:h-[88vh] flex items-center overflow-hidden">
        {/* Full-width 16:9 cinematic event hall background */}
        <img
          src="/enterprise-event-hero.jpg"
          alt="Premier Event Convention Hall"
          className="absolute inset-0 w-full h-full object-cover object-center scale-100"
        />

        {/* Smooth Photographic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B1A] via-[#070B1A]/90 via-[#070B1A]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B1A] via-transparent to-[#070B1A]/50" />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 sm:py-12 flex flex-col justify-between h-full">
          
          <div className="max-w-3xl space-y-6 pt-2 sm:pt-4 text-left">
            {/* Small Eyebrow Text */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-widest text-[#C4B5FD]">
              <Sparkles className="w-3.5 h-3.5 text-[#C4B5FD]" />
              <span>The Future of Event Experiences</span>
            </div>

            {/* Main Headline (Tight tracking, refined gradient) */}
            <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-black uppercase tracking-[-0.03em] text-white leading-[0.98] sm:leading-[1.02]">
              DISCOVER EVENTS <br />
              WORTH{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D7BFF] via-[#C4B5FD] to-[#DDD6FE]">
                EXPERIENCING.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Discover, book, and experience extraordinary events with seamless digital tickets and instant QR entry.
            </p>

            {/* Two Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/events"
                className="px-8 py-3.5 rounded-lg bg-[#6C4DF6] hover:bg-[#5839E6] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#6C4DF6]/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>EXPLORE EVENTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/events/create"
                className="px-7 py-3.5 rounded-lg border border-white/30 hover:border-white/70 bg-white/[0.04] hover:bg-white/[0.1] text-white font-bold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>HOST AN EVENT</span>
              </Link>
            </div>

            {/* High-Contrast Luxury Search Interface */}
            <form
              onSubmit={handleHeroSearch}
              className="w-full max-w-2xl p-2 rounded-xl bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/10 mt-6"
            >
              {/* Keyword Search */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 text-slate-300 min-w-0">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conferences, workshops, summits..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none font-medium truncate"
                />
              </div>

              {/* Subtle Divider */}
              <div className="hidden sm:block h-7 w-px bg-white/15" />

              {/* City Selector */}
              <div className="flex items-center gap-2 px-3 py-2 text-slate-300 shrink-0">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-white outline-none cursor-pointer pr-2 font-medium"
                >
                  <option value="" className="bg-[#070B1A] text-white">All Cities</option>
                  <option value="Bangalore" className="bg-[#070B1A] text-white">Bengaluru</option>
                  <option value="Mumbai" className="bg-[#070B1A] text-white">Mumbai</option>
                  <option value="Delhi" className="bg-[#070B1A] text-white">Delhi NCR</option>
                  <option value="Hyderabad" className="bg-[#070B1A] text-white">Hyderabad</option>
                  <option value="Online" className="bg-[#070B1A] text-white">Online / Virtual</option>
                </select>
              </div>

              {/* High-Contrast Luxury Search Trigger (Eliminates Purple Button Clash) */}
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm shrink-0"
              >
                <span>FIND EVENTS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Bottom Hero Trust Row */}
          <div className="pt-6 sm:pt-8 border-t border-white/10 mt-6 sm:mt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#C4B5FD]" />
              <span>Instant QR Entry</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C4B5FD]" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C4B5FD]" />
              <span>Verified Events</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C4B5FD]" />
              <span>Real-Time Booking</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 2. EVERYTHING YOU NEED FOR BETTER EVENTS ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6C4DF6] dark:text-[#A78BFA]">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-1">
            Everything You Need for Better Events
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            From discovering events to instant check-in, EventHub makes every step simple.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 01 */}
          <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-[#6C4DF6]/50 transition-all group">
            <div className="text-xs font-black text-[#6C4DF6] dark:text-[#A78BFA] uppercase tracking-widest mb-3">
              01
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#6C4DF6]/10 text-[#6C4DF6] dark:text-[#A78BFA] flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Discover Events
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Find concerts, conferences, workshops, sports and experiences.
            </p>
          </div>

          {/* Card 02 */}
          <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-[#6C4DF6]/50 transition-all group">
            <div className="text-xs font-black text-[#6C4DF6] dark:text-[#A78BFA] uppercase tracking-widest mb-3">
              02
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Simple Booking
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Book your event in just a few clicks with secure checkout.
            </p>
          </div>

          {/* Card 03 */}
          <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-[#6C4DF6]/50 transition-all group">
            <div className="text-xs font-black text-[#6C4DF6] dark:text-[#A78BFA] uppercase tracking-widest mb-3">
              03
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Ticket className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Instant QR Pass
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive your digital ticket instantly in your personal wallet.
            </p>
          </div>

          {/* Card 04 */}
          <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-[#6C4DF6]/50 transition-all group">
            <div className="text-xs font-black text-[#6C4DF6] dark:text-[#A78BFA] uppercase tracking-widest mb-3">
              04
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Fast Check-In
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Scan your QR code and enter without waiting at venue gates.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. FEATURED EVENTS: "EVENTS WORTH EXPERIENCING" ──────────── */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C4DF6] dark:text-[#A78BFA]">
              PREMIER EVENT CATALOG
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-1">
              EVENTS WORTH EXPERIENCING
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hand-picked conferences, concerts, and workshops not to miss
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6C4DF6] dark:text-[#A78BFA] hover:underline"
          >
            <span>VIEW ALL EVENTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-[18px] bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id || evt.slug} event={evt} />
            ))}
          </div>
        )}
      </section>

      {/* ─── 4. HOW IT WORKS SECTION ────────────────────────────────── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C4DF6] dark:text-[#A78BFA]">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-1">
              Your Event Journey, Simplified
            </h2>
          </div>

          {/* 4 Steps Horizontal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <span className="text-2xl font-black text-[#6C4DF6] dark:text-[#A78BFA]">01</span>
              <h3 className="text-base font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                DISCOVER
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Find an event you love across top categories.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-2xl font-black text-[#6C4DF6] dark:text-[#A78BFA]">02</span>
              <h3 className="text-base font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                BOOK
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Choose your ticket and complete secure payment.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-2xl font-black text-[#6C4DF6] dark:text-[#A78BFA]">03</span>
              <h3 className="text-base font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                GET YOUR QR
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Receive your digital event pass instantly.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-2xl font-black text-[#6C4DF6] dark:text-[#A78BFA]">04</span>
              <h3 className="text-base font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                ENTER
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Scan your QR and enjoy the event with zero wait.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. POPULAR CATEGORIES ──────────────────────────────────── */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              EXPLORE BY CATEGORY
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find events curated by topic, craft, and passion
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6C4DF6] dark:text-[#A78BFA] hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const bgImage = CATEGORY_IMAGES[cat.name] || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80';
            return (
              <Link
                key={cat.id}
                to={`/events?category=${cat.slug || cat.name?.toLowerCase()}`}
                className="group relative h-40 sm:h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={bgImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B1A] via-[#070B1A]/60 to-transparent" />

                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg border border-white/20">
                    {cat.icon || '🎯'}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-white group-hover:text-[#A78BFA] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-slate-300 font-medium">
                      {cat.eventCount || 0} upcoming
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── 6. ORGANIZER SECTION (ENTERPRISE DEDICATED) ─────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#070B1A] via-[#0E1530] to-[#070B1A] text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Headline & Description */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="px-3.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest bg-white/10 border border-white/15 text-[#A78BFA] inline-block">
                FOR EVENT CREATORS & ORGANIZERS
              </span>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-[1.08]">
                YOUR EVENT. <br />
                YOUR AUDIENCE. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]">
                  YOUR PLATFORM.
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Create events, manage registrations, track bookings, and deliver seamless experiences from one powerful dashboard.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/events/create"
                  className="px-8 py-4 rounded-lg bg-[#6C4DF6] hover:bg-[#5B3FE0] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#6C4DF6]/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>CREATE AN EVENT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/organizer/dashboard"
                  className="px-7 py-4 rounded-lg border-2 border-white/80 hover:border-white hover:bg-white/10 text-white font-extrabold text-sm uppercase tracking-wider transition-all"
                >
                  <span>ORGANIZER DASHBOARD</span>
                </Link>
              </div>
            </div>

            {/* Right Mockup / Venue Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
                  alt="Organizer Dashboard & Event Operations"
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B1A] via-[#070B1A]/40 to-transparent" />

                {/* Floating Metric Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0c1024]/90 backdrop-blur-md border border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Admitted — Verified Pass</p>
                      <p className="text-[10px] text-emerald-400 font-mono">0.3s gate check-in</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#6C4DF6]/30 text-[#A78BFA] font-bold border border-[#6C4DF6]/40">
                    GATE A
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 7. SECURITY & ENTERPRISE TRUST ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6C4DF6] dark:text-[#A78BFA]">
            ENTERPRISE PLATFORM TRUST
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-2 mb-8">
            BUILT FOR SEAMLESS EVENT EXPERIENCES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Secure Payments
              </span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Verified Event Organizers
              </span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Instant Digital Tickets
              </span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                QR-Based Entry
              </span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Real-Time Booking Updates
              </span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Organizer Analytics
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
