import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Shield,
  Calendar,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  HelpCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Validation Schema with Zod ────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

// ── Role Definitions ─────────────────────────────────────────────────────────
const ROLES = {
  ADMIN: {
    id: 'ADMIN',
    name: 'ADMIN',
    title: 'ADMIN LOGIN',
    welcome: 'Welcome back, Administrator',
    subtitle: 'Manage EventHub',
    description: 'System governance, user audits & analytics',
    icon: Shield,
    redirect: '/admin/dashboard',
    theme: {
      primary: 'indigo',
      badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      glow: 'rgba(99, 102, 241, 0.45)',
      gradient: 'from-indigo-500 via-indigo-600 to-violet-600',
      borderGlow: 'hover:border-indigo-400/80',
      activeBorder: 'border-indigo-500',
      ring: 'ring-indigo-500/50',
      button: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25',
      accentText: 'text-indigo-400',
      lineStroke: '#6366f1',
    },
    demo: {
      email: 'admin@eventhub.com',
      password: 'Admin@123',
    },
  },
  ORGANIZER: {
    id: 'ORGANIZER',
    name: 'ORGANIZER',
    title: 'ORGANIZER LOGIN',
    welcome: 'Welcome back, Organizer',
    subtitle: 'Create & Manage Events',
    description: 'Host experiences, manage tickets & check-ins',
    icon: Calendar,
    redirect: '/organizer/create-event',
    theme: {
      primary: 'emerald',
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      glow: 'rgba(16, 185, 129, 0.45)',
      gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      borderGlow: 'hover:border-emerald-400/80',
      activeBorder: 'border-emerald-500',
      ring: 'ring-emerald-500/50',
      button: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25',
      accentText: 'text-emerald-400',
      lineStroke: '#10b981',
    },
    demo: {
      email: 'organizer@eventhub.com',
      password: 'Organizer@123',
    },
  },
  USER: {
    id: 'USER',
    name: 'USER',
    title: 'USER LOGIN',
    welcome: 'Welcome back',
    subtitle: 'Discover & Book Events',
    description: 'Explore live events, book seats & access passes',
    icon: User,
    redirect: '/',
    theme: {
      primary: 'sky',
      badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      glow: 'rgba(14, 165, 233, 0.45)',
      gradient: 'from-sky-500 via-blue-600 to-indigo-600',
      borderGlow: 'hover:border-sky-400/80',
      activeBorder: 'border-sky-500',
      ring: 'ring-sky-500/50',
      button: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-sky-500/25',
      accentText: 'text-sky-400',
      lineStroke: '#0ea5e9',
    },
    demo: {
      email: 'user@eventhub.com',
      password: 'User@123',
    },
  },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // State
  const [selectedRole, setSelectedRole] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // When changing role, clear error & success state
  const handleSelectRole = (roleKey) => {
    setSelectedRole(ROLES[roleKey]);
    setAuthError('');
    setIsSuccess(false);
    reset();
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setAuthError('');
    setIsSuccess(false);
    reset();
  };

  // Quick fill helper
  const handleFillDemo = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  // Submit Handler with Backend Role Verification
  const onSubmit = async (values) => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    setAuthError('');

    try {
      // 1. Authenticate with backend, passing expectedRole
      const authenticatedUser = await login(values.email, values.password, selectedRole.id);

      // 2. Double-check role verification
      if (!authenticatedUser || authenticatedUser.role !== selectedRole.id) {
        throw new Error('This account does not belong to the selected role.');
      }

      // 3. Trigger success animation
      setIsSuccess(true);

      // 4. Redirect after a smooth cinematic confirmation
      setTimeout(() => {
        const destination =
          selectedRole.id === 'USER'
            ? location.state?.from?.pathname || selectedRole.redirect
            : selectedRole.redirect;
        navigate(destination, { replace: true });
      }, 700);
    } catch (err) {
      console.error('Login error:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password.';

      if (
        err.response?.status === 403 ||
        serverMessage.toLowerCase().includes('role') ||
        serverMessage.toLowerCase().includes('not belong')
      ) {
        setAuthError('This account does not belong to the selected role.');
      } else if (err.response?.status === 429) {
        setAuthError('Too many attempts. Please wait a moment and try again.');
      } else if (err.response?.status === 401) {
        setAuthError('Invalid email or password.');
      } else if (!err.response && (err.code === 'ERR_NETWORK' || err.message?.includes('Network'))) {
        setAuthError('Unable to connect to the server. Please check your connection.');
      } else {
        setAuthError(serverMessage || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#060814] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-indigo-500/30">
      {/* ── Ambient Background & Glowing Orbs ─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Radial Gradients */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-indigo-900/25 via-purple-900/15 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-950/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-950/20 rounded-full blur-[140px]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />

        {/* Ambient floating dust particles */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-indigo-400 blur-[0.5px]"
            />
            <motion.div
              animate={{ y: [0, 20, 0], opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-cyan-400 blur-[0.5px]"
            />
            <motion.div
              animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-emerald-400 blur-[0.5px]"
            />
          </>
        )}
      </div>

      {/* ── Top Navigation Bar ──────────────────────────────────────────────── */}
      <header className="relative z-20 w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <div className="w-full h-full bg-[#0b0e24] rounded-[11px] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              Event<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Hub</span>
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white transition-all shadow-sm backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* ── Main View Container ────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            /* ═════════════════════════════════════════════════════════════════
               1. ROLE SELECTION VIEW (Orbital Desktop / Vertical Mobile)
               ═════════════════════════════════════════════════════════════════ */
            <motion.div
              key="role-selection"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-4xl flex flex-col items-center justify-center"
            >
              {/* Heading */}
              <div className="text-center mb-6 sm:mb-8 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Role-Based Authentication</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  Choose Your Portal
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Select your role to access your dedicated workspace and tools
                </p>
              </div>

              {/* ── DESKTOP & TABLET ORBIT COMPOSITION (hidden on small mobile) ── */}
              <div className="hidden md:block relative w-[600px] h-[520px] mx-auto select-none">
                {/* SVG Orbit Lines & SVG Connector Beams */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <defs>
                    <linearGradient id="orbitGlowAdmin" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="orbitGlowOrg" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="orbitGlowUser" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Concentric Orbit Rings */}
                  <circle
                    cx="300"
                    cy="260"
                    r="200"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                  <circle
                    cx="300"
                    cy="260"
                    r="150"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.04)"
                    strokeWidth="1"
                  />

                  {/* Dynamic Connection Beams to Roles */}
                  {/* Center (300, 260) to Admin Top (300, 80) */}
                  <line
                    x1="300"
                    y1="260"
                    x2="300"
                    y2="80"
                    stroke={hoveredRole === 'ADMIN' ? 'url(#orbitGlowAdmin)' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={hoveredRole === 'ADMIN' ? 2.5 : 1.5}
                    strokeDasharray={hoveredRole === 'ADMIN' ? 'none' : '3 4'}
                    className="transition-all duration-300"
                  />

                  {/* Center (300, 260) to Organizer Bottom-Left (140, 410) */}
                  <line
                    x1="300"
                    y1="260"
                    x2="140"
                    y2="410"
                    stroke={hoveredRole === 'ORGANIZER' ? 'url(#orbitGlowOrg)' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={hoveredRole === 'ORGANIZER' ? 2.5 : 1.5}
                    strokeDasharray={hoveredRole === 'ORGANIZER' ? 'none' : '3 4'}
                    className="transition-all duration-300"
                  />

                  {/* Center (300, 260) to User Bottom-Right (460, 410) */}
                  <line
                    x1="300"
                    y1="260"
                    x2="460"
                    y2="410"
                    stroke={hoveredRole === 'USER' ? 'url(#orbitGlowUser)' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={hoveredRole === 'USER' ? 2.5 : 1.5}
                    strokeDasharray={hoveredRole === 'USER' ? 'none' : '3 4'}
                    className="transition-all duration-300"
                  />
                </svg>

                {/* ── Central Animated Circle ── */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Pulsing Outer Aura */}
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: hoveredRole ? [1.1, 1.25, 1.1] : [1, 1.12, 1],
                              opacity: hoveredRole ? [0.4, 0.7, 0.4] : [0.25, 0.45, 0.25],
                            }
                      }
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{
                        background:
                          hoveredRole === 'ADMIN'
                            ? 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)'
                            : hoveredRole === 'ORGANIZER'
                            ? 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)'
                            : hoveredRole === 'USER'
                            ? 'radial-gradient(circle, rgba(14,165,233,0.5) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
                      }}
                    />

                    {/* Rotating Dashed Outer Ring */}
                    <motion.div
                      animate={shouldReduceMotion ? {} : { rotate: 360 }}
                      transition={{
                        duration: hoveredRole ? 10 : 25,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 rounded-full border border-dashed border-indigo-400/30"
                    />

                    {/* Counter-rotating Secondary Accent Ring with Orbiting Dot */}
                    <motion.div
                      animate={shouldReduceMotion ? {} : { rotate: -360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-2 rounded-full border border-white/10"
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    </motion.div>

                    {/* Center Core Glass Orb */}
                    <div className="relative w-36 h-36 rounded-full bg-gradient-to-b from-[#111633]/90 to-[#080b1c]/95 border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center p-3 text-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mb-1.5 shadow-[0_0_8px_#818cf8] animate-pulse" />
                      <span className="text-[13px] font-black tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                        EVENTHUB
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">
                        Choose your role
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── TOP ROLE: ADMIN ── */}
                <RoleOrbitCard
                  role={ROLES.ADMIN}
                  positionClasses="top-0 left-1/2 -translate-x-1/2"
                  isHovered={hoveredRole === 'ADMIN'}
                  onHover={() => setHoveredRole('ADMIN')}
                  onLeave={() => setHoveredRole(null)}
                  onClick={() => handleSelectRole('ADMIN')}
                  shouldReduceMotion={shouldReduceMotion}
                />

                {/* ── BOTTOM LEFT ROLE: ORGANIZER ── */}
                <RoleOrbitCard
                  role={ROLES.ORGANIZER}
                  positionClasses="bottom-4 left-6"
                  isHovered={hoveredRole === 'ORGANIZER'}
                  onHover={() => setHoveredRole('ORGANIZER')}
                  onLeave={() => setHoveredRole(null)}
                  onClick={() => handleSelectRole('ORGANIZER')}
                  shouldReduceMotion={shouldReduceMotion}
                />

                {/* ── BOTTOM RIGHT ROLE: USER ── */}
                <RoleOrbitCard
                  role={ROLES.USER}
                  positionClasses="bottom-4 right-6"
                  isHovered={hoveredRole === 'USER'}
                  onHover={() => setHoveredRole('USER')}
                  onLeave={() => setHoveredRole(null)}
                  onClick={() => handleSelectRole('USER')}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>

              {/* ── MOBILE VERTICAL STACK (< 768px) ── */}
              <div className="md:hidden w-full max-w-sm space-y-4">
                {/* Center Animation Mini Hub */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <motion.div
                      animate={shouldReduceMotion ? {} : { rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border border-dashed border-indigo-400/40"
                    />
                    <div className="relative w-28 h-28 rounded-full bg-[#111633]/90 border border-white/15 backdrop-blur-xl flex flex-col items-center justify-center p-2 text-center shadow-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mb-1 animate-pulse" />
                      <span className="text-xs font-black tracking-widest text-white">EVENTHUB</span>
                      <span className="text-[9px] uppercase font-medium text-slate-400 mt-0.5">
                        Choose your role
                      </span>
                    </div>
                  </div>
                </div>

                {/* Three Vertical Cards */}
                {Object.values(ROLES).map((role) => {
                  const RoleIcon = role.icon;
                  return (
                    <motion.button
                      key={role.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectRole(role.id)}
                      className="w-full text-left p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.07] transition-all flex items-center gap-4 group backdrop-blur-md"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${role.theme.gradient} text-white shadow-md`}
                      >
                        <RoleIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white tracking-wide">
                            {role.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${role.theme.badge}`}
                          >
                            PORTAL
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{role.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Bottom Instructions */}
              <p className="text-xs text-slate-500 mt-6 sm:mt-8 text-center flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Click a role to open its dedicated sign-in portal</span>
              </p>
            </motion.div>
          ) : (
            /* ═════════════════════════════════════════════════════════════════
               2. ROLE LOGIN FORM VIEW (Cinematic Glassmorphic Form)
               ═════════════════════════════════════════════════════════════════ */
            <motion.div
              key="role-login-form"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 20, scale: 0.96 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -20, scale: 0.96 }
              }
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-md"
            >
              <div className="relative rounded-3xl bg-[#0e122b]/85 border border-white/[0.12] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden">
                {/* Top Subtle Role Gradient Stripe */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${selectedRole.theme.gradient}`}
                />

                {/* Header with Role Badge */}
                <div className="text-center space-y-2 mb-6">
                  <div className="flex justify-center">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${selectedRole.theme.badge}`}
                    >
                      {React.createElement(selectedRole.icon, { className: 'w-3.5 h-3.5' })}
                      <span>{selectedRole.name}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {selectedRole.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">{selectedRole.welcome}</p>
                </div>

                {/* 1-Click Demo Account Quick Fill Button */}
                <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="text-[11px] font-semibold text-slate-300">
                      ⚡ Quick Demo Credentials
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                      {selectedRole.demo.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleFillDemo(selectedRole.demo.email, selectedRole.demo.password)
                    }
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 transition-colors border border-white/10"
                  >
                    Auto Fill
                  </button>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold block text-rose-200">
                          Authentication Notice
                        </span>
                        <span>{authError}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Banner */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
                      <span className="font-semibold">
                        Role verified! Redirecting to workspace...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reusable Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                      <input
                        type="email"
                        autoComplete="email"
                        {...register('email')}
                        placeholder={`e.g. ${selectedRole.demo.email}`}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-black/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          errors.email
                            ? 'border-rose-500/60 focus:ring-rose-500/40'
                            : 'border-white/10 focus:border-white/30 ' + selectedRole.theme.ring
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-rose-400 mt-1 pl-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        {...register('password')}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-black/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          errors.password
                            ? 'border-rose-500/60 focus:ring-rose-500/40'
                            : 'border-white/10 focus:border-white/30 ' + selectedRole.theme.ring
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-rose-400 mt-1 pl-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-300">
                      <input
                        type="checkbox"
                        {...register('rememberMe')}
                        className="w-4 h-4 rounded border-white/20 bg-black/30 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-slate-400 hover:text-white hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                    className={`w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 ${selectedRole.theme.button} ${
                      isSubmitting || isSuccess ? 'opacity-85 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying {selectedRole.name}...</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Authenticated</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In as {selectedRole.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Footer Controls: Change Role & Registration Link */}
                <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackToRoles}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    <span>Change Role</span>
                  </button>

                  {/* Organizer Registration Link */}
                  {selectedRole.id === 'ORGANIZER' && (
                    <p className="text-xs text-slate-400">
                      Don't have an account?{' '}
                      <Link
                        to="/register?role=ORGANIZER"
                        className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                      >
                        Create new account
                      </Link>
                    </p>
                  )}

                  {/* Normal User Registration Link */}
                  {selectedRole.id === 'USER' && (
                    <p className="text-xs text-slate-400">
                      Don't have an account?{' '}
                      <Link
                        to="/register?role=USER"
                        className="font-semibold text-sky-400 hover:text-sky-300 hover:underline transition-colors"
                      >
                        Create new account
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Bottom Brand Footer ────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500">
        <span>© {new Date().getFullYear()} EventHub Inc. All rights reserved. Enterprise Security & RBAC.</span>
      </footer>

      {/* ── Forgot Password Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-[#0f1430] border border-white/10 p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Reset Password</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Password recovery is managed by the system administrator. For demo purposes, you can use the default demo credentials provided on the login card.
              </p>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Role Orbit Card Component (for Desktop/Tablet Orbit) ─────────────────────
function RoleOrbitCard({
  role,
  positionClasses,
  isHovered,
  onHover,
  onLeave,
  onClick,
  shouldReduceMotion,
}) {
  const IconComponent = role.icon;

  return (
    <motion.div
      className={`absolute ${positionClasses} z-20 cursor-pointer`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
      animate={
        shouldReduceMotion
          ? {}
          : {
              y: isHovered ? -4 : [0, -6, 0],
            }
      }
      transition={{
        y: {
          duration: 4,
          repeat: isHovered ? 0 : Infinity,
          ease: 'easeInOut',
        },
        scale: { duration: 0.2 },
      }}
    >
      <div
        className={`w-44 p-4 rounded-2xl bg-[#0e122b]/85 border transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col items-center text-center ${
          isHovered
            ? `${role.theme.activeBorder} shadow-2xl`
            : 'border-white/10 hover:border-white/20'
        }`}
        style={{
          boxShadow: isHovered
            ? `0 15px 35px -5px ${role.theme.glow}, 0 0 15px 2px ${role.theme.glow}`
            : '0 10px 25px -5px rgba(0,0,0,0.5)',
        }}
      >
        {/* Role Icon Circle */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${role.theme.gradient} text-white shadow-lg mb-3 transition-transform duration-300 ${
            isHovered ? 'scale-110' : ''
          }`}
        >
          <IconComponent className="w-7 h-7" />
        </div>

        {/* Role Name */}
        <span className="text-base font-extrabold tracking-wider text-white">
          {role.name}
        </span>

        {/* Role Subtitle */}
        <span className="text-[11px] font-medium text-slate-400 mt-0.5 leading-snug line-clamp-1">
          {role.subtitle}
        </span>

        {/* Enter indicator */}
        <div
          className={`mt-3 flex items-center gap-1 text-[11px] font-semibold transition-colors ${
            isHovered ? role.theme.accentText : 'text-slate-500'
          }`}
        >
          <span>Select Role</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
}
