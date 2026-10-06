import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(
    searchParams.get('role')?.toUpperCase() === 'ORGANIZER' ? 'ORGANIZER' : 'USER'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const queryRole = searchParams.get('role')?.toUpperCase();
    if (queryRole === 'ORGANIZER') {
      setRole('ORGANIZER');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || firstName.trim();

    try {
      await register({ name: fullName, email, password, role });
      if (role === 'ORGANIZER') {
        navigate('/organizer/create-event', { replace: true });
      } else {
        navigate('/events', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
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
        
        {/* ── LEFT PANEL: Radiant Purple Blooming Card ────────────────────── */}
        <div
          className="relative rounded-[26px] overflow-hidden p-8 sm:p-10 flex flex-col justify-between items-center text-center w-full lg:w-[48%] min-h-[520px] lg:min-h-[640px] border border-white/10 shadow-2xl"
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

          {/* Center Content: Headline & 3 Step Pills */}
          <div className="relative z-10 w-full max-w-sm space-y-6 my-auto py-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Get Started with Us
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/80 max-w-xs mx-auto leading-relaxed">
                Complete these easy steps to register your account.
              </p>
            </div>

            {/* Vertical Step Pills */}
            <div className="space-y-3 pt-2">
              {/* Step 1: Active Pure White Pill */}
              <div className="w-full py-3.5 px-4 rounded-2xl bg-white text-slate-950 font-bold shadow-xl flex items-center gap-3.5 text-left">
                <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                  1
                </div>
                <p className="text-sm text-slate-950">Sign up your account</p>
              </div>

              {/* Step 2: Dark translucent Pill (Role selector) */}
              <button
                type="button"
                onClick={() => setRole(role === 'USER' ? 'ORGANIZER' : 'USER')}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.06] text-white/80 hover:text-white flex items-center justify-between gap-3.5 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-white/[0.15] text-white/90 flex items-center justify-center text-xs font-extrabold shrink-0">
                    2
                  </div>
                  <p className="text-sm">Account: {role === 'ORGANIZER' ? 'Organizer' : 'Attendee'}</p>
                </div>
                <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md">
                  Toggle
                </span>
              </button>

              {/* Step 3: Inactive Pill */}
              <div className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.07] border border-white/[0.06] text-white/70 flex items-center gap-3.5 text-left">
                <div className="w-6 h-6 rounded-full bg-white/[0.15] text-white/90 flex items-center justify-center text-xs font-extrabold shrink-0">
                  3
                </div>
                <p className="text-sm">Set up your profile</p>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="relative z-10 text-[11px] text-slate-400/80 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Instant cryptographic QR entry pass enabled</span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Clean Dark Sign Up Form ─────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-2 sm:px-4 py-4">
          
          {/* Header */}
          <div className="text-center sm:text-left mb-6 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign Up Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Enter your personal data to create your account.
            </p>
          </div>

          {/* Google Button (Single full-width button, Github removed) */}
          <button
            type="button"
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

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="eg. John"
                  className="w-full px-4 py-3 rounded-xl bg-[#161720] border border-white/[0.08] text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="eg. Francisco"
                  className="w-full px-4 py-3 rounded-xl bg-[#161720] border border-white/[0.08] text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eg. johnfrans@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-[#161720] border border-white/[0.08] text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#161720] border border-white/[0.08] text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
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
              <p className="text-[11px] text-slate-500 mt-1">
                Must be at least 6 characters.
              </p>
            </div>

            {/* Role Radio Pill */}
            <div className="pt-1">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    role === 'USER'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-[#14151c] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  Attendee (User)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ORGANIZER')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    role === 'ORGANIZER'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-[#14151c] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  Event Organizer
                </button>
              </div>
            </div>

            {/* Solid Pure White CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                loading ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-bold text-white hover:underline transition-all"
            >
              Log in
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom subtle copyright */}
      <footer className="w-full text-center py-2 text-[11px] text-slate-500">
        <span>© {new Date().getFullYear()} EventHub Technologies Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
