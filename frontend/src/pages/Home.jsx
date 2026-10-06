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
  Calendar,
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

const ATMOSPHERE_CARDS = [
  {
    title: 'Live Concerts & Festivals',
    subtitle: 'Electrifying sound & live stages',
    tag: 'Music',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    link: '/events?category=music',
  },
  {
    title: 'Global Tech Summits',
    subtitle: 'Keynotes, AI demos & hackathons',
    tag: 'Technology',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    link: '/events?category=technology',
  },
  {
    title: 'Creative Arts & Design',
    subtitle: 'Exhibitions & interactive workshops',
    tag: 'Arts',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80',
    link: '/events?category=arts',
  },
  {
    title: 'Founder & VIP Mixers',
    subtitle: 'Curated networking & executive talks',
    tag: 'Business',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
    link: '/events?category=business',
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
      <section className="relative pt-6 sm:pt-10 pb-12 overflow-hidden">
        {/* Ambient lighting & subtle gradient backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(99,102,241,0.22),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(99,102,241,0.18),rgba(2,6,23,0))] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-pink-500/20 dark:from-indigo-600/18 dark:via-purple-600/12 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-pink-500/15 dark:bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Search, Social Proof */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Live Platform Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 backdrop-blur-md shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Event Platform for Next-Gen Experiences</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Discover Extraordinary Events
                <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  with Instant QR Passes
                </span>
              </h1>

              {/* Subheading */}
              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Join premier tech summits, design conferences, workshops, and music festivals. Instant cryptographic entry passes, verified admission, and zero gate queues.
              </p>

              {/* Interactive Command Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="w-full max-w-2xl mx-auto lg:mx-0 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20"
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

                {/* Subtle Divider */}
                <div className="hidden sm:block h-7 w-px bg-slate-200 dark:bg-slate-800" />

                {/* Location selector */}
                <div className="flex items-center gap-2 px-3 py-2 text-slate-400">
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

                {/* Submit button */}
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Find Events</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Discovery Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
                  Popular:
                </span>
                {[
                  { label: '🔥 Trending', query: 'sortBy=date' },
                  { label: '💻 Tech & AI', query: 'category=technology' },
                  { label: '🎨 Arts & Design', query: 'category=arts' },
                  { label: '🎵 Music', query: 'category=music' },
                  { label: '💼 Business', query: 'category=business' },
                  { label: '⚡ Free Passes', query: 'isFree=true' },
                ].map((pill, idx) => (
                  <Link
                    key={idx}
                    to={`/events?${pill.query}`}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all hover:scale-105 hover:border-indigo-400/50"
                  >
                    {pill.label}
                  </Link>
                ))}
              </div>

              {/* Social Proof & Trust Strip */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/80 shadow-xs text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                      AK
                    </div>
                    <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                      SR
                    </div>
                    <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                      VT
                    </div>
                    <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                      +
                    </div>
                  </div>
                  <span><strong className="text-slate-900 dark:text-white font-semibold">12,500+</strong> registered</span>
                </div>

                <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>

                <div className="flex items-center gap-1.5 font-medium">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span><strong className="text-slate-900 dark:text-white font-semibold">4.9/5</strong></span>
                </div>

                <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>

                <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Instant QR Check-in</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Hero Event Experience Image */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Ambient glowing backlight */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-pink-500/30 rounded-3xl blur-2xl opacity-70 dark:opacity-50 pointer-events-none" />

              {/* Main Hero Image Showcase Card */}
              <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-indigo-500/20 group">
                <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden">
                  <img
                    src="/hero-events.jpg"
                    alt="Live Event Experience"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                  {/* Floating Top Pill */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/70 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      500+ Live Experiences
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-600/80 text-white backdrop-blur-md shadow-lg">
                      Concerts • Summits
                    </span>
                  </div>

                  {/* Floating Bottom Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white shadow-xl flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-bold text-indigo-400">
                        EventHub Atmosphere
                      </p>
                      <p className="text-sm font-extrabold text-white">
                        Instant QR Entry Guaranteed
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <span>⚡ 0.4s Scan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating mini review chip */}
              <div className="absolute -bottom-3 -left-2 sm:left-4 z-20 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                <div className="flex text-amber-400 text-xs">
                  ★★★★★
                </div>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span>12,000+ Happy Attendees</span>
              </div>
            </div>

          </div>

          {/* Highlights bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto pt-14 border-t border-slate-200/60 dark:border-slate-800/60 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm hover:border-indigo-400/50 hover:shadow-xs transition-all">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">QR Check-in</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">1-second gate scan</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm hover:border-emerald-400/50 hover:shadow-xs transition-all">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Safe & Verified</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cryptographic tickets</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm hover:border-purple-400/50 hover:shadow-xs transition-all">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Zero Waitlist</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Instant registration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm hover:border-amber-400/50 hover:shadow-xs transition-all">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Live Analytics</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Turnout tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ATMOSPHERE & VISUAL EXPERIENCES GALLERY ──────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Live Atmosphere
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Experience the Energy
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              From electric stadium concerts to cutting-edge AI demo stages
            </p>
          </div>
          <Link
            to="/events"
            className="hidden sm:flex text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline items-center gap-1"
          >
            Explore all experiences <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ATMOSPHERE_CARDS.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800/80 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-1.5"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 dark:bg-black/30 backdrop-blur-md text-white border border-white/20">
                  {card.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-extrabold text-base sm:text-lg leading-snug group-hover:text-indigo-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {card.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── POPULAR CATEGORIES (PHOTOGRAPHIC CARDS) ──────────────── */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Explore Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Find events curated by topic, craft, and passion
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const bgImage = CATEGORY_IMAGES[cat.name] || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80';
            return (
              <Link
                key={cat.id}
                to={`/events?category=${cat.slug}`}
                className="group relative h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-indigo-400/60 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background photo */}
                <img
                  src={bgImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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

      {/* ─── FEATURED EVENTS ─────────────────────────────────────── */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Featured Events
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hand-picked conferences, concerts, and workshops not to miss
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

      {/* ─── ORGANIZER BANNER CTA (WITH REALISTIC SCANNER VISUAL) ──── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-indigo-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md inline-block border border-white/20">
                For Event Creators & Organizers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Ready to Host Your Next Gathering?
              </h2>
              <p className="text-indigo-200 text-sm leading-relaxed max-w-xl">
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
                  to="/events"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 font-semibold text-sm transition-all"
                >
                  Explore Features
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
