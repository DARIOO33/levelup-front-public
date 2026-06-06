'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Headphones, Zap, Shield, Award, ChevronDown, Star, Quote } from 'lucide-react';
import { productsApi, reviewsApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import BrandTicker from '@/components/BrandTicker';
import IEMEducation from '@/components/IEMEducation';

const FEATURE_ICONS = [Headphones, Zap, Shield, Award];

// Lightweight number counter
const AnimatedNumber = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, inView]);

  return <span ref={ref}>{val}{suffix}</span>;
};

// Feature card — simple CSS hover, no 3D tilt, no framer-motion per-card
function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="feature-card p-7 group" style={{ borderRadius: '4px' }}>
      <div
        className="w-12 h-12 flex items-center justify-center mb-5"
        style={{
          background: 'rgba(124,58,255,0.1)',
          border: '1px solid rgba(124,58,255,0.25)',
          borderRadius: '3px',
        }}
      >
        <Icon size={22} style={{ color: 'var(--purple)' }} />
      </div>
      <h3 className="font-display text-2xl tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      <div className="mt-5 h-px w-0 group-hover:w-full" style={{ background: 'linear-gradient(90deg, var(--purple), transparent)', transition: 'width 0.4s ease' }} />
    </div>
  );
}

// IntersectionObserver-based fade-in — zero JS animation
function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`fade-in-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      ref={(el) => {
        if (!el) return;
        const obs = new IntersectionObserver(
          ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
          { threshold: 0.08 }
        );
        obs.observe(el);
      }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [totalReviewCount, setTotalReviewCount] = useState(0);

  const features = t('home.features', { returnObjects: true });

  useEffect(() => {
    productsApi.getAll()
      .then(r => {
        const all = r.data.products || [];
        setTotalProductCount(all.length);
        setProducts(all.filter(p => p.featured === true));
      })
      .catch(() => { });
    reviewsApi.getApproved()
      .then(r => {
        const all = r.data.reviews || [];
        setTotalReviewCount(all.length);
        setReviews(all.slice(0, 8));
      })
      .catch(() => { });
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />

        {/* Static glow orbs — CSS only, no JS animation loop */}
        <div
          className="absolute glow-orb"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(124,58,255,0.15) 0%, transparent 70%)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.18,
          }}
        />
        <div
          className="absolute glow-orb float-badge"
          style={{
            width: 350, height: 350,
            background: 'radial-gradient(circle, rgba(188,157,255,0.13) 0%, transparent 70%)',
            top: '20%', right: '12%',
            opacity: 0.15,
            animationDuration: '8s',
          }}
        />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 right-0 h-px opacity-10"
            style={{
              background: 'linear-gradient(90deg,transparent,var(--purple),transparent)',
              animation: 'scan 8s linear infinite',
            }}
          />
        </div>

        {/* Hero content — entry animations only (run once, not on scroll) */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <span className="tag mb-6 inline-flex">{t('hero.badge')}</span>
            </motion.div>

            <h1 className="font-display leading-none tracking-widest overflow-hidden">
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="block"
                style={{ fontSize: 'clamp(3rem, 10vw, 11rem)', color: 'var(--text-primary)' }}
              >
                {t('hero.headline1')}
              </motion.span>
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.32, ease: [0.23, 1, 0.32, 1] }}
                className="block text-gradient -mt-2 md:-mt-4"
                style={{ fontSize: 'clamp(3rem, 10vw, 11rem)' }}
              >
                {t('hero.headline2')}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.55 }}
              className="mt-6 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('hero.sub')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
            >
              <Link href="/shop" className="btn-primary text-sm px-10 py-4 flex items-center gap-2 magnetic">
                {t('hero.cta_shop')} <ArrowRight size={16} />
              </Link>
              <a href="#featured" className="btn-outline text-sm px-10 py-4 magnetic">
                {t('hero.cta_explore')}
              </a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.88 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto"
          >
            {[
              { num: totalProductCount, suf: '+', label: t('hero.stat_products') },
              { num: 4, suf: '', label: t('hero.stat_drivers') },
              { num: totalReviewCount, suf: '+', label: t('hero.stat_reviews') },
            ].map(({ num, suf, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl md:text-5xl text-gradient">
                  <AnimatedNumber target={num} suffix={suf} />
                </p>
                <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <a href="#brands" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce" style={{ color: 'var(--text-muted)' }}>
          <span className="text-[9px] font-mono uppercase tracking-widest">Scroll</span>
          <ChevronDown size={18} />
        </a>
      </section>

      {/* ── BRAND TICKER ── */}
      <div id="brands">
        <BrandTicker />
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <FadeUp className="flex items-end justify-between mb-14">
          <div>
            <span className="tag mb-3 inline-flex">{t('home.collection_tag')}</span>
            <h2 className="section-title">{t('shop.title')}</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{t('shop.subtitle')}</p>
          </div>
          <Link href="/shop" className="hidden sm:flex btn-outline text-sm items-center gap-2">
            {t('home.view_all')} <ArrowRight size={14} />
          </Link>
        </FadeUp>

        {products.length > 0 ? (
          <FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </FadeUp>
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

      <div className="section-divider" />

      {/* ── CATEGORY SHOWCASE ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-14">
          <span className="tag mb-3 inline-flex">Browse By</span>
          <h2 className="section-title">CATEGORIES</h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FadeUp>
            <Link href="/shop?cat=iems" className="cat-card block h-80 md:h-[420px]" style={{ borderRadius: '4px' }}>
              <div className="cat-bg absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 50%, #050508 100%)' }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-64 h-64 rounded-full border border-purple-500/30"
                    style={{ boxShadow: '0 0 60px rgba(124,58,255,0.3), inset 0 0 60px rgba(124,58,255,0.1)' }} />
                  <div className="absolute w-40 h-40 rounded-full border border-purple-400/40"
                    style={{ boxShadow: '0 0 40px rgba(188,157,255,0.4)' }} />
                  <div className="absolute w-16 h-16 rounded-full"
                    style={{ background: 'rgba(124,58,255,0.6)', boxShadow: '0 0 40px rgba(124,58,255,0.8)' }} />
                </div>
                <div className="absolute inset-0 grid-bg opacity-[0.05]" />
              </div>
              <div className="cat-content">
                <span className="tag mb-2 inline-flex">Premium Sound</span>
                <h3 className="font-display text-5xl tracking-widest text-white mb-1">IEMs</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>KZ · Moondrop · 7HZ · Simgot · and more</p>
                <div className="cat-cta">
                  <span className="inline-flex items-center gap-2 text-purple-400 text-sm font-mono mt-3">
                    Shop IEMs <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </FadeUp>

          <div className="flex flex-col gap-5">
            <FadeUp delay={80} className="flex-1">
              <Link href="/shop?cat=accessories" className="cat-card block h-48" style={{ borderRadius: '4px' }}>
                <div className="cat-bg absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #0a0a20 0%, #1a0a30 100%)' }}>
                  <div className="absolute inset-0 grid-bg opacity-[0.05]" />
                  <div className="absolute top-4 right-6 text-6xl opacity-10">🔌</div>
                </div>
                <div className="cat-content">
                  <h3 className="font-display text-4xl tracking-widest text-white mb-1">ACCESSORIES</h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Cables · Ear Tips · Bags · Cleaning</p>
                  <div className="cat-cta">
                    <span className="inline-flex items-center gap-2 text-purple-400 text-xs font-mono mt-2">
                      Browse Accessories <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeUp>

            <FadeUp delay={140} className="flex-1">
              <Link href="/shop?cat=accessories&sub=dac" className="cat-card block h-48" style={{ borderRadius: '4px' }}>
                <div className="cat-bg absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #05050f 0%, #0f0530 100%)' }}>
                  <div className="absolute inset-0 grid-bg opacity-[0.05]" />
                  <div className="absolute top-4 right-6 text-6xl opacity-10">🔊</div>
                </div>
                <div className="cat-content">
                  <h3 className="font-display text-4xl tracking-widest text-white mb-1">DAC · DONGLES</h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Desktop & portable DACs</p>
                  <div className="cat-cta">
                    <span className="inline-flex items-center gap-2 text-purple-400 text-xs font-mono mt-2">
                      Browse DACs <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── IEM EDUCATION ── */}
      <IEMEducation />

      <div className="section-divider" />

      {/* ── WHY LEVEL UP TN ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'linear-gradient(180deg,transparent,rgba(124,58,255,0.04),transparent)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-16">
            <span className="tag mb-3 inline-flex">{t('home.why_tag')}</span>
            <h2 className="section-title">{t('home.why_title')}</h2>
          </FadeUp>

          <FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {Array.isArray(features) && features.map(({ title, desc }, i) => (
                <FeatureCard key={title} icon={FEATURE_ICONS[i]} title={title} desc={desc} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── REVIEWS MARQUEE — pure CSS, no framer-motion per card ── */}
      {reviews.length > 0 && (
        <section className="py-24 overflow-hidden">
          <FadeUp className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 flex items-end justify-between">
            <div>
              <span className="tag mb-3 inline-flex">{t('home.testimonials_tag')}</span>
              <h2 className="section-title">{t('reviews.title')}</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{t('reviews.subtitle')}</p>
            </div>
            <Link href="/reviews" className="hidden sm:flex btn-outline text-sm items-center gap-2">
              {t('home.all_reviews')} <ArrowRight size={14} />
            </Link>
          </FadeUp>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(90deg,var(--bg-primary),transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(270deg,var(--bg-primary),transparent)' }} />

            <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
              {[...reviews, ...reviews].map((r, i) => (
                <div
                  key={`${r._id}-${i}`}
                  className="card-glass p-6 flex flex-col gap-3 flex-shrink-0"
                  style={{ width: '300px', borderRadius: '4px' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} size={13}
                          fill={n <= r.rating ? '#7c3aff' : 'none'}
                          stroke={n <= r.rating ? '#7c3aff' : 'var(--text-muted)'}
                          strokeWidth={1.5} />
                      ))}
                    </div>
                    <span className="tag text-[9px]">{r.source}</span>
                  </div>
                  <Quote size={14} className="opacity-20" style={{ color: 'var(--purple)' }} />
                  <p className="text-xs leading-relaxed line-clamp-4" style={{ color: 'var(--text-secondary)' }}>
                    {r.comment}
                  </p>
                  <p className="text-[10px] font-mono font-semibold mt-auto" style={{ color: 'var(--purple)' }}>
                    {r.showName !== false && r.name ? r.name : t('home.anonymous')}
                    {r.productName && (
                      <span className="text-[9px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                        · {r.productName}
                      </span>
                    )}
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

      {/* ── CTA BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <FadeUp>
          <div
            className="relative overflow-hidden p-16 text-center"
            style={{
              background: 'linear-gradient(135deg,rgba(124,58,255,0.15),rgba(88,0,235,0.08))',
              border: '1px solid rgba(124,58,255,0.25)',
              borderRadius: '4px',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(124,58,255,0.4),transparent)' }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,255,0.07) 0%, transparent 70%)' }} />

            <span className="tag mb-5 inline-flex">{t('home.cta_tag')}</span>
            <h2 className="font-display tracking-widest mb-5"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', color: 'var(--text-primary)', lineHeight: 1 }}>
              {t('home.cta_title')}{' '}
              <span className="text-gradient">{t('home.cta_highlight')}</span>
            </h2>
            <p className="text-sm max-w-md mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
              {t('home.cta_sub')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="btn-primary inline-flex text-sm px-12 py-5 gap-2">
                {t('home.cta_btn')} <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="btn-outline text-sm px-8 py-5">
                Learn About Us
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
