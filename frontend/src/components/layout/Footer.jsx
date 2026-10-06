import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#070B1A] transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#6C4DF6] flex items-center justify-center text-white shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Event<span className="text-[#6C4DF6]">Hub</span>
              </span>
            </Link>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              The Enterprise Event Management & Ticketing Platform
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Discover, organize, and check in to premier tech conferences, summits, and festivals with instant cryptographic QR ticketing.
            </p>
          </div>

          {/* EventHub Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              EventHub
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#about" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/events" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <a href="/#categories" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="/#featured" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Featured Events
                </a>
              </li>
            </ul>
          </div>

          {/* Organizers Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Organizers
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/events/create" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/organizer/dashboard" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/organizer/dashboard" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Event Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#help" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-[#6C4DF6] dark:hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EventHub. All rights reserved.</p>
          <div className="flex items-center gap-5 text-slate-400 dark:text-slate-500">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#6C4DF6] transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#6C4DF6] transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#6C4DF6] transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
