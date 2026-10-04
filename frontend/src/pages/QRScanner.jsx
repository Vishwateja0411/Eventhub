import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Keyboard,
  ArrowLeft,
  Volume2,
  VolumeX,
  History,
  Sparkles,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import client from '../api/client';

export default function QRScanner() {
  const [searchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentScans, setRecentScans] = useState([]);
  const [cameraError, setCameraError] = useState('');
  const html5QrCodeRef = useRef(null);

  // Audio beeps using Web Audio API
  const playBeep = (isSuccess) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isSuccess) {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.25);
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3 note low buzz
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch (_) {}
  };

  // Fetch organizer events for dropdown
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await client.get('/api/events/organizer/my-events');
        if (res.data?.success) {
          setEvents(res.data.events || []);
          if (!selectedEventId && res.data.events?.length > 0) {
            setSelectedEventId(String(res.data.events[0].id));
          }
        }
      } catch (_) {}
    }
    loadEvents();
  }, []);

  const handleTicketCheckIn = async (code) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    try {
      const res = await client.post('/api/attendance/check-in', {
        ticketCode: cleanCode,
      });

      if (res.data?.success) {
        playBeep(true);
        const result = {
          success: true,
          type: 'SUCCESS',
          message: res.data.message,
          attendee: res.data.attendee,
          event: res.data.event,
          ticketCode: cleanCode,
          timestamp: new Date().toLocaleTimeString(),
        };
        setScanResult(result);
        setRecentScans((prev) => [result, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      playBeep(false);
      const isConflict = err.response?.status === 409;
      const result = {
        success: false,
        type: isConflict ? 'CONFLICT' : 'ERROR',
        message:
          err.response?.data?.message || 'Check-in failed. Please verify the ticket code.',
        ticketCode: cleanCode,
        timestamp: new Date().toLocaleTimeString(),
      };
      setScanResult(result);
      setRecentScans((prev) => [result, ...prev.slice(0, 9)]);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode) {
      handleTicketCheckIn(manualCode);
      setManualCode('');
    }
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError('');
    try {
      const html5QrCode = new Html5Qrcode('qr-reader-target');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Prevent multiple triggers within short burst
          handleTicketCheckIn(decodedText);
        },
        () => {}
      );
      setIsScanning(true);
    } catch (err) {
      console.warn('Camera failed to start:', err);
      setCameraError(
        'Unable to access camera. Please allow camera permissions in your browser or use the manual code input.'
      );
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (_) {}
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/organizer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Organizer Dashboard
          </Link>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundEnabled ? 'Mute Audio Beep' : 'Unmute Audio Beep'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Venue Check-in Scanner
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
            Scan attendee digital tickets using your camera or enter cryptographic ticket codes to verify admission.
          </p>
        </div>

        {/* Live Result Alert Card */}
        {scanResult && (
          <div
            className={`p-6 rounded-2xl border transition-all animate-in zoom-in-95 duration-200 shadow-xl ${
              scanResult.type === 'SUCCESS'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : scanResult.type === 'CONFLICT'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-1">
                {scanResult.type === 'SUCCESS' && (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                )}
                {scanResult.type === 'CONFLICT' && (
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                )}
                {scanResult.type === 'ERROR' && <XCircle className="w-8 h-8 text-rose-500" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-base font-bold ${
                      scanResult.type === 'SUCCESS'
                        ? 'text-emerald-900 dark:text-emerald-100'
                        : scanResult.type === 'CONFLICT'
                        ? 'text-amber-900 dark:text-amber-100'
                        : 'text-rose-900 dark:text-rose-100'
                    }`}
                  >
                    {scanResult.type === 'SUCCESS'
                      ? 'Admit Attendee — Valid Ticket'
                      : scanResult.type === 'CONFLICT'
                      ? 'Already Checked In'
                      : 'Check-in Failed'}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">{scanResult.timestamp}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{scanResult.message}</p>
                {scanResult.attendee && (
                  <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center gap-4 text-xs font-medium text-emerald-900 dark:text-emerald-200">
                    <span>Attendee: {scanResult.attendee.name}</span>
                    <span>•</span>
                    <span>{scanResult.attendee.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camera Scanner View */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Camera Scanner
                </h2>
              </div>
              {isScanning ? (
                <button
                  onClick={stopCamera}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                >
                  Stop Camera
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-500 transition-colors"
                >
                  Start Camera
                </button>
              )}
            </div>

            <div
              id="qr-reader-target"
              className="w-full aspect-square bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700"
            >
              {!isScanning && (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Camera is currently stopped. Click "Start Camera" to scan tickets using your webcam or phone camera.
                  </p>
                </div>
              )}
            </div>

            {cameraError && (
              <p className="text-xs text-rose-500 dark:text-rose-400">{cameraError}</p>
            )}
          </div>

          {/* Manual Code Input & Recent Activity */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-primary-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Manual Code Verification
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type or paste the ticket code (e.g., TKT-12345678-ABCD) from an attendee’s pass:
              </p>

              <form onSubmit={handleManualSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter ticket code (e.g. TKT-B3E03AE0-E2E1)..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={!manualCode.trim()}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-50 transition-colors"
                >
                  Verify & Check In
                </button>
              </form>
            </div>

            {/* Session History */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Recent Venue Scans
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">{recentScans.length} scans</span>
              </div>

              {recentScans.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No scans recorded in this active session.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-52 overflow-y-auto">
                  {recentScans.map((scan, i) => (
                    <div key={i} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {scan.type === 'SUCCESS' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span className="font-mono text-slate-900 dark:text-white">
                          {scan.attendee?.name || scan.ticketCode}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                        {scan.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
