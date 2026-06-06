'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const sections = t('privacy_policy.sections', { returnObjects: true });

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <span className="tag mb-4 inline-flex">{t('privacy_policy.tag')}</span>
          <h1 className="section-title">{t('privacy_policy.title')}</h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('privacy_policy.last_updated')}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t('privacy_policy.intro')}
        </p>

        {sections.map(({ title, body }) => (
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
          </div>
        ))}

        <p className="text-xs font-mono text-center pt-4" style={{ color: 'var(--text-muted)' }}>
          {t('privacy_policy.questions')}{' '}
          <Link href="/contact" className="text-purple-400 hover:underline">{t('privacy_policy.contact_link')}</Link>
          {' '}·{' '}{t('privacy_policy.see_also')}{' '}
          <Link href="/return-policy" className="text-purple-400 hover:underline">{t('privacy_policy.return_policy_link')}</Link>
        </p>
      </div>
    </div>
  );
}
