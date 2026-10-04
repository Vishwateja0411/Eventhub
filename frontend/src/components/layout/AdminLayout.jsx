import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Bell,
} from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'Users', icon: Users, to: '/admin/users' },
  { label: 'Organizers', icon: ShieldCheck, to: '/admin/organizers' },
  { label: 'Events', icon: Calendar, to: '/admin/events' },
  { label: 'Payments', icon: CreditCard, to: '/admin/payments' },
  { label: 'Analytics', icon: BarChart3, to: '/admin/analytics' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight">EventHub</p>
          <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold">Admin Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-rose-50 dark:bg-rose-600/20 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
            <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User info & logout */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/40">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            {user?.name?.slice(0, 2)?.toUpperCase() || 'AD'}
          </div>
          <div className="overflow-hidden">
            <p className="text-slate-900 dark:text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-rose-600 dark:text-rose-400 text-[10px] font-medium">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-200">
      {/* ── Desktop Sidebar ──────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ───────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-3">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between h-14 px-4 sm:px-6 bg-white/90 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-[10px] font-bold uppercase tracking-widest border border-rose-200 dark:border-rose-800/50">
              Root Admin
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <NotificationBell />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
