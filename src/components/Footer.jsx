'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Instagram, Twitter, Youtube, Mail, ArrowRight, CheckCircle, Loader2, Headphones } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { subscriberApi } from '@/lib/api';

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const dark = resolvedTheme === 'dark';

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) { setErrorMsg('Please enter a valid email.'); return; }
    setErrorMsg(''); setStep('loading');
    try { await subscriberApi.subscribe(email); setStep('otp'); }
    catch (err) { setErrorMsg(err?.response?.data?.message || 'Something went wrong.'); setStep('idle'); }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) { setErrorMsg('Enter the 4-digit code.'); return; }
    setErrorMsg(''); setStep('verifying');
    try { await subscriberApi.verifyOtp(email, otp); setStep('success'); }
    catch (err) { setErrorMsg(err?.response?.data?.message || 'Invalid or expired OTP.'); setStep('otp'); }
  };

  const handleResend = async () => {
    setOtp(''); setErrorMsg(''); setStep('loading');
    try { await subscriberApi.subscribe(email); setStep('otp'); }
    catch (err) { setErrorMsg(err?.response?.data?.message || 'Could not resend OTP.'); setStep('otp'); }
  };

  return (
    <footer className="relative mt-20 overflow-hidden" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      {/* Top glow line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />



      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center flex-shrink-0 mb-4">
              <Image
                src={!dark ? `/logo.png` : `/logodark.png`}
                alt="Level Up Logo"
                width={160}
                height={36}
                priority
                className="object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 flex items-center justify-center border transition-all duration-300 hover:border-purple-500 hover:text-purple-400 hover:-translate-y-0.5"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest mb-5 text-purple-500">
              {t('footer.shop')}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/shop?cat=iems', label: 'IEMs' },
                { href: '/shop', label: 'New Arrivals' },
                { href: '/shop', label: 'Best Sellers' },
                { href: '/shop?cat=accessories', label: 'Accessories' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href}
                    className="text-sm transition-all duration-200 hover:text-purple-400 hover:translate-x-1 inline-block"
                    style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest mt-7 mb-4 text-purple-500">
              Brands
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/brands/kz', label: 'KZ' },
                // { href: '/brands/moondrop', label: 'Moondrop' },
                { href: '/brands/7hz', label: '7Hz' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href}
                    className="text-sm transition-all duration-200 hover:text-purple-400 hover:translate-x-1 inline-block"
                    style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest mb-5 text-purple-500">
              {t('footer.company')}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: t('footer.about') },
                { href: '/contact', label: t('footer.contact') },
                { href: '#', label: t('footer.privacy') },
                { href: '#', label: t('footer.terms') },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href}
                    className="text-sm transition-all duration-200 hover:text-purple-400 hover:translate-x-1 inline-block"
                    style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest mb-1 text-purple-500">
              {t('footer.newsletter_title')}
            </h4>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              {t('footer.newsletter_sub')}
            </p>

            {step === 'success' && (
              <div className="flex items-center gap-2 text-green-500 text-xs font-mono py-2">
                <CheckCircle size={14} />
                <span>You're subscribed! 🎧</span>
              </div>
            )}

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
                    className="flex-1 px-3 py-2.5 text-xs outline-none"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRight: 'none',
                      color: 'var(--text-primary)',
                      borderRadius: '2px 0 0 2px',
                      transition: 'border-color 0.2s',
                    }}
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={step === 'loading'}
                    className="px-3 py-2.5 text-white text-xs flex items-center transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--purple)', borderRadius: '0 2px 2px 0' }}
                  >
                    {step === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                  </button>
                </div>
                {errorMsg && <p className="text-xs mt-1 text-red-400">{errorMsg}</p>}
              </>
            )}

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
                    className="flex-1 px-3 py-2.5 text-xs outline-none font-mono tracking-widest text-center"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRight: 'none',
                      color: 'var(--text-primary)',
                      borderRadius: '2px 0 0 2px',
                    }}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={step === 'verifying'}
                    className="px-3 py-2.5 text-white text-xs flex items-center transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--purple)', borderRadius: '0 2px 2px 0' }}
                  >
                    {step === 'verifying' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  </button>
                </div>
                {errorMsg && <p className="text-xs mt-1 text-red-400">{errorMsg}</p>}
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={handleResend} className="text-xs text-purple-400 hover:underline">Resend code</button>
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

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Level Up TN. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              <Headphones size={11} style={{ color: 'var(--purple)' }} />
              <span>Tunisia's Premier IEM Store</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              <Mail size={11} />
              <a href="mailto:contact@levelup.tn" className="hover:text-purple-400 transition-colors">
                contact@levelup.tn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
