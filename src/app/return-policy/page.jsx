'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  RotateCcw,
  PackageX,
  ChevronDown,
  AlertCircle,
  Truck,
  Clock,
  Heart,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const CONDITION_STYLES = [
  { icon: ShieldCheck, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  { icon: RotateCcw, color: '#7c3aff', bg: 'rgba(124,58,255,0.08)', border: 'rgba(124,58,255,0.25)' },
  { icon: PackageX, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
];

const NOTE_ICONS = [AlertCircle, Truck, Clock];

export default function ReturnPolicyPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = useTranslation();

  const conditions = t('return_policy.conditions', { returnObjects: true });
  const notes = t('return_policy.notes', { returnObjects: true });
  const faqs = t('return_policy.faqs', { returnObjects: true });

  return (
    <div className="min-h-screen pt-16">

      {/* Hero */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,255,0.1), transparent 70%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative text-center">
          <span className="tag mb-4 inline-flex">{t('return_policy.hero_tag')}</span>
          <h1 className="section-title">{t('return_policy.hero_title')}</h1>
          <p className="mt-4 text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('return_policy.hero_sub')}
          </p>
        </div>
      </section>

      {/* Conditions */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="tag mb-3 inline-flex">{t('return_policy.conditions_tag')}</span>
          <h2 className="section-title">{t('return_policy.conditions_title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {conditions.map(({ tag, title, items, note }, i) => {
            const { icon: Icon, color, bg, border } = CONDITION_STYLES[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glass p-7 flex flex-col gap-4"
                style={{ borderColor: border }}
              >
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>{tag}</p>
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-4"
                    style={{ background: bg, borderRadius: '4px' }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3 className="font-display text-2xl tracking-wide" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                </div>
                <ul className="space-y-2 flex-1">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div
                  className="mt-2 px-4 py-2.5 text-xs font-mono rounded"
                  style={{ background: bg, border: `1px solid ${border}`, color }}
                >
                  {note}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Important Notes */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-10">
          <span className="tag mb-3 inline-flex">{t('return_policy.notes_tag')}</span>
          <h2 className="section-title">{t('return_policy.notes_title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {notes.map(({ title, text }, i) => {
            const Icon = NOTE_ICONS[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glass p-6 flex gap-4"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(124,58,255,0.1)', borderRadius: '4px' }}
                >
                  <Icon size={18} className="text-purple-500" />
                </div>
                <div>
                  <p className="font-display text-lg tracking-wide mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,255,0.12), rgba(88,0,235,0.06))',
            border: '1px solid rgba(124,58,255,0.22)',
            borderRadius: '4px',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
          <div className="w-14 h-14 mx-auto flex items-center justify-center mb-6" style={{ background: 'rgba(124,58,255,0.12)', borderRadius: '4px' }}>
            <Heart size={24} className="text-purple-500" />
          </div>
          <span className="tag mb-4 inline-flex">{t('return_policy.trust_tag')}</span>
          <h2 className="font-display text-4xl md:text-5xl tracking-widest mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('return_policy.trust_title')} <span className="text-gradient">{t('return_policy.trust_highlight')}</span>
          </h2>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            {t('return_policy.trust_text')}
          </p>
          <Link href="/contact" className="btn-primary inline-flex text-sm px-8 py-3.5 gap-2">
            {t('return_policy.trust_btn')} <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-10">
          <span className="tag mb-3 inline-flex">{t('return_policy.faq_tag')}</span>
          <h2 className="section-title">{t('return_policy.faq_title')}</h2>
        </div>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="card-glass overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{q}</span>
                <ChevronDown
                  size={16}
                  className="flex-shrink-0 text-purple-500 transition-transform duration-300"
                  style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-5">
                      <div className="pt-1 border-t" style={{ borderColor: 'rgba(124,58,255,0.15)' }}>
                        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
