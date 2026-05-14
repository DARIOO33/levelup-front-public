'use client';
import { motion } from 'framer-motion';
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

export default function IEMEducation() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Bg decoration */}
      <div className="absolute inset-0 grid-bg opacity-[0.03]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,255,0.07), transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="tag mb-4 inline-flex"><Headphones size={10} /> IEM Education</span>
            <h2 className="section-title mb-4">
              WHY{' '}
              <span className="text-gradient">IN-EAR MONITORS</span>
              <br />CHANGE EVERYTHING
            </h2>
            <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Regular earphones are designed for convenience. IEMs are engineered for precision.
              Here's why audiophiles, musicians, and sound enthusiasts worldwide have made the switch.
            </p>
          </motion.div>
        </div>

        {/* Comparison table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">

          {/* Standard earphones */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="p-8 relative overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
            }}
          >
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
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <XCircle size={14} color="#f87171" className="flex-shrink-0 mt-0.5" />
                  {con}
                </motion.li>
              ))}
            </ul>

            <div className="mt-6 p-3 text-xs font-mono" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '2px', color: '#f87171' }}>
              Result: You hear music. But not the full picture.
            </div>
          </motion.div>

          {/* IEMs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,255,0.05), var(--bg-card))',
              border: '1px solid rgba(124,58,255,0.3)',
              borderTop: '2px solid var(--purple)',
              borderRadius: '4px',
              boxShadow: '0 0 40px rgba(124,58,255,0.08)',
            }}
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(124,58,255,0.15), transparent 70%)' }} />

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
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <CheckCircle size={14} color="#7c3aff" className="flex-shrink-0 mt-0.5" />
                  {pro}
                </motion.li>
              ))}
            </ul>

            <div className="mt-6 p-3 text-xs font-mono"
              style={{ background: 'rgba(124,58,255,0.08)', border: '1px solid rgba(124,58,255,0.2)', borderRadius: '2px', color: 'var(--purple-light)' }}>
              Result: You don't just hear music — you're <em>inside</em> it.
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6 group"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
              }}
              whileHover={{ y: -4, borderColor: 'rgba(124,58,255,0.4)', boxShadow: '0 12px 40px rgba(124,58,255,0.12)' }}
            >
              <p className="font-display text-5xl tracking-wider text-gradient mb-2">{value}</p>
              <p className="text-xs font-mono leading-snug" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tunisia's #1 IEM store — pride section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative overflow-hidden p-10 md:p-14 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,255,0.12), rgba(88,0,235,0.06), rgba(124,58,255,0.12))',
            border: '1px solid rgba(124,58,255,0.25)',
            borderRadius: '4px',
          }}
        >
          {/* Corner accent lines */}
          <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: '2px solid var(--purple)', borderLeft: '2px solid var(--purple)' }} />
          <div className="absolute top-0 right-0 w-12 h-12" style={{ borderTop: '2px solid var(--purple)', borderRight: '2px solid var(--purple)' }} />
          <div className="absolute bottom-0 left-0 w-12 h-12" style={{ borderBottom: '2px solid rgba(124,58,255,0.4)', borderLeft: '2px solid rgba(124,58,255,0.4)' }} />
          <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: '2px solid rgba(124,58,255,0.4)', borderRight: '2px solid rgba(124,58,255,0.4)' }} />

          {/* Top edge glow */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />

          <div className="flex items-center justify-center gap-2 mb-4">
            <Award size={18} style={{ color: 'var(--purple)' }} />
            <span className="tag">Tunisia's Best IEM Store</span>
            <Award size={18} style={{ color: 'var(--purple)' }} />
          </div>

          <h3 className="font-display mb-4"
            style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '0.05em' }}>
            THE{' '}
            <span className="text-gradient">#1 SOURCE</span>
            <br />FOR IEMS IN TUNISIA
          </h3>

          <p className="text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Level Up TN was founded by audiophiles, for audiophiles. We curate only the finest
            IEMs and audio gear from the world's top brands — KZ, Moondrop, 7HZ, Simgot and more —
            and bring them directly to Tunisia with fast, reliable delivery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            {[
              { icon: Zap, text: 'Fast nationwide delivery' },
              { icon: CheckCircle, text: 'Authentic products guaranteed' },
              { icon: TrendingUp, text: 'Best prices in Tunisia' },
              { icon: Headphones, text: 'Expert audio advice' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon size={14} style={{ color: 'var(--purple)' }} />
                <span className="text-xs font-mono">{text}</span>
              </div>
            ))}
          </div>

          <Link href="/shop" className="btn-primary inline-flex text-sm px-10 py-4 gap-2">
            Shop Our Collection <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
