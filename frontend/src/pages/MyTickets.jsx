import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import TicketModal from '../components/tickets/TicketModal';
import { Ticket, Calendar, MapPin, QrCode, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function MyTickets() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalTicket, setActiveModalTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/registrations/my-registrations');
      setRegistrations(res.data?.registrations || []);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCancel = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    try {
      await api.delete(`/registrations/${regId}`);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel registration.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Tickets & Passes</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access your digital admission passes with instant QR check-in codes
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const isCancelled = reg.status === 'CANCELLED';
            const isCheckedIn = reg.ticket?.isCheckedIn;

            return (
              <div
                key={reg.id}
                className="glass-card rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-glow transition-all"
              >
                {/* Event info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isCancelled
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : isCheckedIn
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {isCancelled ? 'Cancelled' : isCheckedIn ? 'Checked In' : 'Active Pass'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold">
                      {reg.ticket?.ticketCode}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    <Link to={`/events/${reg.event.slug || reg.event.id}`} className="hover:underline">
                      {reg.event.title}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {new Date(reg.event.startDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {reg.event.venue}, {reg.event.city}
                    </span>
                  </div>
                </div>

                {/* QR Preview & Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                  {reg.ticket?.qrCodeUrl && !isCancelled && (
                    <button
                      onClick={() =>
                        setActiveModalTicket({
                          ticket: reg.ticket,
                          event: reg.event,
                        })
                      }
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                    >
                      <QrCode className="w-4 h-4" /> Show QR Ticket
                    </button>
                  )}

                  {!isCancelled && !isCheckedIn && (
                    <button
                      onClick={() => handleCancel(reg.id)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Tickets Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't registered for any events yet. Explore upcoming conferences and reserve your spot!
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-indigo-700"
          >
            Explore Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Ticket Modal */}
      {activeModalTicket && (
        <TicketModal
          ticket={activeModalTicket.ticket}
          event={activeModalTicket.event}
          onClose={() => setActiveModalTicket(null)}
        />
      )}
    </div>
  );
}
