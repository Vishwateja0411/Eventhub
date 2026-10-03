import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import EventCard from '../components/events/EventCard';
import EventFilterBar from '../components/events/EventFilterBar';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state initialized from URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [priceFilter, setPriceFilter] = useState(searchParams.get('isFree') === 'true' ? 'free' : 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'date');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);

  // Load categories
  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategories(res.data?.categories || []);
    });
  }, []);

  // Fetch events on filter change
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedCity) params.set('city', selectedCity);
        if (priceFilter === 'free') params.set('isFree', 'true');
        if (priceFilter === 'paid') params.set('isFree', 'false');
        if (sortBy) params.set('sortBy', sortBy);
        params.set('page', page.toString());
        params.set('limit', '9');

        // Sync with browser URL
        setSearchParams(params, { replace: true });

        const res = await api.get(`/events?${params.toString()}`);
        setEvents(res.data?.events || []);
        setPagination(res.data?.pagination || { total: 0, totalPages: 1, page: 1 });
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchEvents, 200); // 200ms debounce
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedCity, priceFilter, sortBy, page]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedCity('');
    setPriceFilter('all');
    setSortBy('date');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Explore Events
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Showing {pagination.total} events available across all categories
        </p>
      </div>

      {/* Filter Bar */}
      <EventFilterBar
        search={search}
        setSearch={(val) => { setSearch(val); setPage(1); }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(val) => { setSelectedCategory(val); setPage(1); }}
        categories={categories}
        selectedCity={selectedCity}
        setSelectedCity={(val) => { setSelectedCity(val); setPage(1); }}
        priceFilter={priceFilter}
        setPriceFilter={(val) => { setPriceFilter(val); setPage(1); }}
        sortBy={sortBy}
        setSortBy={(val) => { setSortBy(val); setPage(1); }}
        resetFilters={resetFilters}
      />

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl max-w-lg mx-auto p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Events Found</h3>
          <p className="text-xs text-slate-500">
            No events match your current filter criteria. Try adjusting your search keywords or resetting filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
