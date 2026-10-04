import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ── Loading Spinner ──────────────────────────────────────────────────────────
const AuthLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Verifying session…</p>
    </div>
  </div>
);

/**
 * ProtectedRoute — requires authentication.
 * Redirects to /login if not authenticated.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoadingSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

/**
 * UserRoute — requires normal USER role.
 * Organizers & Admins are redirected to their dashboards.
 */
export function UserRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoadingSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.role === 'ORGANIZER') {
    return <Navigate to="/organizer/dashboard" replace />;
  }
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

/**
 * AdminRoute — requires ADMIN role.
 * Redirects to / if not admin.
 */
export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <AuthLoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

/**
 * OrganizerRoute — requires ORGANIZER or ADMIN role.
 * Redirects to / if not organizer.
 */
export function OrganizerRoute({ children }) {
  const { user, isOrganizer, loading } = useAuth();

  if (loading) return <AuthLoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isOrganizer) return <Navigate to="/" replace />;
  return children;
}

/**
 * PublicOnlyRoute — for login/register pages.
 * Redirects authenticated users to their role's home.
 */
export function PublicOnlyRoute({ children }) {
  const { user, isAdmin, isOrganizer, loading } = useAuth();

  if (loading) return <AuthLoadingSpinner />;

  if (user) {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    if (isOrganizer) return <Navigate to="/organizer/create-event" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * RoleRedirect — used on '/' to redirect role-specific users away from the public page.
 * Visitors and normal USERs stay on the public landing page.
 */
export function RoleRedirect({ children }) {
  const { user, isAdmin, isOrganizer, loading } = useAuth();

  if (loading) return <AuthLoadingSpinner />;

  if (user) {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    if (isOrganizer) return <Navigate to="/organizer/create-event" replace />;
  }

  return children;
}
