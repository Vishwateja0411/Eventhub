import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../notifications/NotificationBell';
import {
  Calendar,
  Sun,
  Moon,
  Ticket,
  LogOut,
  Menu,
  X,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToTop = () => {
    setMobileMenuOpen(false);
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (window.location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', `/#${id}`);
      }
    } else {
      // Client-side SPA navigation without hard reload or lag
      navigate(`/#${id}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#070B1A]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Wordmark */}
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#6C4DF6] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Event<span className="text-[#6C4DF6]">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/events"
              onClick={scrollToTop}
              className="text-sm font-medium text-slate-700 hover:text-[#6C4DF6] dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Explore Events
            </Link>

            <a
              href="/#featured"
              onClick={(e) => handleAnchorClick(e, 'featured')}
              className="text-sm font-medium text-slate-700 hover:text-[#6C4DF6] dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              Featured
            </a>

            <a
              href="/#categories"
              onClick={(e) => handleAnchorClick(e, 'categories')}
              className="text-sm font-medium text-slate-700 hover:text-[#6C4DF6] dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              Categories
            </a>

            <a
              href="/#how-it-works"
              onClick={(e) => handleAnchorClick(e, 'how-it-works')}
              className="text-sm font-medium text-slate-700 hover:text-[#6C4DF6] dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </a>

            {isAuthenticated && user?.role === 'USER' && (
              <Link
                to="/my-tickets"
                onClick={scrollToTop}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#6C4DF6] dark:text-[#A78BFA]"
              >
                <Ticket className="w-4 h-4" />
                My Tickets
              </Link>
            )}

            {user?.role === 'ORGANIZER' && (
              <Link
                to="/organizer/dashboard"
                onClick={scrollToTop}
                className="text-sm font-semibold text-[#6C4DF6] dark:text-[#A78BFA]"
              >
                Organizer Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notification Bell */}
            {isAuthenticated && <NotificationBell />}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs uppercase border border-indigo-200 dark:border-indigo-800">
                    {user?.name?.slice(0, 2) || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[100px]">
                      {user?.name}
                    </p>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  onClick={scrollToTop}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#6C4DF6] dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={scrollToTop}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#6C4DF6] hover:bg-[#5838E6] rounded-lg shadow-sm transition-all hover:scale-[1.01]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button and quick CTA */}
          <div className="flex lg:hidden items-center gap-2">
            {!isAuthenticated && (
              <Link
                to="/register"
                onClick={scrollToTop}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#6C4DF6] rounded-lg shadow-sm"
              >
                Get Started
              </Link>
            )}
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#070B1A] border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/events"
            onClick={scrollToTop}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore Events
          </Link>
          <a
            href="/#featured"
            onClick={(e) => handleAnchorClick(e, 'featured')}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Featured
          </a>
          <a
            href="/#categories"
            onClick={(e) => handleAnchorClick(e, 'categories')}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Categories
          </a>
          <a
            href="/#how-it-works"
            onClick={(e) => handleAnchorClick(e, 'how-it-works')}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            How It Works
          </a>

          {isAuthenticated && user?.role === 'USER' && (
            <Link
              to="/my-tickets"
              onClick={scrollToTop}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              My Tickets
            </Link>
          )}

          {user?.role === 'ORGANIZER' && (
            <Link
              to="/organizer/dashboard"
              onClick={scrollToTop}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400"
            >
              Organizer Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 font-medium text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-2">
                <Link
                  to="/login"
                  onClick={scrollToTop}
                  className="text-center py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={scrollToTop}
                  className="text-center py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
