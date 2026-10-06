import React, { useState } from 'react';
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
    label: 'ADMIN',
    title: 'Manage EventHub',
    modalTitle: 'Admin Portal Login',
    welcome: 'Welcome back, Administrator',
    description: 'Manage users, organizers, events, payments and platform activity.',
    buttonText: 'Continue as Admin',
    icon: Shield,
    redirect: '/admin/dashboard',
    accentColor: '#6366F1',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    iconBgClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white',
    hoverBorder: 'hover:border-indigo-500',
    hoverButton: 'group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600',
    formButton: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
    demo: {
      email: 'admin@eventhub.com',
      password: 'Admin@123',
    },
  },
  ORGANIZER: {
    id: 'ORGANIZER',
    name: 'ORGANIZER',
    label: 'ORGANIZER',
    title: 'Create & Manage Events',
    modalTitle: 'Organizer Portal Login',
    welcome: 'Welcome back, Organizer',
    description: 'Create events, manage registrations, track payments and monitor attendance.',
    buttonText: 'Continue as Organizer',
    icon: Calendar,
    redirect: '/organizer/create-event',
    accentColor: '#10B981',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    iconBgClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
    hoverBorder: 'hover:border-emerald-500',
    hoverButton: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600',
    formButton: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    demo: {
      email: 'organizer@eventhub.com',
      password: 'Organizer@123',
    },
  },
  USER: {
    id: 'USER',
    name: 'USER',
    label: 'USER',
    title: 'Discover & Book Events',
    modalTitle: 'User Account Login',
    welcome: 'Welcome back',
    description: 'Explore events, book tickets, make payments and access your QR passes.',
    buttonText: 'Continue as User',
    icon: User,
    redirect: '/',
    accentColor: '#3B82F6',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    iconBgClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white',
    hoverBorder: 'hover:border-blue-500',
    hoverButton: 'group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600',
    formButton: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
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

      // 4. Redirect after smooth confirmation
      setTimeout(() => {
        const destination =
          selectedRole.id === 'USER'
            ? location.state?.from?.pathname || selectedRole.redirect
            : selectedRole.redirect;
        navigate(destination, { replace: true });
      }, 600);
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
    <div className="relative min-h-screen w-full bg-[#F8F9FC] dark:bg-[#0B0F19] text-[#111827] dark:text-slate-100 flex flex-col justify-between overflow-x-hidden transition-colors duration-200">
      {/* ── Extremely Subtle Ambient Background Corner Blobs ───────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Top Navigation Bar / Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B4BFF] to-[#7C3AED] flex items-center justify-center text-white shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Event<span className="text-[#5B4BFF]">Hub</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* ── Main View Container ────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            /* ═════════════════════════════════════════════════════════════════
               1. ROLE SELECTION VIEW (Clean 3-Card Grid Layout)
               ═════════════════════════════════════════════════════════════════ */
            <motion.div
              key="role-selection"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-5xl flex flex-col items-center"
            >
              {/* Center Brand Element & Hero Heading */}
              <div className="text-center mb-10 sm:mb-12 space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Welcome to EventHub</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111827] dark:text-white">
                  Choose how you want to continue
                </h1>

                <p className="text-sm sm:text-base text-[#6B7280] dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Select your account type to access the right EventHub experience.
                </p>
              </div>

              {/* Three Role Cards (Horizontal on Desktop, Stack on Mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
                {['ADMIN', 'ORGANIZER', 'USER'].map((roleKey) => {
                  const role = ROLES[roleKey];
                  const RoleIcon = role.icon;

                  return (
                    <motion.div
                      key={role.id}
                      whileHover={shouldReduceMotion ? {} : { y: -5 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      onClick={() => handleSelectRole(role.id)}
                      className={`group cursor-pointer rounded-[22px] bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 ${role.hoverBorder} shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden`}
                    >
                      {/* Top Accent Line */}
                      <div
                        className="absolute top-0 inset-x-0 h-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        style={{ backgroundColor: role.accentColor }}
                      />

                      <div>
                        {/* Icon Container & Role Tag */}
                        <div className="flex items-center justify-between mb-6">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${role.iconBgClass} shadow-sm`}
                          >
                            <RoleIcon className="w-6 h-6" />
                          </div>

                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${role.badgeClass}`}
                          >
                            {role.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {role.title}
                        </h2>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 leading-relaxed mb-8">
                          {role.description}
                        </p>
                      </div>

                      {/* CTA Button */}
                      <div
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm border border-[#E5E7EB] dark:border-slate-800 bg-[#F9FAFB] dark:bg-slate-800/80 text-[#111827] dark:text-slate-200 flex items-center justify-center gap-2 transition-all duration-300 ${role.hoverButton}`}
                      >
                        <span>{role.buttonText}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Trust Section */}
              <div className="mt-14 text-center space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  One platform. Every event experience.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Secure Authentication
                  </span>
                  <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified Events
                  </span>
                  <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Fast QR Check-in
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ═════════════════════════════════════════════════════════════════
               2. ROLE LOGIN FORM VIEW (Clean Modern SaaS Form Card)
               ═════════════════════════════════════════════════════════════════ */
            <motion.div
              key="role-login-form"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 15, scale: 0.98 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -15, scale: 0.98 }
              }
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-md"
            >
              <div className="relative rounded-[22px] bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-7 sm:p-8 shadow-xl overflow-hidden">
                {/* Top Subtle Role Accent Stripe */}
                <div
                  className="absolute top-0 inset-x-0 h-1.5"
                  style={{ backgroundColor: selectedRole.accentColor }}
                />

                {/* Header with Role Badge */}
                <div className="text-center space-y-2 mb-6">
                  <div className="flex justify-center">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${selectedRole.badgeClass}`}
                    >
                      {React.createElement(selectedRole.icon, { className: 'w-3.5 h-3.5' })}
                      <span>{selectedRole.name}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {selectedRole.modalTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {selectedRole.welcome}
                  </p>
                </div>

                {/* 1-Click Demo Account Quick Fill Button */}
                <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      ⚡ Demo Credentials
                    </p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      {selectedRole.demo.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleFillDemo(selectedRole.demo.email, selectedRole.demo.password)
                    }
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-600 shadow-2xs cursor-pointer"
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
                      className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold block text-rose-800 dark:text-rose-200">
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
                      className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 animate-bounce" />
                      <span className="font-semibold">
                        Role verified! Redirecting to workspace...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#5B4BFF] transition-colors" />
                      <input
                        type="email"
                        autoComplete="email"
                        {...register('email')}
                        placeholder={`e.g. ${selectedRole.demo.email}`}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-slate-900 transition-all ${
                          errors.email
                            ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-400/30'
                            : 'border-slate-200 dark:border-slate-700 focus:border-[#5B4BFF] focus:ring-[#5B4BFF]/20'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 mt-1 pl-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#5B4BFF] transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        {...register('password')}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-slate-900 transition-all ${
                          errors.password
                            ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-400/30'
                            : 'border-slate-200 dark:border-slate-700 focus:border-[#5B4BFF] focus:ring-[#5B4BFF]/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
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
                      <p className="text-[11px] text-rose-500 mt-1 pl-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                      <input
                        type="checkbox"
                        {...register('rememberMe')}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#5B4BFF] focus:ring-[#5B4BFF] cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-slate-500 dark:text-slate-400 hover:text-[#5B4BFF] dark:hover:text-indigo-400 hover:underline transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className={`w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${selectedRole.formButton} ${
                      isSubmitting || isSuccess ? 'opacity-85 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'
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
                  </button>
                </form>

                {/* Footer Controls: Change Role & Registration Link */}
                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackToRoles}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    <span>Change Role</span>
                  </button>

                  {/* Organizer Registration Link */}
                  {selectedRole.id === 'ORGANIZER' && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Don't have an account?{' '}
                      <Link
                        to="/register?role=ORGANIZER"
                        className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                      >
                        Create new account
                      </Link>
                    </p>
                  )}

                  {/* Normal User Registration Link */}
                  {selectedRole.id === 'USER' && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Don't have an account?{' '}
                      <Link
                        to="/register?role=USER"
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
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
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        <span>© {new Date().getFullYear()} EventHub Technologies Inc. All rights reserved.</span>
      </footer>

      {/* ── Forgot Password Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Reset Password</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Password recovery is managed by your system administrator. For demo purposes, you can use the default demo credentials provided on the login card.
              </p>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-semibold transition-colors cursor-pointer"
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
