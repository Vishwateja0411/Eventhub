import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold">EventHub</span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Discover, organize, and check in to premier tech conferences, workshops, and meetups with seamless QR ticketing.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/events" className="hover:text-indigo-600 dark:hover:text-indigo-400">All Events</Link></li>
              <li><Link to="/events?category=tech" className="hover:text-indigo-600 dark:hover:text-indigo-400">Tech & AI</Link></li>
              <li><Link to="/events?isFree=true" className="hover:text-indigo-600 dark:hover:text-indigo-400">Free Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Organizers
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/events/create" className="hover:text-indigo-600 dark:hover:text-indigo-400">Create an Event</Link></li>
              <li><Link to="/scanner" className="hover:text-indigo-600 dark:hover:text-indigo-400">QR Check-in Scanner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              EventHub Platform
            </h4>
            <div className="space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-500" /> HTTP-only Cookie Auth</p>
              <p className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Instant QR Ticketing</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for community events
          </p>
        </div>
      </div>
    </footer>
  );
}
