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
  Sparkles,
  Layers,
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
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* ─── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-6 sm:pt-12 pb-8 overflow-hidden">
        {/* Ambient lighting & subtle gradient backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(99,102,241,0.2),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(99,102,241,0.18),rgba(7,11,20,0))] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Search, Trust Indicators */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  Discover Events Worth Experiencing
                </h1>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Instant QR Passes. Seamless Entry.
                </p>
              </div>

              {/* Description */}
              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Discover conferences, workshops, concerts, festivals, and professional events. Book your seat and receive a secure QR pass for instant entry.
              </p>

              {/* 64-72px High Search Interface */}
              <form
                onSubmit={handleHeroSearch}
                className="w-full max-w-2xl mx-auto lg:mx-0 min-h-[64px] sm:h-[68px] p-2 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-indigo-500/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all duration-300 hover:border-indigo-400/50 focus-within:border-indigo-500/60 focus-within:ring-4 focus-within:ring-indigo-500/15"
              >
                {/* Keyword Search Input */}
                <div className="flex-1 flex items-center gap-3 px-3.5 py-2 text-slate-400">
                  <Search className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, conferences, workshops..."
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none font-medium"
                  />
                </div>

                {/* Subtle Divider */}
                <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />

                {/* City Selector */}
                <div className="flex items-center gap-2 px-3.5 py-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-300 outline-none cursor-pointer pr-2 font-medium"
                  >
                    <option value="" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">All Cities</option>
                    <option value="Bangalore" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Bengaluru</option>
                    <option value="Mumbai" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Mumbai</option>
                    <option value="Delhi" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Delhi NCR</option>
                    <option value="Hyderabad" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Hyderabad</option>
                    <option value="Online" className="dark:bg-slate-900 text-slate-700 dark:text-slate-300">Online / Virtual</option>
                  </select>
                </div>

                {/* Hero Primary CTA: Find Events */}
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Find Events</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 3-4 Popular Category Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                <Link
                  to="/events"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all hover:-translate-y-0.5"
                >
                  🔥 Trending
                </Link>
                <Link
                  to="/events?category=technology"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all hover:-translate-y-0.5"
                >
                  💻 Tech & AI
                </Link>
                <Link
                  to="/events?category=arts"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all hover:-translate-y-0.5"
                >
                  🎨 Arts & Design
                </Link>
                <Link
                  to="/events?category=music"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all hover:-translate-y-0.5"
                >
                  🎵 Music
                </Link>
              </div>

              {/* Trust-Focused Messaging (Replacing excessive statistics) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified Events
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Secure QR Passes
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Instant Check-in
                </span>
              </div>
            </div>

            {/* Right Column: Premium Event Image with 2 Floating Cards */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Subtle ambient glowing backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-pink-500/20 rounded-[28px] blur-2xl opacity-60 pointer-events-none" />

              {/* Main Event Showcase Card */}
              <div className="relative w-full max-w-sm sm:max-w-md rounded-[24px] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-indigo-500/15 group">
                <div className="relative h-[400px] sm:h-[440px] w-full overflow-hidden bg-slate-950">
                  <img
                    src="/hero-events.jpg"
                    alt="Live Event Experience"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                  {/* Floating Card 1: Top Pill */}
                  <div className="absolute top-4 left-4">
                    <div className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/75 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      500+ Live Experiences
                    </div>
                  </div>

                  {/* Floating Card 2: Bottom Info Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white shadow-xl flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-bold text-indigo-400">
                        EventHub Access
                      </p>
                      <p className="text-sm font-extrabold text-white">
                        Instant QR Entry
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <span>⚡ 0.4s Scan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. FOUR-CARD FEATURE SECTION ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-900/50">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              QR Check-in
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Fast, secure entry with instant QR scanning.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-emerald-400/50 dark:hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-900/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Verified Events
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Discover events from trusted organizers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 border border-purple-100 dark:border-purple-900/50">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Secure Payments
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Safe and reliable event ticket payments.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-amber-400/50 dark:hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-100 dark:border-amber-900/50">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Live Analytics
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time attendance and event insights.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS SECTION ────────────────────────────────── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Frictionless Process
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Your Event Journey, Simplified
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            From discovering extraordinary experiences to walking through the gate in seconds.
          </p>
        </div>

        {/* 4-Step Horizontal Timeline on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connector line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 -translate-y-8 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {/* Step 01 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400/60 shadow-sm transition-all flex flex-col items-start group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-indigo-500/30 mb-4 group-hover:scale-105 transition-transform">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Discover an Event
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Explore curated conferences, workshops, and concerts matched to your craft and passions.
              </p>
            </div>

            {/* Step 02 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-400/60 shadow-sm transition-all flex flex-col items-start group">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-purple-500/30 mb-4 group-hover:scale-105 transition-transform">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Book Your Seat
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose ticket tiers and complete fast, encrypted checkout with instant seat confirmation.
              </p>
            </div>

            {/* Step 03 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-pink-400/60 shadow-sm transition-all flex flex-col items-start group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-pink-500/30 mb-4 group-hover:scale-105 transition-transform">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Get Your QR Pass
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Receive an authenticated cryptographic digital entry pass stored in your account wallet.
              </p>
            </div>

            {/* Step 04 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-400/60 shadow-sm transition-all flex flex-col items-start group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-emerald-500/30 mb-4 group-hover:scale-105 transition-transform">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Scan & Enter
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Present your QR code at the venue entrance for seamless 0.4-second contactless admission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. FEATURED EVENTS SECTION ─────────────────────────────── */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hand-picked conferences, concerts, and workshops not to miss
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>View All Events</span>
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

      {/* ─── 5. POPULAR CATEGORIES ──────────────────────────────────── */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Explore Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find events curated by topic, craft, and passion
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
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
                className="group relative h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-indigo-400/60 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background photo */}
                <img
                  src={bgImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20 group-hover:via-slate-950/50 transition-colors" />

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg border border-white/20 group-hover:scale-110 transition-transform">
                    {cat.icon || '🎯'}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
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

      {/* ─── 6. TRUST & SECURITY SECTION ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              <Lock className="w-3.5 h-3.5" />
              <span>Tamper-Proof Ticketing</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Every Ticket. Verified.
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Your EventHub QR pass is securely generated and verified at entry, helping organizers prevent duplicate or invalid tickets.
            </p>

            {/* Three small benefits */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Secure QR Verification
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Encrypted gate tokens
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Real-time Validation
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Zero duplicate entry
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Fast Gate Check-in
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sub-second camera scan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. ORGANIZER CTA BANNER ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-indigo-800/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md inline-block border border-white/20">
                For Event Creators & Organizers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Ready to Host Your Next Gathering?
              </h2>
              <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed max-w-xl">
                Create an event in under 2 minutes. Issue instant cryptographic digital passes, track real-time attendance analytics, and admit guests with our ultra-fast venue QR camera scanner.
              </p>
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  to="/events/create"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  Create Event Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/organizer/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 font-semibold text-sm transition-all"
                >
                  Organizer Dashboard
                </Link>
              </div>
            </div>

            {/* Organizer Venue Photo & Mockup */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
                  alt="Organizer Venue Admission"
                  className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Floating Admission Mock Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">Admitted — Valid Pass</p>
                      <p className="text-[10px] text-emerald-300">Verified in 0.3s</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    GATE 1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
