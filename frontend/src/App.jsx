import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// ── Route Guards ─────────────────────────────────────────────────────────────
import {
  ProtectedRoute,
  UserRoute,
  AdminRoute,
  OrganizerRoute,
  PublicOnlyRoute,
  RoleRedirect,
} from './components/guards/ProtectedRoute';

// ── Layouts ───────────────────────────────────────────────────────────────────
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import OrganizerLayout from './components/layout/OrganizerLayout';

// ── Public Pages ──────────────────────────────────────────────────────────────
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// ── User Pages (require login) ────────────────────────────────────────────────
import MyTickets from './pages/MyTickets';

// ── Admin Pages ───────────────────────────────────────────────────────────────
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrganizersPage from './pages/admin/AdminOrganizersPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// ── Organizer Pages ───────────────────────────────────────────────────────────
import OrganizerDashboardPage from './pages/organizer/OrganizerDashboardPage';
import OrganizerEventsPage from './pages/organizer/OrganizerEventsPage';
import OrganizerRegistrationsPage from './pages/organizer/OrganizerRegistrationsPage';
import CreateEvent from './pages/CreateEvent'; // reused in organizer layout
import QRScanner from './pages/QRScanner'; // reused in organizer layout

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// ── Global Scroll To Top on Route Change ──────────────────────────────────────
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const tryScroll = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };

      if (!tryScroll()) {
        const timer1 = setTimeout(tryScroll, 60);
        const timer2 = setTimeout(tryScroll, 200);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
      return;
    }

    // Always scroll window to the absolute starting (top = 0)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Also reset any scrollable main elements (e.g. dashboards)
    document.querySelectorAll('main').forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname, search, hash]);

  return null;
}

// ── Public layout wrapper (Navbar + Footer) ───────────────────────────────────
function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* ═══════════════════════════════════════════════════════════════
                  PUBLIC ROUTES (Visitor / User)
                  Admin & Organizer are redirected away from these routes
              ═══════════════════════════════════════════════════════════════ */}
              <Route
                path="/"
                element={
                  <RoleRedirect>
                    <PublicLayout>
                      <Home />
                    </PublicLayout>
                  </RoleRedirect>
                }
              />
              <Route
                path="/events"
                element={
                  <PublicLayout>
                    <Events />
                  </PublicLayout>
                }
              />
              <Route
                path="/events/:slugOrId"
                element={
                  <PublicLayout>
                    <EventDetail />
                  </PublicLayout>
                }
              />

              {/* Auth pages — redirect already-logged-in users */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <PublicLayout>
                      <Register />
                    </PublicLayout>
                  </PublicOnlyRoute>
                }
              />

              {/* Authenticated User Pages */}
              <Route
                path="/my-tickets"
                element={
                  <UserRoute>
                    <PublicLayout>
                      <MyTickets />
                    </PublicLayout>
                  </UserRoute>
                }
              />

              {/* ═══════════════════════════════════════════════════════════════
                  ADMIN ROUTES — completely separate layout (no Navbar/Footer)
              ═══════════════════════════════════════════════════════════════ */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="organizers" element={<AdminOrganizersPage />} />
                <Route path="events" element={<AdminEventsPage />} />
                <Route path="payments" element={<AdminPaymentsPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>

              {/* ═══════════════════════════════════════════════════════════════
                  ORGANIZER ROUTES — separate layout (no Navbar/Footer)
              ═══════════════════════════════════════════════════════════════ */}
              <Route
                path="/organizer"
                element={
                  <OrganizerRoute>
                    <OrganizerLayout />
                  </OrganizerRoute>
                }
              >
                <Route index element={<Navigate to="/organizer/dashboard" replace />} />
                <Route path="dashboard" element={<OrganizerDashboardPage />} />
                <Route path="create-event" element={<CreateEvent />} />
                <Route path="events" element={<OrganizerEventsPage />} />
                <Route path="registrations" element={<OrganizerRegistrationsPage />} />
                <Route path="scanner" element={<QRScanner />} />
                <Route path="analytics" element={<OrganizerAnalyticsRedirect />} />
              </Route>

              {/* ── Legacy redirects from old routes ─────────────────────── */}
              <Route path="/dashboard/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/dashboard/organizer" element={<Navigate to="/organizer/dashboard" replace />} />
              <Route path="/events/create" element={<Navigate to="/organizer/create-event" replace />} />
              <Route path="/scanner" element={<Navigate to="/organizer/scanner" replace />} />

              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Simple redirect for organizer analytics (shows basic stats from dashboard)
function OrganizerAnalyticsRedirect() {
  return <Navigate to="/organizer/dashboard" replace />;
}
