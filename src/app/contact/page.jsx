'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ContactPage() {
  const { t } = useTranslation();
  const [form,    setForm]    = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(t('contact.fill_fields'));
      return;
    }
    setSending(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success(t('contact.success'));
    } catch (e) {
      toast.error(e.response?.data?.message || t('common.error'));
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    { icon: Mail,    label: t('contact.email_label'),    value: 'contact@levelup.tn',  href: 'mailto:contact@levelup.tn' },
    { icon: Phone,   label: t('contact.phone_label'),    value: '+216 12 345 678',      href: 'tel:+21612345678'          },
    { icon: MapPin,  label: t('contact.location_label'), value: 'Tunis, Tunisia',        href: null                        },
  ];

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center,rgba(124,58,255,0.08),transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <span className="tag mb-3 inline-flex">{t('contact.tag')}</span>
          <h1 className="section-title">{t('contact.title')}</h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>{t('contact.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left: contact info */}
          <div className="lg:col-span-2 space-y-6">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <motion.div key={label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="card-glass p-5 flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(124,58,255,0.12)', borderRadius: '4px' }}>
                  <Icon size={18} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  {href
                    ? <a href={href} className="text-sm font-medium hover:text-purple-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{value}</a>
                    : <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>}
                </div>
              </motion.div>
            ))}
            <div className="card-glass p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-purple-500 mb-3">{t('contact.response_time_tag')}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('contact.response_time_text')}</p>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="card-glass p-10 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
                  <CheckCircle size={40} className="text-purple-500" />
                  <div>
                    <p className="font-display text-3xl tracking-wide" style={{ color: 'var(--text-primary)' }}>{t('contact.success_title')}</p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{t('contact.success')}</p>
                  </div>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                    className="btn-outline text-sm">{t('contact.send_another')}</button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glass p-8 space-y-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('contact.name')}</label>
                    <input className="input-field" placeholder="John Doe" value={form.name} onChange={set('name')} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('contact.email')}</label>
                    <input type="email" className="input-field" placeholder="john@example.com" value={form.email} onChange={set('email')} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('contact.message')}</label>
                    <textarea className="input-field resize-none" rows={5} maxLength={2000}
                      placeholder={t('contact.subtitle')} value={form.message} onChange={set('message')} />
                  </div>
                  <button onClick={handleSubmit} disabled={sending}
                    className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                    {sending ? <div className="spinner !w-4 !h-4" /> : <Send size={15} />}
                    {sending ? t('contact.sending') : t('contact.send')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
