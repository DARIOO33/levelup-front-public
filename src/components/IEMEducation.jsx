'use client';
import { ArrowRight, CheckCircle, XCircle, Headphones, Award, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const EARPHONE_CONS = [
  'One-size-fits-all shell — poor seal',
  'Noise bleeds in from outside',
  'Driver far from eardrum — muddier detail',
  'Flat, congested soundstage',
  'Falls out during movement',
];

const IEM_PROS = [
  'Custom-fit ear tips create a perfect acoustic seal',
  'Passive noise isolation — no distractions',
  'Driver sits millimeters from your eardrum',
  'Wide, holographic 3D soundstage',
  'Stays in during workouts & commutes',
  'Multiple driver configs: dynamic, BA, planar, EST',
];

const STATS = [
  { value: '10×', label: 'More detail retrieval vs standard earphones' },
  { value: '30dB', label: 'Passive noise isolation on average' },
  { value: '4+', label: 'Driver technologies available' },
  { value: '#1', label: 'IEM store in Tunisia' },
];

// Lightweight InView — uses IntersectionObserver, zero JS animation overhead
function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`fade-in-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      ref={(el) => {
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
          { threshold: 0.1 }
        );
        obs.observe(el);
      }}
    >
      {children}
    </div>
  );
}

export default function IEMEducation() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.03]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,255,0.07), transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

        {/* Header */}
        <FadeUp className="text-center mb-20">
          <span className="tag mb-4 inline-flex"><Headphones size={10} /> IEM Education</span>
          <h2 className="section-title mb-4">
            WHY <span className="text-gradient">IN-EAR MONITORS</span>
            <br />CHANGE EVERYTHING
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Regular earphones are designed for convenience. IEMs are engineered for precision.
            Here's why audiophiles, musicians, and sound enthusiasts worldwide have made the switch.
          </p>
        </FadeUp>

        {/* Comparison table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          <FadeUp delay={0}>
            <div className="p-8 relative overflow-hidden h-full"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px' }}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5"
                style={{ background: 'radial-gradient(circle, #ef4444, transparent 70%)' }} />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '3px' }}>
                  <XCircle size={18} color="#f87171" />
                </div>
                <div>
                  <h3 className="font-display text-2xl tracking-wide" style={{ color: 'var(--text-primary)' }}>Standard Earphones</h3>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>What most people start with</p>
                </div>
              </div>
              <ul className="space-y-3">
                {EARPHONE_CONS.map((con, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <XCircle size={14} color="#f87171" className="flex-shrink-0 mt-0.5" />
                    {con}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-3 text-xs font-mono"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '2px', color: '#f87171' }}>
                Result: You hear music. But not the full picture.
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div className="p-8 relative overflow-hidden h-full"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,255,0.05), var(--bg-card))',
                border: '1px solid rgba(124,58,255,0.3)',
                borderTop: '2px solid var(--purple)',
                borderRadius: '4px',
                boxShadow: '0 0 32px rgba(124,58,255,0.07)',
              }}>
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(124,58,255,0.12), transparent 70%)' }} />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center"
                  style={{ background: 'rgba(124,58,255,0.15)', border: '1px solid rgba(124,58,255,0.3)', borderRadius: '3px' }}>
                  <CheckCircle size={18} color="#7c3aff" />
                </div>
                <div>
                  <h3 className="font-display text-2xl tracking-wide" style={{ color: 'var(--text-primary)' }}>In-Ear Monitors</h3>
                  <p className="text-xs font-mono" style={{ color: 'var(--purple)' }}>The audiophile's choice</p>
                </div>
              </div>
              <ul className="space-y-3">
                {IEM_PROS.map((pro, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle size={14} color="#7c3aff" className="flex-shrink-0 mt-0.5" />
                    {pro}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-3 text-xs font-mono"
                style={{ background: 'rgba(124,58,255,0.08)', border: '1px solid rgba(124,58,255,0.2)', borderRadius: '2px', color: 'var(--purple-light)' }}>
                Result: You don't just hear music — you're <em>inside</em> it.
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Stats row — CSS hover, no framer-motion whileHover */}
        <FadeUp delay={0} className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label }, i) => (
              <div
                key={i}
                className="card-glass text-center p-6"
                style={{ borderRadius: '4px' }}
              >
                <p className="font-display text-5xl tracking-wider text-gradient mb-2">{value}</p>
                <p className="text-xs font-mono leading-snug" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Pride section */}
        <FadeUp delay={0}>
          <div
            className="relative overflow-hidden p-10 md:p-14 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,255,0.12), rgba(88,0,235,0.06), rgba(124,58,255,0.12))',
              border: '1px solid rgba(124,58,255,0.25)',
              borderRadius: '4px',
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: '2px solid var(--purple)', borderLeft: '2px solid var(--purple)' }} />
            <div className="absolute top-0 right-0 w-12 h-12" style={{ borderTop: '2px solid var(--purple)', borderRight: '2px solid var(--purple)' }} />
            <div className="absolute bottom-0 left-0 w-12 h-12" style={{ borderBottom: '2px solid rgba(124,58,255,0.4)', borderLeft: '2px solid rgba(124,58,255,0.4)' }} />
            <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: '2px solid rgba(124,58,255,0.4)', borderRight: '2px solid rgba(124,58,255,0.4)' }} />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />

            <div className="flex items-center justify-center gap-2 mb-4">
              <Award size={18} style={{ color: 'var(--purple)' }} />
              <span className="tag">Tunisia's Best IEM Store</span>
              <Award size={18} style={{ color: 'var(--purple)' }} />
            </div>

            <h3 className="font-display mb-4"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '0.05em' }}>
              THE <span className="text-gradient">#1 SOURCE</span>
              <br />FOR IEMS IN TUNISIA
            </h3>

            <p className="text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Level Up TN was founded by audiophiles, for audiophiles. We curate only the finest
              IEMs and audio gear from the world's top brands — KZ, Moondrop, 7HZ, Simgot and more —
              and bring them directly to Tunisia with fast, reliable delivery.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              {[
                { icon: Zap, text: 'Fast nationwide delivery' },
                { icon: CheckCircle, text: 'Authentic products guaranteed' },
                { icon: TrendingUp, text: 'Best prices in Tunisia' },
                { icon: Headphones, text: 'Expert audio advice' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon size={14} style={{ color: 'var(--purple)' }} />
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{text}</span>
                </div>
              ))}
            </div>

            <Link href="/shop" className="btn-primary inline-flex text-sm px-10 py-4 gap-2">
              Shop Our Collection <ArrowRight size={16} />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
