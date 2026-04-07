'use client';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Headphones, Users, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TEAM_ICONS = [Headphones, Award, Zap, Users];

export default function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { value: '3+',   label: t('about.stat_years') },
    { value: '20+',  label: t('about.stat_brands') },
    { value: '500+', label: t('about.stat_happy')  },
  ];

  const team = [
    { role: t('about.team_role_engineer',  { defaultValue: 'Audio Engineer'     }), name: t('about.team_name_founder',   { defaultValue: 'Founder & Lead'      }) },
    { role: t('about.team_role_sound',     { defaultValue: 'Sound Engineer'     }), name: t('about.team_name_product',   { defaultValue: 'Product Expert'      }) },
    { role: t('about.team_role_gamer',     { defaultValue: 'Competitive Gamer'  }), name: t('about.team_name_gaming',    { defaultValue: 'Gaming Specialist'   }) },
    { role: t('about.team_role_musician',  { defaultValue: 'Musician'           }), name: t('about.team_name_music',     { defaultValue: 'Music & Stage'       }) },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center,rgba(124,58,255,0.1),transparent 70%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative text-center">
          <span className="tag mb-4 inline-flex">{t('about.tag')}</span>
          <h1 className="section-title">{t('about.title')}</h1>
          <div className="mt-8 max-w-2xl mx-auto space-y-4">
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('about.p1')}</p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('about.p2')}</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {stats.map(({ value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card-glass p-6 md:p-10 text-center">
              <p className="font-display text-5xl md:text-7xl text-gradient">{value}</p>
              <p className="mt-2 text-xs md:text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-12">
          <span className="tag mb-3 inline-flex">{t('about.team_tag')}</span>
          <h2 className="section-title">{t('about.team_title')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map(({ role, name }, i) => {
            const Icon = TEAM_ICONS[i];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-glass p-6 text-center group">
                <div className="w-12 h-12 mx-auto flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110" style={{ background: 'rgba(124,58,255,0.12)', borderRadius: '4px' }}>
                  <Icon size={22} className="text-purple-500" />
                </div>
                <p className="font-display text-lg tracking-wide" style={{ color: 'var(--text-primary)' }}>{name}</p>
                <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{role}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative p-12 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,255,0.1),rgba(88,0,235,0.05))', border: '1px solid rgba(124,58,255,0.2)', borderRadius: '4px' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
          <p className="font-display text-3xl md:text-5xl tracking-widest leading-tight" style={{ color: 'var(--text-primary)' }}>
            {t('about.quote')}<br /><span className="text-gradient">{t('about.quote_highlight')}</span>"
          </p>
          <p className="mt-6 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{t('about.quote_author')}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative overflow-hidden p-12 text-center"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,255,0.15),rgba(88,0,235,0.08))', border: '1px solid rgba(124,58,255,0.25)', borderRadius: '4px' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
          <span className="tag mb-4 inline-flex">{t('about.cta_tag')}</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-widest mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('about.cta_title')} <span className="text-gradient">{t('about.cta_highlight')}</span>
          </h2>
          <p className="text-sm max-w-md mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>{t('about.cta_sub')}</p>
          <Link href="/shop" className="btn-primary inline-flex text-sm px-10 py-4 gap-2">
            {t('about.cta_btn')} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
