'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function TermsPage() {
  const { t } = useTranslation();
  const sections = t('terms.sections', { returnObjects: true });

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <span className="tag mb-4 inline-flex">{t('terms.tag')}</span>
          <h1 className="section-title">{t('terms.title')}</h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('terms.last_updated')}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t('terms.intro')}
        </p>

        {sections.map(({ title, body, link }) => (
          <div key={title} className="card-glass p-6">
            <h2 className="font-display text-xl tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            <ul className="space-y-2">
              {body.map((line, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--purple)' }} />
                  {line}
                </li>
              ))}
            </ul>
            {link && (
              <Link href={link.href} className="inline-flex items-center gap-1.5 mt-4 text-xs font-mono text-purple-400 hover:underline">
                {link.label} →
              </Link>
            )}
          </div>
        ))}

        <p className="text-xs font-mono text-center pt-4" style={{ color: 'var(--text-muted)' }}>
          {t('terms.questions')}{' '}
          <Link href="/contact" className="text-purple-400 hover:underline">{t('terms.contact_link')}</Link>
          {' '}·{' '}{t('terms.see_also')}{' '}
          <Link href="/privacy-policy" className="text-purple-400 hover:underline">{t('terms.privacy_policy_link')}</Link>
        </p>
      </div>
    </div>
  );
}
