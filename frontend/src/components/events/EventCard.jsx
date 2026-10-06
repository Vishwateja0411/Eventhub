import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';

const DEFAULT_CATEGORY_IMAGES = {
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
  Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
  Arts: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80',
  Business: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
  Education: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
  Food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  Health: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
};

const GENERIC_EVENT_IMAGE = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';

export default function EventCard({ event }) {
  const startDate = new Date(event.startDate || Date.now());
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isSoldOut = event.spotsLeft !== undefined && event.spotsLeft <= 0;
  const isFree = event.isFree || event.price === 0;
  const displayImage = event.bannerUrl || DEFAULT_CATEGORY_IMAGES[event.category?.name] || GENERIC_EVENT_IMAGE;
  const organizerName = event.organizer?.name || event.organizerName || 'Verified Organizer';
  const categoryName = event.category?.name || event.category || 'Event';

  return (
    <div className="group rounded-[18px] overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col hover:-translate-y-1.5">
      {/* Banner Media */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={displayImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/90 text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-sm border border-slate-100 dark:border-slate-800">
            {categoryName}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
              isFree
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900/90 text-white border border-white/20'
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
          <div className="flex items-center gap-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate} • {formattedTime}
            </span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-normal">
              <MapPin className="w-3.5 h-3.5" />
              {event.city || 'Virtual'}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">
            <Link to={`/events/${event.slug || event.id}`}>{event.title}</Link>
          </h3>

          {/* Organizer */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">
            By <span className="font-medium text-slate-700 dark:text-slate-300">{organizerName}</span>
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>
        </div>

        {/* Footer Meta & CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Users className="w-3.5 h-3.5" />
            {isSoldOut ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">Sold Out</span>
            ) : (
              <span>
                <strong className="text-slate-900 dark:text-slate-200">{event.spotsLeft ?? 45}</strong> spots left
              </span>
            )}
          </div>

          <Link
            to={`/events/${event.slug || event.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-semibold text-indigo-600 dark:text-indigo-300 transition-colors"
          >
            <span>View Event</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
