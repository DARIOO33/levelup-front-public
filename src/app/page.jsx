'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Headphones, Zap, Shield, Award, ChevronDown, Star, Quote } from 'lucide-react';
import { productsApi, reviewsApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

const FEATURE_ICONS = [Headphones, Zap, Shield, Award];

const AnimatedNumber = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val}{suffix}</>;
};

export default function HomePage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const features = t('home.features', { returnObjects: true });

  useEffect(() => {
    productsApi.getAll().then(r => setProducts(r.data.products?.slice(0, 4) || [])).catch(() => { });
    reviewsApi.getApproved().then(r => setReviews(r.data.reviews?.slice(0, 6) || [])).catch(() => { });
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(124,58,255,0.15) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 right-0 h-px opacity-20 animate-scan"
            style={{ background: 'linear-gradient(90deg,transparent,var(--purple),transparent)' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="tag mb-6 inline-flex">{t('hero.badge')}</span>
            <h1 className="font-display leading-none tracking-widest">
              {/* Responsive sizes: smaller on French (longer text) via clamp */}
              <span className="block" style={{ fontSize: 'clamp(3rem, 10vw, 12rem)', color: 'var(--text-primary)' }}>
                {t('hero.headline1')}
              </span>
              <span className="block text-gradient -mt-2 md:-mt-6" style={{ fontSize: 'clamp(3rem, 10vw, 12rem)' }}>
                {t('hero.headline2')}
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('hero.sub')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link href="/shop" className="btn-primary text-sm px-8 py-4 flex items-center gap-2">
                {t('hero.cta_shop')} <ArrowRight size={16} />
              </Link>
              <a href="#featured" className="btn-outline text-sm px-8 py-4">{t('hero.cta_explore')}</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto">
            {[
              { num: products.length || 12, suf: '+', label: t('hero.stat_products') },
              { num: 4, suf: '', label: t('hero.stat_drivers') },
              { num: 200, suf: '+', label: t('hero.stat_reviews') },
            ].map(({ num, suf, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl md:text-4xl text-gradient"><AnimatedNumber target={num} suffix={suf} /></p>
                <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <a href="#featured" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce" style={{ color: 'var(--text-muted)' }}>
          <ChevronDown size={20} />
        </a>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="tag mb-3 inline-flex">{t('home.collection_tag')}</span>
            <h2 className="section-title">{t('shop.title')}</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{t('shop.subtitle')}</p>
          </div>
          <Link href="/shop" className="hidden sm:flex btn-outline text-sm items-center gap-2">
            {t('home.view_all')} <ArrowRight size={14} />
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <div className="text-6xl mb-4">🎧</div>
            <p className="font-mono text-sm">{t('home.loading_products')}</p>
          </div>
        )}
        <div className="mt-8 sm:hidden text-center">
          <Link href="/shop" className="btn-primary inline-flex text-sm items-center gap-2">
            {t('home.view_all')} <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── WHY LEVEL UP TN ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(180deg,transparent,rgba(124,58,255,0.05),transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="tag mb-3 inline-flex">{t('home.why_tag')}</span>
            <h2 className="section-title">{t('home.why_title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(features) && features.map(({ title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card-glass p-6 group">
                <div className="w-10 h-10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110" style={{ background: 'rgba(124,58,255,0.12)', borderRadius: '4px' }}>
                  {(() => { const Icon = FEATURE_ICONS[i]; return <Icon size={20} className="text-purple-500" />; })()}
                </div>
                <h3 className="font-display text-xl tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS MARQUEE ── */}
      {reviews.length > 0 && (
        <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 flex items-end justify-between">
            <div>
              <span className="tag mb-3 inline-flex">{t('home.testimonials_tag')}</span>
              <h2 className="section-title">{t('reviews.title')}</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{t('reviews.subtitle')}</p>
            </div>
            <Link href="/reviews" className="hidden sm:flex btn-outline text-sm items-center gap-2">
              {t('home.all_reviews')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(90deg,var(--bg-primary),transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(270deg,var(--bg-primary),transparent)' }} />
            <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
              {[...reviews, ...reviews].map((r, i) => (
                <div key={`${r._id}-${i}`} className="card-glass p-5 flex flex-col gap-3 flex-shrink-0" style={{ width: '280px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} size={12} fill={n <= r.rating ? '#7c3aff' : 'none'} stroke={n <= r.rating ? '#7c3aff' : 'var(--text-muted)'} strokeWidth={1.5} />
                      ))}
                    </div>
                    <span className="tag text-[9px]">{r.source}</span>
                  </div>
                  <Quote size={14} className="opacity-25" style={{ color: 'var(--purple)' }} />
                  <p className="text-xs leading-relaxed line-clamp-4" style={{ color: 'var(--text-secondary)' }}>{r.comment}</p>
                  <p className="text-[10px] font-mono font-semibold mt-auto" style={{ color: 'var(--purple)' }}>
                    {r.showName !== false && r.name ? r.name : t('home.anonymous')}
                    {r.productName && <span className="text-[9px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>· {r.productName}</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 sm:hidden text-center">
            <Link href="/reviews" className="btn-outline text-sm inline-flex items-center gap-2">
              {t('home.all_reviews')} <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="relative overflow-hidden p-12 text-center"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,255,0.15),rgba(88,0,235,0.08))', border: '1px solid rgba(124,58,255,0.25)', borderRadius: '4px' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
          <span className="tag mb-4 inline-flex">{t('home.cta_tag')}</span>
          <h2 className="font-display text-5xl md:text-7xl tracking-widest mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('home.cta_title')} <span className="text-gradient">{t('home.cta_highlight')}</span>
          </h2>
          <p className="text-sm max-w-md mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>{t('home.cta_sub')}</p>
          <Link href="/shop" className="btn-primary inline-flex text-sm px-10 py-4 gap-2">
            {t('home.cta_btn')} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
