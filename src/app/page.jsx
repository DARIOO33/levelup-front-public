'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Headphones, Zap, Shield, Award, ChevronDown, Star, Quote, TrendingUp } from 'lucide-react';
import { productsApi, reviewsApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import AudioWave from '@/components/AudioWave';
import BrandTicker from '@/components/BrandTicker';
import IEMEducation from '@/components/IEMEducation';

const FEATURE_ICONS = [Headphones, Zap, Shield, Award];

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

// 3D tilt feature card
function FeatureCard({ icon: Icon, title, desc, delay }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -10;
    const ry = ((x - cx) / cx) * 10;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;
    // move spotlight
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="feature-card spotlight-container p-7 group"
      style={{ borderRadius: '4px' }}
    >
      <div className="spotlight" style={{
        background: 'radial-gradient(300px circle at var(--x, 50%) var(--y, 50%), rgba(124,58,255,0.08), transparent 60%)'
      }} />

      <div
        className="w-12 h-12 flex items-center justify-center mb-5 relative"
        style={{
          background: 'rgba(124,58,255,0.1)',
          border: '1px solid rgba(124,58,255,0.25)',
          borderRadius: '3px',
        }}
      >
        <Icon size={22} style={{ color: 'var(--purple)' }} />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'rgba(124,58,255,0.15)', borderRadius: '3px', filter: 'blur(8px)' }} />
      </div>

      <h3 className="font-display text-2xl tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>

      <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
        style={{ background: 'linear-gradient(90deg, var(--purple), transparent)' }} />
    </motion.div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const waveY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

  const features = t('home.features', { returnObjects: true });

  useEffect(() => {
    productsApi
      .getAll()
      .then(r => setProducts(r.data.products?.filter(p => p.featured === true) || []))
      .catch(() => {});
    reviewsApi.getApproved().then(r => setReviews(r.data.reviews?.slice(0, 8) || [])).catch(() => {});
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
        {/* Grid bg */}
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />

        {/* Animated glow orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute glow-orb"
          style={{
            width: 700, height: 700,
            background: 'radial-gradient(circle, rgba(124,58,255,0.18) 0%, transparent 70%)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute glow-orb"
          style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(188,157,255,0.15) 0%, transparent 70%)',
            top: '20%', right: '15%',
          }}
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute glow-orb"
          style={{
            width: 350, height: 350,
            background: 'radial-gradient(circle, rgba(124,58,255,0.12) 0%, transparent 70%)',
            bottom: '15%', left: '10%',
          }}
        />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 right-0 h-px opacity-15 animate-scan"
            style={{ background: 'linear-gradient(90deg,transparent,var(--purple),transparent)' }} />
        </div>

        {/* Waveform bottom */}
        <motion.div
          style={{ y: waveY }}
          className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20"
        >
          <AudioWave bars={80} height={120} />
        </motion.div>

        {/* Hero content */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="tag mb-6 inline-flex">{t('hero.badge')}</span>
            </motion.div>

            <h1 className="font-display leading-none tracking-widest overflow-hidden">
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="block"
                style={{ fontSize: 'clamp(3rem, 10vw, 11rem)', color: 'var(--text-primary)' }}
              >
                {t('hero.headline1')}
              </motion.span>
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="block text-gradient -mt-2 md:-mt-4 glitch"
                data-text={t('hero.headline2')}
                style={{ fontSize: 'clamp(3rem, 10vw, 11rem)' }}
              >
                {t('hero.headline2')}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('hero.sub')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto"
          >
            {[
              { num: products.length || 12, suf: '+', label: t('hero.stat_products') },
              { num: 4, suf: '', label: t('hero.stat_drivers') },
              { num: 10, suf: '+', label: t('hero.stat_reviews') },
            ].map(({ num, suf, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl md:text-5xl text-gradient">
                  <AnimatedNumber target={num} suffix={suf} />
                </p>
                <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

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
        <div className="flex items-end justify-between mb-14">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {products.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
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

      {/* ── SECTION DIVIDER ── */}
      <div className="section-divider" />

      {/* ── CATEGORY SHOWCASE ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="tag mb-3 inline-flex">Browse By</span>
          <h2 className="section-title">CATEGORIES</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* IEMs big card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link href="/shop?cat=iems" className="cat-card block h-80 md:h-[420px]" style={{ borderRadius: '4px' }}>
              <div className="cat-bg absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 50%, #050508 100%)' }}>
                {/* abstract IEM art */}
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
          </motion.div>

          {/* Accessories + DAC stacked */}
          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1"
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1"
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── IEM EDUCATION ── */}
      <IEMEducation />

      {/* ── SECTION DIVIDER ── */}
      <div className="section-divider" />

      {/* ── WHY LEVEL UP TN ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40"
          style={{ background: 'linear-gradient(180deg,transparent,rgba(124,58,255,0.04),transparent)' }} />

        {/* Decorative waveform */}
        <div className="absolute bottom-0 left-0 right-0 opacity-5 pointer-events-none">
          <AudioWave bars={120} height={60} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="tag mb-3 inline-flex">{t('home.why_tag')}</span>
            <h2 className="section-title">{t('home.why_title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {Array.isArray(features) && features.map(({ title, desc }, i) => (
              <FeatureCard
                key={title}
                icon={FEATURE_ICONS[i]}
                title={title}
                desc={desc}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION DIVIDER ── */}
      <div className="section-divider" />

      {/* ── REVIEWS MARQUEE ── */}
      {reviews.length > 0 && (
        <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 flex items-end justify-between">
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
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(90deg,var(--bg-primary),transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(270deg,var(--bg-primary),transparent)' }} />

            <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
              {[...reviews, ...reviews].map((r, i) => (
                <motion.div
                  key={`${r._id}-${i}`}
                  className="card-glass p-6 flex flex-col gap-3 flex-shrink-0"
                  style={{ width: '300px', borderRadius: '4px' }}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}
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
                </motion.div>
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="relative overflow-hidden p-16 text-center"
          style={{
            background: 'linear-gradient(135deg,rgba(124,58,255,0.15),rgba(88,0,235,0.08))',
            border: '1px solid rgba(124,58,255,0.25)',
            borderRadius: '4px',
          }}
        >
          {/* top edge glow */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
          {/* bottom edge glow */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(124,58,255,0.4),transparent)' }} />

          {/* ambient orb */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,255,0.08) 0%, transparent 70%)' }} />

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

          {/* Waveform decoration */}
          <div className="absolute bottom-0 left-0 right-0 opacity-15 pointer-events-none">
            <AudioWave bars={60} height={40} />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
