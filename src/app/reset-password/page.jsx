'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usersApi } from '@/lib/api';

function ResetPasswordContent() {
  const { t }   = useTranslation();
  const router  = useRouter();
  const params  = useSearchParams();
  const token   = params.get('token');
  const [form, setForm]       = useState({ password: '', confirm: '' });
  const [showP, setShowP]     = useState(false);
  const [showC, setShowC]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => { if (!token) setError(t('common.error')); }, [token]);

  const handleSubmit = async () => {
    if (!form.password) { setError(t('profile.err_new_required')); return; }
    if (form.password.length < 6) { setError(t('profile.err_min_length')); return; }
    if (form.password !== form.confirm) { setError(t('profile.err_mismatch')); return; }
    setError('');
    setLoading(true);
    try {
      await usersApi.resetPassword({ token, password: form.password });
      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (e) {
      setError(e.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative">
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
      <div className="card-glass p-8" style={{ borderRadius: '0 0 4px 4px' }}>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <CheckCircle size={48} className="mx-auto mb-4 text-purple-500" />
              <h1 className="font-display text-3xl tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>{t('reset_password.done_title')}</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('reset_password.done_sub')}</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-purple-400" />
                <h1 className="font-display text-3xl tracking-wider" style={{ color: 'var(--text-primary)' }}>{t('reset_password.title')}</h1>
              </div>
              <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>{t('reset_password.sub')}</p>
              {error && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={13} /> {error}
                </div>
              )}
              <div className="space-y-4">
                {[[t('reset_password.new_password'), 'password', showP, setShowP], [t('reset_password.confirm_password'), 'confirm', showC, setShowC]].map(([label, key, show, setShow]) => (
                  <div key={key}>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
                    <div className="relative">
                      <input type={show ? 'text' : 'password'} className="input-field pr-10"
                        placeholder="••••••••" value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                      <button type="button" onClick={() => setShow(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleSubmit} disabled={loading || !token}
                className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-6">
                {loading ? <div className="spinner !w-4 !h-4" /> : <Lock size={15} />}
                {loading ? t('reset_password.submitting') : t('reset_password.submit')}
              </button>
              <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                {t('reset_password.remember')} <Link href="/login" className="text-purple-400 hover:text-purple-300">{t('reset_password.sign_in')}</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.04]" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center,rgba(124,58,255,0.08),transparent 70%)' }} />
      <Suspense fallback={<div className="spinner" />}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
