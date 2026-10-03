import React, { useState } from 'react';
import { X, CheckCircle, Copy, Check, Calendar, MapPin, Download } from 'lucide-react';

export default function TicketModal({ ticket, event, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!ticket) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!ticket.qrCodeUrl) return;
    const a = document.createElement('a');
    a.href = ticket.qrCodeUrl;
    a.download = `${ticket.ticketCode}-qr.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-card bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 backdrop-blur-md">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold">You're Registered!</h2>
          <p className="text-xs text-emerald-100 mt-1">Here is your digital admission pass</p>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          {/* Event Mini Details */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
              {event?.title || ticket.event?.title}
            </h3>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(event?.startDate || ticket.event?.startDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {event?.city || ticket.event?.city}
              </span>
            </div>
          </div>

          {/* QR Code Canvas/Image */}
          <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 inline-block shadow-inner">
            {ticket.qrCodeUrl ? (
              <img
                src={ticket.qrCodeUrl}
                alt={`QR Ticket ${ticket.ticketCode}`}
                className="w-48 h-48 mx-auto object-contain rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                Generating QR code...
              </div>
            )}
          </div>

          {/* Ticket Code Box */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Ticket Identifier
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                {ticket.ticketCode}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-indigo-600 transition-colors shadow-xs"
              title="Copy Ticket Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadQR}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" /> Save QR Image
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
