'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import { usersApi } from '@/lib/api';

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.2 } };

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, googleLogin, loading } = useAuthStore();

  const [isLogin, setIsLogin]                     = useState(true);
  const [showPass, setShowPass]                   = useState(false);
  const [showOtp, setShowOtp]                     = useState(false);
  const [otpCode, setOtpCode]                     = useState(['', '', '', '', '', '']);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [form, setForm]                           = useState({ name: '', email: '', password: '', phoneNumber: '' });
  const [googleReady, setGoogleReady]             = useState(false);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleGoogleCallback = useCallback(async (response) => {
    const res = await googleLogin(response.credential);
    if (res.ok) { toast.success('Welcome!'); router.push('/'); }
    else toast.error(res.message);
  }, [googleLogin, router]);

  // Load Google GSI script once
  useEffect(() => {
    if (document.getElementById('google-gsi-script')) {
      if (window.google?.accounts) setGoogleReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);
  }, []);

  // Render the Google button whenever it becomes visible
  // The key insight: #google-signin-btn is ALWAYS in the DOM (never unmounted).
  // We re-render the button when: script loads, or OTP view closes.
  useEffect(() => {
    if (!googleReady || showOtp) return;

    // Use a small rAF to let the DOM settle after AnimatePresence animations
    const id = requestAnimationFrame(() => {
      const el = document.getElementById('google-signin-btn');
      if (!el) return;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
      el.innerHTML = '';
      window.google.accounts.id.renderButton(el, {
        theme: 'outline',
        size: 'large',
        width: el.offsetWidth || 320,
        text: 'continue_with',
      });
    });
    return () => cancelAnimationFrame(id);
  }, [googleReady, showOtp, handleGoogleCallback]);

  /* ── OTP handlers ─────────────────────────────────────────────────────── */
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const next = [...otpCode];
    next[index] = value;
    setOtpCode(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const sendOtp = async () => {
    try {
      setPendingRegistration({ name: form.name, email: form.email, password: form.password, phoneNumber: form.phoneNumber });
      await usersApi.sendOtp({ email: form.email });
      toast.success('Verification code sent to your email!');
      setShowOtp(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtpAndRegister = async () => {
    try {
      const { data } = await usersApi.verifyOtpAndRegister({ ...pendingRegistration, otp: otpCode.join('') });
      // Backend now sets auth cookies and returns the user — log in immediately
      const { resetRefreshState } = await import('@/lib/api');
      resetRefreshState();
      useAuthStore.setState({ user: data.user });
      toast.success(`Welcome, ${data.user?.name || 'aboard'}! 🎉`);
      const next = new URLSearchParams(window.location.search).get('next') || '/';
      router.push(next);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleSubmit = async () => {
    if (isLogin) {
      const res = await login(form.email, form.password);
      if (res.ok) { toast.success('Welcome back!'); router.push('/'); }
      else toast.error(res.message);
    } else {
      if (!form.name || !form.email || !form.password) { toast.error('Please fill in all required fields'); return; }
      await sendOtp();
    }
  };

  /* ── render ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.04]" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center,rgba(124,58,255,0.08),transparent 70%)' }} />

      {/*
        IMPORTANT: This outer card is NEVER unmounted. Only its inner content animates.
        This keeps #google-signin-btn permanently in the DOM so Google GSI never loses
        its reference — which was the root cause of the button disappearing on toggle.
      */}
      <div className="w-full max-w-md relative">
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
        <div className="card-glass p-8" style={{ borderRadius: '0 0 4px 4px' }}>

          {/* Logo — always visible */}
          <div className="flex items-center gap-2 mb-8">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-purple-500 rotate-45" />
              <div className="absolute inset-1 bg-purple-900 rotate-45" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-xs text-white z-10">LU</span>
            </div>
            <span className="font-display text-lg tracking-widest" style={{ color: 'var(--text-primary)' }}>
              LEVEL<span className="text-purple-500">UP</span>
            </span>
          </div>

          {/* ── OTP view ── */}
          <AnimatePresence mode="wait">
            {showOtp && (
              <motion.div key="otp" {...fade}>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => { setShowOtp(false); setOtpCode(['','','','','','']); }}
                    className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button onClick={() => { setShowOtp(false); setPendingRegistration(null); setOtpCode(['','','','','','']); }}
                    className="text-sm text-red-400 hover:text-red-300">
                    Cancel
                  </button>
                </div>

                <h1 className="font-display text-3xl tracking-wider leading-none mb-2" style={{ color: 'var(--text-primary)' }}>
                  Verify your email
                </h1>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                  Enter the 6-digit code sent to <span className="text-purple-400">{pendingRegistration?.email}</span>
                </p>

                <div className="flex justify-center gap-2 mb-8">
                  {otpCode.map((digit, i) => (
                    <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center font-mono input-field" style={{ fontSize: '1.5rem' }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <button onClick={verifyOtpAndRegister} disabled={loading || otpCode.some(d => !d)}
                  className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <div className="spinner !w-4 !h-4" /> : <ArrowRight size={15} />}
                  Verify & Create Account
                </button>

                <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                  Didn't receive code?{' '}
                  <button onClick={sendOtp} className="text-purple-400 hover:text-purple-300" disabled={loading}>Resend</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Login / Register view — always rendered so Google button stays alive ── */}
          <div style={{ display: showOtp ? 'none' : 'block' }}>

            {/* Heading animates when toggling login ↔ register */}
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? 'login-head' : 'register-head'} {...fade}>
                <h1 className="font-display text-4xl tracking-wider leading-none" style={{ color: 'var(--text-primary)' }}>
                  {isLogin ? t('auth.login_title') : t('auth.register_title')}
                </h1>
                <p className="text-sm mt-2 mb-8" style={{ color: 'var(--text-muted)' }}>
                  {isLogin ? t('auth.login_sub') : t('auth.register_sub')}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="space-y-4">
              {/* Name — slides in for register */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div key="name-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('auth.name')}</label>
                    <input className="input-field" placeholder="John Doe" value={form.name} onChange={set('name')} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('auth.email')}</label>
                <input type="email" className="input-field" placeholder="john@example.com" value={form.email} onChange={set('email')} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{t('auth.password')}</label>
                  {isLogin && (
                    <a href="/forgot-password" className="text-[10px] font-mono hover:text-purple-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input-field pr-10" placeholder="••••••••" value={form.password} onChange={set('password')} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Phone — slides in for register */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div key="phone-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('auth.phone')}</label>
                    <input type="tel" className="input-field" placeholder="+21612345678" value={form.phoneNumber} onChange={set('phoneNumber')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full mt-6 py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="spinner !w-4 !h-4" /> : <ArrowRight size={15} />}
              {loading
                ? (isLogin ? t('auth.logging_in') : 'Sending code...')
                : (isLogin ? t('auth.login_btn') : t('auth.register_btn'))}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            {/*
              Google button container — NEVER conditionally rendered or unmounted.
              GSI's renderButton() writes into this div. If this div disappears from
              the DOM, GSI loses its handle and the button won't render again.
              Visibility is controlled purely by the parent `display:none` block above.
            */}
            <div id="google-signin-btn" className="w-full flex justify-center min-h-[44px]" />

            <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
              {isLogin ? t('auth.no_account') : t('auth.has_account')}{' '}
              <button onClick={() => { setIsLogin(v => !v); setForm({ name: '', email: '', password: '', phoneNumber: '' }); }}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                {isLogin ? t('auth.register_link') : t('auth.login_link')}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
