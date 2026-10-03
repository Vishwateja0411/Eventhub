import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Ticket, CheckCircle2, Calendar, AlertTriangle, Info, Trash2 } from 'lucide-react';
import client from '../../api/client';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await client.get('/api/notifications');
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAllRead = async () => {
    try {
      await client.patch('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (_) {}
  };

  const markOneRead = async (id) => {
    try {
      await client.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (_) {}
  };

  const deleteNotif = async (id, e) => {
    e.stopPropagation();
    try {
      await client.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (!notifications.find((n) => n.id === id)?.isRead) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (_) {}
  };

  const getIcon = (type) => {
    switch (type) {
      case 'REGISTRATION_CONFIRMED':
        return <Ticket className="w-4 h-4 text-emerald-500" />;
      case 'CHECK_IN_SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-primary-500" />;
      case 'EVENT_REMINDER':
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'EVENT_CANCELLED':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Info className="w-4 h-4 text-cyan-500" />;
    }
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const diffMin = Math.round((new Date() - date) / 60000);
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.round(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (_) {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 text-[10px] text-white"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                No notifications yet.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markOneRead(item.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                    !item.isRead ? 'bg-primary-50/50 dark:bg-primary-950/20' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mt-0.5 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 shrink-0">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteNotif(item.id, e)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
