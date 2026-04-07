'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Instagram, Twitter, Youtube, Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
export default function Footer() {
  const { resolvedTheme, setTheme } = useTheme();

  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const dark = resolvedTheme === 'dark';

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
                  width={180}   // adjust size here
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
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest mb-1 text-purple-500">{t('footer.newsletter_title')}</h4>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{t('footer.newsletter_sub')}</p>
            <div className="flex">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('footer.newsletter_placeholder')} className="flex-1 px-3 py-2 text-xs outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRight: 'none', color: 'var(--text-primary)', borderRadius: '2px 0 0 2px' }} />
              <button className="px-3 py-2 text-white text-xs flex items-center transition-all hover:opacity-90"
                style={{ background: 'var(--purple)', borderRadius: '0 2px 2px 0' }}>
                <ArrowRight size={14} />
              </button>
            </div>
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
