import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  X,
  Shield,
  Calendar,
  User,
  ArrowLeft,
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
const ROLES = [
  {
    id: 'USER',
    name: 'User',
    title: 'Attendee / User Portal',
    stepNumber: '1',
    description: 'Explore live events, book tickets & access QR passes',
    icon: User,
    redirect: '/',
    demo: {
      email: 'user@eventhub.com',
      password: 'User@123',
    },
  },
  {
    id: 'ORGANIZER',
    name: 'Organizer',
    title: 'Organizer Workspace',
    stepNumber: '2',
    description: 'Host experiences, manage ticket sales & gate check-ins',
    icon: Calendar,
    redirect: '/organizer/create-event',
    demo: {
      email: 'organizer@eventhub.com',
      password: 'Organizer@123',
    },
  },
  {
    id: 'ADMIN',
    name: 'Admin',
    title: 'Administrator Console',
    stepNumber: '3',
    description: 'Platform management, system governance & analytics',
    icon: Shield,
    redirect: '/admin/dashboard',
    demo: {
      email: 'admin@eventhub.com',
      password: 'Admin@123',
    },
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const selectedRole = ROLES[selectedRoleIndex];

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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Role Selection
  const handleSelectRole = (index) => {
    setSelectedRoleIndex(index);
    setAuthError('');
    setIsSuccess(false);
  };

  // Quick fill helper
  const handleFillDemo = () => {
    setValue('email', selectedRole.demo.email, { shouldValidate: true });
    setValue('password', selectedRole.demo.password, { shouldValidate: true });
  };

  // Submit Handler
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setAuthError('');

    try {
      const authenticatedUser = await login(values.email, values.password, selectedRole.id);

      if (!authenticatedUser || authenticatedUser.role !== selectedRole.id) {
        throw new Error('This account does not belong to the selected role.');
      }

      setIsSuccess(true);

      setTimeout(() => {
        const destination =
          selectedRole.id === 'USER'
            ? location.state?.from?.pathname || selectedRole.redirect
            : selectedRole.redirect;
        navigate(destination, { replace: true });
      }, 500);
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
    <div className="min-h-screen w-full bg-[#07070a] text-white flex flex-col justify-between p-3 sm:p-6 lg:p-8 font-sans selection:bg-purple-500/30">
      
      {/* ── Top Header: Brand (Left) & Back to Home (Right) ───────────────── */}
      <header className="w-full max-w-5xl mx-auto py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Event<span className="text-indigo-400">Hub</span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all hover:scale-[1.02]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* ── Main Window Frame ──────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mx-auto my-auto rounded-[32px] bg-[#0c0d12] border border-white/[0.08] p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 shadow-2xl relative">
        
        {/* ── LEFT PANEL: Radiant Purple Ambient Card with Step Pills ──────── */}
        <div
          className="relative rounded-[26px] overflow-hidden p-8 sm:p-10 flex flex-col justify-between items-center text-center w-full lg:w-[48%] min-h-[520px] lg:min-h-[620px] border border-white/10 shadow-2xl"
          style={{
            background:
              'radial-gradient(ellipse 95% 75% at 50% 12%, rgba(147, 51, 234, 0.72) 0%, rgba(99, 102, 241, 0.35) 42%, rgba(14, 11, 26, 0.95) 75%, #08070d 100%)',
          }}
        >
          {/* Subtle noise/dot overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Top Brand Logo inside Card */}
          <div className="relative z-10 flex items-center gap-2 text-white font-bold text-base">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <span>EventHub</span>
          </div>

          {/* Center Content: Headline & 3 Interactive Role Pills */}
          <div className="relative z-10 w-full max-w-sm space-y-6 my-auto py-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome to EventHub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/80 max-w-xs mx-auto leading-relaxed">
                Choose your portal to sign in and access your workspace.
              </p>
            </div>

            {/* Vertical Pill List */}
            <div className="space-y-3 pt-2">
              {ROLES.map((role, idx) => {
                const isActive = selectedRoleIndex === idx;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(idx)}
                    className={`w-full py-3.5 px-4 rounded-2xl flex items-center gap-3.5 transition-all duration-200 text-left cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-950 font-bold shadow-xl scale-[1.02]'
                        : 'bg-white/[0.07] hover:bg-white/[0.12] text-white/70 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {/* Circle Number Badge */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                        isActive
                          ? 'bg-slate-950 text-white'
                          : 'bg-white/[0.15] text-white/90'
                      }`}
                    >
                      {role.stepNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isActive ? 'text-slate-950' : 'text-white'}`}>
                        {role.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Trust/Footer note */}
          <div className="relative z-10 text-[11px] text-slate-400/80 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Instant QR pass verification & secure access</span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Clean Dark Sign In Form ─────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-2 sm:px-4 py-4">
          
          {/* Header */}
          <div className="text-center sm:text-left mb-6 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign In Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Enter your credentials to access your {selectedRole.name.toLowerCase()} account.
            </p>
          </div>

          {/* Google Button (Single full-width button, Github removed) */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2.5 px-4 rounded-xl bg-[#14151c] hover:bg-[#1a1b24] border border-white/[0.08] text-xs font-semibold text-slate-300 flex items-center justify-center gap-2.5 transition-colors cursor-pointer mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-[#0c0d12] px-3 text-[11px] uppercase font-bold text-slate-500 absolute">
              Or
            </span>
          </div>

          {/* Demo Quick Pill */}
          <div className="mb-4 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              Demo: <strong className="text-slate-200">{selectedRole.demo.email}</strong>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer"
            >
              Auto Fill
            </button>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Authentication successful! Redirecting...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder={`eg. ${selectedRole.demo.email}`}
                className={`w-full px-4 py-3 rounded-xl bg-[#161720] border text-sm text-white placeholder-slate-500 outline-none transition-all ${
                  errors.email
                    ? 'border-rose-500/60 focus:border-rose-400'
                    : 'border-white/[0.08] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-400 mt-1 pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder="Enter your password"
                  className={`w-full pl-4 pr-11 py-3 rounded-xl bg-[#161720] border text-sm text-white placeholder-slate-500 outline-none transition-all ${
                    errors.password
                      ? 'border-rose-500/60 focus:border-rose-400'
                      : 'border-white/[0.08] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-[11px] text-rose-400 mt-1 pl-1">
                  {errors.password.message}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  Must be at least 6 characters.
                </p>
              )}
            </div>

            {/* Solid Pure White CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting || isSuccess ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Signing In as {selectedRole.name}...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-xs text-slate-400">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="font-bold text-white hover:underline transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>

      </div>

      {/* ── Forgot Password Modal ──────────────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#12131c] border border-white/10 p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Password recovery is managed by the system administrator. For demo testing, use the auto-fill demo credentials provided on the login card.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Bottom subtle space/copyright */}
      <footer className="w-full text-center py-2 text-[11px] text-slate-500">
        <span>© {new Date().getFullYear()} EventHub Technologies Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
