import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';

export default function EventCard({ event }) {
  const startDate = new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isSoldOut = event.spotsLeft <= 0;
  const isFree = event.isFree || event.price === 0;

  return (
    <div className="group glass-card rounded-2xl overflow-hidden hover:shadow-glow transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Banner Media */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-tr from-indigo-900 to-slate-900">
        {event.bannerUrl ? (
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 text-center bg-gradient-to-br from-indigo-600 to-purple-800 text-white">
            <span className="font-bold text-lg">{event.title}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {event.category && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-sm">
              {event.category.name}
            </span>
          )}
          {event.isFeatured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Pricing Badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
              isFree
                ? 'bg-emerald-500 text-white'
                : 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white'
            }`}
          >
            {isFree ? 'FREE' : `₹${event.price}`}
          </span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Location */}
          <div className="flex items-center gap-3 text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate} • {formattedTime}
            </span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              {event.city}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
            <Link to={`/events/${event.slug || event.id}`}>{event.title}</Link>
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Users className="w-3.5 h-3.5" />
            {isSoldOut ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">Sold Out</span>
            ) : (
              <span>
                <strong className="text-slate-900 dark:text-slate-200">{event.spotsLeft}</strong> spots left
              </span>
            )}
          </div>

          <Link
            to={`/events/${event.slug || event.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:translate-x-0.5 transition-transform"
          >
            Details <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
