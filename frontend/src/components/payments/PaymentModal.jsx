import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  Lock,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import api from '../../api/client';

export default function PaymentModal({ isOpen, onClose, event, onSuccess }) {
  if (!isOpen || !event) return null;

  const [activeTab, setActiveTab] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successState, setSuccessState] = useState(false);

  // Form states
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Create order on backend
      const orderRes = await api.post('/payments/create-order', {
        eventId: event.id,
      });

      if (!orderRes.data?.success) {
        throw new Error(orderRes.data?.message || 'Failed to initialize payment.');
      }

      const { orderId } = orderRes.data;

      // 2. Small delay to simulate secure payment gateway processing
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // 3. Verify payment on backend
      const verifyRes = await api.post('/payments/verify', {
        eventId: event.id,
        orderId,
        paymentMethod: activeTab,
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      });

      if (verifyRes.data?.success) {
        setSuccessState(true);
        setTimeout(() => {
          onSuccess({
            ticket: verifyRes.data.ticket,
            registration: verifyRes.data.registration,
            event,
          });
          onClose();
        }, 1200);
      } else {
        throw new Error(verifyRes.data?.message || 'Payment verification failed.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMsg(
        err.response?.data?.message ||
        err.message ||
        'Payment could not be processed. Please check details or try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl rounded-3xl bg-[#0c1024] border border-white/10 shadow-2xl overflow-hidden relative my-8"
      >
        {/* Top Gradient Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Modal Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Checkout & Payment
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  256-bit Encrypted
                </span>
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-xs">{event.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Splash */}
        {successState ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your payment of ₹{event.price} has been verified and ticket has been generated.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePayNow} className="p-6 space-y-6">
            {/* Order Summary Pill */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">Total Payable Amount</p>
                <p className="text-2xl font-black text-white mt-0.5">₹{event.price}</p>
              </div>
              <div className="text-right text-[11px] text-slate-400 space-y-0.5">
                <p>1x General Admission</p>
                <p className="text-emerald-400 font-medium">Convenience Fee: ₹0 (Waived)</p>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('UPI')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    activeTab === 'UPI'
                      ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-lg shadow-indigo-500/15'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('CARD')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    activeTab === 'CARD'
                      ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-lg shadow-indigo-500/15'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('NETBANKING')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    activeTab === 'NETBANKING'
                      ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-lg shadow-indigo-500/15'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('WALLET')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    activeTab === 'WALLET'
                      ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-lg shadow-indigo-500/15'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-indigo-400" />
                  <span>Wallets</span>
                </button>
              </div>
            </div>

            {/* Tab 1: UPI Options */}
            {activeTab === 'UPI' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-indigo-400" />
                      Scan & Pay with Any UPI App
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Scan using Google Pay, PhonePe, Paytm, or BHIM UPI
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-md flex items-center justify-center">
                    {/* Visual QR Code Placeholder */}
                    <div className="w-full h-full border-2 border-slate-900 border-dashed rounded-lg flex items-center justify-center bg-slate-100">
                      <QrCode className="w-10 h-10 text-slate-900" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Or Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    {['@okhdfcbank', '@okaxis', '@ybl', '@paytm'].map((suf) => (
                      <button
                        key={suf}
                        type="button"
                        onClick={() => setUpiId((prev) => (prev ? prev.split('@')[0] + suf : 'user' + suf))}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                      >
                        {suf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Credit / Debit Card */}
            {activeTab === 'CARD' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    placeholder="4532 •••• •••• 8892"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      placeholder="•••"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name as printed on card"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Net Banking */}
            {activeTab === 'NETBANKING' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Popular Indian Banks
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        selectedBank === b
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Wallets */}
            {activeTab === 'WALLET' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Digital Wallet
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet', 'MobiKwik'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWallet(w)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        selectedWallet === w
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Pay Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Payment of ₹{event.price}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{event.price} & Confirm Ticket</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted • Instant Ticket Delivery via Email & QR Code</span>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
