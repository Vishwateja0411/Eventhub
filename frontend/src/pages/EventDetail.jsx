import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/tickets/TicketModal';
import PaymentModal from '../components/payments/PaymentModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle,
  Share2,
  Tag,
  AlertCircle,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';

export default function EventDetail() {
  const { slugOrId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [ticketModalData, setTicketModalData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${slugOrId}`);
        setEvent(res.data?.event);
      } catch (err) {
        console.error('Failed to load event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slugOrId]);

  // Check if current user is already registered
  useEffect(() => {
    if (isAuthenticated && event?.id) {
      api
        .get('/registrations/my-registrations')
        .then((res) => {
          const match = res.data?.registrations?.find((r) => r.event.id === event.id);
          if (match && match.status === 'CONFIRMED') {
            setUserRegistration(match);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, event]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return navigate('/login');
    }

    if (event?.price > 0) {
      setShowPaymentModal(true);
    } else {
      handleFreeRegister();
    }
  };

  const handleFreeRegister = async () => {
    setRegistering(true);
    setErrorMsg('');

    try {
      const res = await api.post(`/registrations/${event.id}`);
      if (res.data?.success) {
        setUserRegistration(res.data.registration);
        setTicketModalData({
          ticket: res.data.ticket,
          event,
        });
        setEvent((prev) => ({
          ...prev,
          spotsLeft: Math.max(0, prev.spotsLeft - 1),
          attendeeCount: (prev.attendeeCount || 0) + 1,
        }));
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handlePaymentSuccess = ({ ticket, registration }) => {
    setUserRegistration(registration);
    setTicketModalData({
      ticket,
      event,
    });
    setEvent((prev) => ({
      ...prev,
      spotsLeft: Math.max(0, prev.spotsLeft - 1),
      attendeeCount: (prev.attendeeCount || 0) + 1,
    }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Event Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The event you are looking for may have been removed or unpublished.
        </p>
        <Link to="/events" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Back to Events
        </Link>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isSoldOut = event.spotsLeft <= 0;
  const isFree = event.isFree || event.price === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all events
      </Link>

      {/* Hero Media Banner */}
      <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl bg-slate-900">
        {event.bannerUrl ? (
          <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-900 to-purple-900 text-white p-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center max-w-2xl">{event.title}</h1>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
              {event.category?.name || 'Event'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {event.title}
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: event.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Event link copied to clipboard!');
                }
              }}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
              title="Share event"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (2/3): Description, Schedule, Venue, Gallery */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Date & Time</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {startDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Location</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {event.venue}
                </p>
                <p className="text-xs text-slate-500">{event.city}, {event.country}</p>
              </div>
            </div>
          </div>

          {/* About Event */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">About This Event</h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 items-center">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {event.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Event Gallery Images */}
          {event.images && event.images.length > 0 && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Event Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {event.images.map((img) => (
                  <div key={img.id} className="h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={img.url} alt={img.caption || 'Event image'} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizer Card */}
          <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-base uppercase">
                {event.organizer?.name?.slice(0, 2) || 'OR'}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Organized By</p>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{event.organizer?.name}</h4>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Organizer
            </span>
          </div>
        </div>

        {/* Right Column (1/3): Sticky Registration Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 glass-card p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            {/* Price Header */}
            <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">Ticket Price</span>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {isFree ? 'Free Admission' : `₹${event.price}`}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                Confirmed Seat
              </span>
            </div>

            {/* Capacity status */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Capacity Status</span>
                <span className={isSoldOut ? 'text-rose-600' : 'text-emerald-600'}>
                  {isSoldOut ? 'Sold Out' : `${event.spotsLeft} Spots Left`}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSoldOut ? 'bg-rose-500' : 'bg-indigo-600'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      ((event.capacity - event.spotsLeft) / event.capacity) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {event.attendeeCount || 0} registered out of {event.capacity} total capacity
              </p>
            </div>

            {/* Error banner if any */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Registration Action */}
            {userRegistration ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                    You're Registered for this Event!
                  </p>
                </div>
                <button
                  onClick={() =>
                    setTicketModalData({
                      ticket: userRegistration.ticket,
                      event,
                    })
                  }
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                >
                  View Your QR Ticket
                </button>
              </div>
            ) : (
              <button
                disabled={isSoldOut || registering}
                onClick={handleBookingClick}
                className={`w-full py-4 px-4 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isSoldOut
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                    : event.price > 0
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25 hover:scale-[1.02]'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 hover:scale-[1.02]'
                }`}
              >
                {registering ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Securing your ticket...
                  </>
                ) : isSoldOut ? (
                  'Event is Sold Out'
                ) : !isAuthenticated ? (
                  'Sign In to Book Ticket'
                ) : event.price > 0 ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{event.price} & Book Ticket</span>
                  </>
                ) : (
                  'Register for Free & Get QR Ticket'
                )}
              </button>
            )}

            <div className="space-y-2 pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Instant digital QR pass issued to your account
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" /> Fast-track entrance check-in at venue
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          event={event}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* QR Ticket Modal */}
      {ticketModalData && (
        <TicketModal
          ticket={ticketModalData.ticket}
          event={ticketModalData.event}
          onClose={() => setTicketModalData(null)}
        />
      )}
    </div>
  );
}
