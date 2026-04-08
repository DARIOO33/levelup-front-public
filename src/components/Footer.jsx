'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Instagram, Twitter, Youtube, Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { subscriberApi } from '@/lib/api';

export default function Footer() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const dark = resolvedTheme === 'dark';

  // Newsletter state machine: 'idle' | 'loading' | 'otp' | 'verifying' | 'success' | 'error'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('idle'); // idle → loading → otp → verifying → success
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email.');
      return;
    }
    setErrorMsg('');
    setStep('loading');
    try {
      await subscriberApi.subscribe(email);
      setStep('otp');
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Something went wrong. Try again.');
      setStep('idle');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      setErrorMsg('Enter the 4-digit code sent to your email.');
      return;
    }
    setErrorMsg('');
    setStep('verifying');
    try {
      await subscriberApi.verifyOtp(email, otp);
      setStep('success');
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Invalid or expired OTP.');
      setStep('otp');
    }
  };

  const handleResend = async () => {
    setOtp('');
    setErrorMsg('');
    setStep('loading');
    try {
      await subscriberApi.subscribe(email);
      setStep('otp');
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Could not resend OTP.');
      setStep('otp');
    }
  };

  return (
    <footer className="border-t mt-20" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center flex-shrink-0">
                <Image
                  src={!dark ? `/logo.png` : `/logodark.png`}
                  alt="Level Up Logo"
                  width={180}
                  height={40}
                  priority
                  className="object-contain"
                />
              </Link>
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{t('footer.tagline')}</p>
            <div className="flex items-center gap-3 mt-6">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 flex items-center justify-center border transition-all duration-200 hover:border-purple-500 hover:text-purple-400"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest mb-4 text-purple-500">{t('footer.shop')}</h4>
            <ul className="space-y-3">
              {['IEMs', 'New Arrivals', 'Best Sellers', 'Sale'].map(item => (
                <li key={item}><Link href="/shop" className="text-sm transition-colors hover:text-purple-400" style={{ color: 'var(--text-muted)' }}>{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest mb-4 text-purple-500">{t('footer.company')}</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm transition-colors hover:text-purple-400" style={{ color: 'var(--text-muted)' }}>{t('footer.about')}</Link></li>
              <li><Link href="/contact" className="text-sm transition-colors hover:text-purple-400" style={{ color: 'var(--text-muted)' }}>{t('footer.contact')}</Link></li>
              <li><a href="#" className="text-sm transition-colors hover:text-purple-400" style={{ color: 'var(--text-muted)' }}>{t('footer.privacy')}</a></li>
              <li><a href="#" className="text-sm transition-colors hover:text-purple-400" style={{ color: 'var(--text-muted)' }}>{t('footer.terms')}</a></li>
            </ul>
          </div>

          {/* ── Newsletter column ── */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest mb-1 text-purple-500">{t('footer.newsletter_title')}</h4>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{t('footer.newsletter_sub')}</p>

            {/* SUCCESS */}
            {step === 'success' && (
              <div className="flex items-center gap-2 text-green-500 text-xs font-mono">
                <CheckCircle size={14} />
                <span>You're subscribed! 🎧</span>
              </div>
            )}

            {/* STEP 1 — Email input */}
            {(step === 'idle' || step === 'loading') && (
              <>
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                    placeholder={t('footer.newsletter_placeholder')}
                    disabled={step === 'loading'}
                    className="flex-1 px-3 py-2 text-xs outline-none"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRight: 'none', color: 'var(--text-primary)', borderRadius: '2px 0 0 2px' }}
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={step === 'loading'}
                    className="px-3 py-2 text-white text-xs flex items-center transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--purple)', borderRadius: '0 2px 2px 0' }}
                  >
                    {step === 'loading'
                      ? <Loader2 size={14} className="animate-spin" />
                      : <ArrowRight size={14} />}
                  </button>
                </div>
                {errorMsg && <p className="text-xs mt-1 text-red-400">{errorMsg}</p>}
              </>
            )}

            {/* STEP 2 — OTP input */}
            {(step === 'otp' || step === 'verifying') && (
              <>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  Check <span className="text-purple-400">{email}</span> for a 4-digit code.
                </p>
                <div className="flex">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setErrorMsg(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                    placeholder="_ _ _ _"
                    disabled={step === 'verifying'}
                    className="flex-1 px-3 py-2 text-xs outline-none font-mono tracking-widest text-center"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRight: 'none', color: 'var(--text-primary)', borderRadius: '2px 0 0 2px' }}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={step === 'verifying'}
                    className="px-3 py-2 text-white text-xs flex items-center transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--purple)', borderRadius: '0 2px 2px 0' }}
                  >
                    {step === 'verifying'
                      ? <Loader2 size={14} className="animate-spin" />
                      : <CheckCircle size={14} />}
                  </button>
                </div>
                {errorMsg && <p className="text-xs mt-1 text-red-400">{errorMsg}</p>}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={handleResend}
                    className="text-xs text-purple-400 hover:underline"
                  >
                    Resend code
                  </button>
                  <span style={{ color: 'var(--text-muted)' }} className="text-xs">·</span>
                  <button
                    onClick={() => { setStep('idle'); setOtp(''); setErrorMsg(''); }}
                    className="text-xs hover:underline"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Change email
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Level Up TN. {t('footer.rights')}</p>
          <div className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            <Mail size={11} />
            <a href="mailto:contact@levelup.tn" className="hover:text-purple-400 transition-colors">contact@levelup.tn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

