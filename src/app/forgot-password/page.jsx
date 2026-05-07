'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usersApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) { setError(t('common.error')); return; }
    setError('');
    setLoading(true);
    try {
      await usersApi.forgotPassword({ email: email.trim() });
      setSent(true);
    } catch (e) {
      setError(e.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.04]" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center,rgba(124,58,255,0.08),transparent 70%)' }} />
      <div className="w-full max-w-md relative">
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
        <div className="card-glass p-8" style={{ borderRadius: '0 0 4px 4px' }}>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono mb-6 hover:text-purple-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={13} /> {t('forgot_password.back')}
          </Link>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
                <CheckCircle size={48} className="mx-auto mb-4 text-purple-500" />
                <h1 className="font-display text-3xl tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>{t('forgot_password.sent_title')}</h1>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t('forgot_password.sent_sub')}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('forgot_password.sent_hint')}</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-purple-400" />
                  <h1 className="font-display text-3xl tracking-wider" style={{ color: 'var(--text-primary)' }}>{t('forgot_password.title')}</h1>
                </div>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>{t('forgot_password.sub')}</p>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('forgot_password.email')}</label>
                <input type="email" className="input-field mb-2" placeholder="john@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                {error && <p className="text-xs text-red-400 mb-4">{error}</p>}
                <button onClick={handleSubmit} disabled={loading}
                  className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-4">
                  {loading ? <div className="spinner !w-4 !h-4" /> : <Mail size={15} />}
                  {loading ? t('forgot_password.sending') : t('forgot_password.send')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
