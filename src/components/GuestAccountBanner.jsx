'use client';
import { useState } from 'react';
import { X, UserPlus, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * GuestAccountBanner
 *
 * Props:
 *  - prefillEmail    string   — email already known (from order form / OTP)
 *  - prefillName     string   — name already known
 *  - prefillPhone    string   — phone already known
 *  - context         string   — 'cart' | 'checkout' | 'shop'  (controls copy)
 *  - onDismiss       fn       — called when user closes the banner permanently
 */
export default function GuestAccountBanner({
  prefillEmail = '',
  prefillName  = '',
  prefillPhone = '',
  context      = 'cart',
  onDismiss,
}) {
  const { user, register, refreshUser } = useAuthStore();

  // Banner visibility
  const [visible, setVisible]     = useState(true);
  // 'prompt' | 'form' | 'otp' | 'done'
  const [step, setStep]           = useState('prompt');
  const [loading, setLoading]     = useState(false);

  // Form fields — pre-filled from props
  const [name, setName]           = useState(prefillName);
  const [email, setEmail]         = useState(prefillEmail);
  const [phone, setPhone]         = useState(prefillPhone);
  const [password, setPassword]   = useState('');
  const [errors, setErrors]       = useState({});

  // OTP state
  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [sentOtp, setSentOtp]     = useState(false);

  // Hide if already logged in
  if (user || !visible) return null;

  const dismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const contextCopy = {
    cart:     'Save your cart and track orders — create a free account in seconds.',
    checkout: 'Your order is confirmed! Create an account to track it and shop faster next time.',
    shop:     'Create a free account to save wishlists, track orders, and check out faster.',
  };

  /* ── Validate form ───────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!name.trim())     e.name     = 'Required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    if (!password || password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Step: send OTP ──────────────────────────────────────────── */
  const handleSendOtp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await usersApi.sendOtp({ email });
      setSentOtp(true);
      setStep('otp');
      toast.success('Check your email for a verification code!');
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to send code.';
      if (e.response?.status === 409) {
        setErrors(prev => ({ ...prev, email: 'This email already has an account.' }));
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP input helpers ───────────────────────────────────────── */
  const handleOtpChange = (i, val) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`gab-otp-${i + 1}`)?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0)
      document.getElementById(`gab-otp-${i - 1}`)?.focus();
  };

  /* ── Step: verify OTP + register + auto-login ────────────────── */
  const handleVerify = async () => {
    if (otp.some(d => !d)) return;
    setLoading(true);
    try {
      const result = await register(name, email, password, phone);
      // Note: register now calls verifyOtpAndRegister internally via usersApi
      // We'll call the API directly here to pass the OTP
      void result; // handled below
    } catch { /* fall through */ }

    // Call verifyOtpAndRegister directly (store.register wraps a different endpoint)
    try {
      const { useAuthStore: store } = await import('@/store');
      store.setState({ loading: true });
      const { data } = await usersApi.verifyOtpAndRegister({
        name,
        email,
        password,
        phoneNumber: phone,
        otp: otp.join(''),
      });
      const { resetRefreshState } = await import('@/lib/api');
      resetRefreshState();
      store.setState({ user: data.user, loading: false });
      setStep('done');
      toast.success(`Welcome, ${data.user?.name || name}! 🎉`);
    } catch (e) {
      const { useAuthStore: store } = await import('@/store');
      store.setState({ loading: false });
      toast.error(e.response?.data?.message || 'Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await usersApi.sendOtp({ email });
      setOtp(['', '', '', '', '', '']);
      toast.success('New code sent!');
    } catch {
      toast.error('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <AnimatePresence>
      {step !== 'done' && (
        <motion.div
          key="gab"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="relative mb-6 rounded border overflow-hidden"
          style={{
            borderColor: 'rgba(124,58,255,0.35)',
            background: 'rgba(124,58,255,0.06)',
          }}
        >
          {/* Top accent line */}
          <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 p-1 rounded transition-colors hover:text-purple-400"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>

          <div className="p-5 pr-10">
            {/* ── Prompt step ── */}
            {step === 'prompt' && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(124,58,255,0.15)' }}>
                    <UserPlus size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Create a free account
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {contextCopy[context]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep('form')}
                  className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4 flex-shrink-0 self-start sm:self-center"
                >
                  Create Account <ChevronRight size={13} />
                </button>
              </div>
            )}

            {/* ── Form step ── */}
            {step === 'form' && (
              <div>
                <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                  Create your account
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                    <input
                      className="input-field text-sm"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Email</label>
                    {prefillEmail ? (
                      <div className="input-field text-sm flex items-center gap-2 cursor-not-allowed"
                        style={{ opacity: 0.75, background: 'var(--bg-secondary)' }}>
                        <span className="flex-1" style={{ color: 'var(--text-primary)' }}>{email}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(124,58,255,0.12)', color: 'var(--purple)' }}>from order</span>
                      </div>
                    ) : (
                      <input
                        type="email"
                        className="input-field text-sm"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="john@example.com"
                      />
                    )}
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Password</label>
                    <input
                      type="password"
                      className="input-field text-sm"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                    />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Phone (optional)</label>
                    <input
                      type="tel"
                      className="input-field text-sm"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+21612345678"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4 disabled:opacity-60"
                  >
                    {loading ? <div className="spinner !w-3.5 !h-3.5" /> : <ChevronRight size={13} />}
                    Continue
                  </button>
                  <button
                    onClick={() => setStep('prompt')}
                    className="text-xs font-mono transition-colors hover:text-purple-400"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* ── OTP step ── */}
            {step === 'otp' && (
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Verify your email
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  Enter the 6-digit code sent to <span className="text-purple-400">{email}</span>
                </p>
                <div className="flex gap-2 mb-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`gab-otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      className="w-10 h-12 text-center font-mono input-field"
                      style={{ fontSize: '1.25rem' }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleVerify}
                    disabled={loading || otp.some(d => !d)}
                    className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4 disabled:opacity-60"
                  >
                    {loading ? <div className="spinner !w-3.5 !h-3.5" /> : <UserPlus size={13} />}
                    Create Account
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-xs transition-colors hover:text-purple-300"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Resend code
                  </button>
                  <button
                    onClick={() => setStep('form')}
                    className="text-xs transition-colors hover:text-purple-400"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
