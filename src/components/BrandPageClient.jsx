'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronUp, Star, Check } from 'lucide-react';
import { productsApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`fade-in-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      ref={(el) => {
        if (!el) return;
        const obs = new IntersectionObserver(
          ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
          { threshold: 0.06 }
        );
        obs.observe(el);
      }}
    >
      {children}
    </div>
  );
}

function FAQ({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="border"
          style={{ borderColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            style={{ background: open === i ? 'rgba(124,58,255,0.06)' : 'var(--bg-card)' }}
          >
            <span className="font-display tracking-wide text-base" style={{ color: 'var(--text-primary)' }}>
              {item.q}
            </span>
            {open === i
              ? <ChevronUp size={16} style={{ color: 'var(--purple)', flexShrink: 0 }} />
              : <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            }
          </button>
          {open === i && (
            <div className="px-5 pb-5 pt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function BrandPageClient({ brand }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    slug,
    name,
    tagline,
    description,
    highlights,
    topModels,
    comparison,
    faq,
    accentColor = '#7c3aff',
    heroGradient = 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 50%, #050508 100%)',
  } = brand;

  useEffect(() => {
    productsApi.getAll()
      .then((r) => {
        const all = r.data.products || [];
        console.log(all)
        const matched = all.filter(
          (p) => p.name?.toLowerCase().includes(name.toLowerCase())
        );
        console.log(matched);

        setProducts(matched);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [name]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen pt-16">

        {/* ── HERO ── */}
        <section
          className="relative py-28 overflow-hidden flex items-center"
          style={{ background: heroGradient }}
        >
          <div className="absolute inset-0 grid-bg opacity-[0.05]" />
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at center top, ${accentColor}22, transparent 65%)` }}
          />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <span className="tag mb-5 inline-flex">Official Brand Page</span>
            <h1
              className="font-display tracking-widest leading-none text-white"
              style={{ fontSize: 'clamp(4rem, 14vw, 12rem)' }}
            >
              {name}
            </h1>
            <p className="mt-4 text-base md:text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {tagline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <a
                href="#products"
                className="btn-primary text-sm px-10 py-4 flex items-center gap-2"
              >
                Shop {name} <ArrowRight size={15} />
              </a>
              <a href="#about" className="btn-outline text-sm px-8 py-4">
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* ── BRAND OVERVIEW ── */}
        <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <FadeUp className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="tag mb-4 inline-flex">About {name}</span>
              <h2 className="section-title mb-6">{name} IN TUNISIA</h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {description.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                  }}
                >
                  <div
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: `${accentColor}18`, borderRadius: '3px' }}
                  >
                    <Check size={14} style={{ color: accentColor }} />
                  </div>
                  <div>
                    <p className="font-display tracking-wide text-base" style={{ color: 'var(--text-primary)' }}>
                      {h.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {h.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        <div className="section-divider" />

        {/* ── PRODUCTS ── */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <FadeUp className="text-center mb-14">
            <span className="tag mb-3 inline-flex">{name} Collection</span>
            <h2 className="section-title">SHOP {name.toUpperCase()} IN TUNISIA</h2>
            <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              All {name} products available for delivery across Tunisia. Free shipping included.
            </p>
          </FadeUp>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="spinner" />
            </div>
          ) : products.length > 0 ? (
            <FadeUp>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </FadeUp>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4 opacity-30">🎧</div>
              <p className="font-mono text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                No {name} products listed yet — check the full shop.
              </p>
              <Link href={`/shop?brand=${slug}`} className="btn-outline text-sm inline-flex items-center gap-2">
                Browse {name} <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-10 text-center">
              <Link href={`/shop?brand=${slug}`} className="btn-outline text-sm inline-flex items-center gap-2">
                View all {name} products <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </section>

        <div className="section-divider" />

        {/* ── TOP MODELS ── */}
        {topModels?.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <FadeUp className="text-center mb-12">
              <span className="tag mb-3 inline-flex">Best Sellers</span>
              <h2 className="section-title">TOP {name.toUpperCase()} MODELS</h2>
            </FadeUp>
            <FadeUp>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {topModels.map((model, i) => (
                  <div
                    key={i}
                    className="p-6 flex flex-col gap-3"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                    }}
                  >
                    {model.badge && (
                      <span className="tag text-[10px] self-start">{model.badge}</span>
                    )}
                    <h3 className="font-display text-2xl tracking-wide" style={{ color: 'var(--text-primary)' }}>
                      {model.name}
                    </h3>
                    <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
                      {model.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {model.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono px-2 py-0.5 border"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {model.price && (
                      <p className="font-mono text-sm font-semibold mt-1" style={{ color: accentColor }}>
                        From {model.price} TND
                      </p>
                    )}
                    <Link
                      href={`/shop?brand=${slug}`}
                      className="btn-primary text-xs px-4 py-2 mt-1 inline-flex items-center gap-1.5 self-start"
                    >
                      Shop Now <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </FadeUp>
          </section>
        )}

        {/* ── COMPARISON TABLE ── */}
        {comparison && (
          <>
            <div className="section-divider" />
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
              <FadeUp className="text-center mb-12">
                <span className="tag mb-3 inline-flex">Compare</span>
                <h2 className="section-title">{name.toUpperCase()} MODEL COMPARISON</h2>
              </FadeUp>
              <FadeUp>
                <div
                  className="overflow-x-auto"
                  style={{ border: '1px solid var(--border)', borderRadius: '4px' }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                        {comparison.headers.map((h, i) => (
                          <th
                            key={i}
                            className="px-5 py-3 text-left font-display tracking-wider text-xs"
                            style={{ color: i === 0 ? 'var(--text-muted)' : accentColor, whiteSpace: 'nowrap' }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.rows.map((row, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom: i < comparison.rows.length - 1 ? '1px solid var(--border)' : 'none',
                            background: i % 2 === 0 ? 'var(--bg-card)' : 'transparent',
                          }}
                        >
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="px-5 py-3 font-mono"
                              style={{
                                color: j === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontSize: j === 0 ? '12px' : '11px',
                                fontWeight: j === 0 ? 600 : 400,
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeUp>
            </section>
          </>
        )}

        <div className="section-divider" />

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <FadeUp className="text-center mb-12">
            <span className="tag mb-3 inline-flex">FAQ</span>
            <h2 className="section-title">COMMON QUESTIONS</h2>
          </FadeUp>
          <FadeUp>
            <FAQ items={faq} />
          </FadeUp>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
          <FadeUp>
            <div
              className="relative overflow-hidden p-14 text-center"
              style={{
                background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}0a)`,
                border: `1px solid ${accentColor}40`,
                borderRadius: '4px',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, ${accentColor}10 0%, transparent 70%)` }}
              />
              <span className="tag mb-5 inline-flex">Available in Tunisia</span>
              <h2
                className="font-display tracking-widest mb-4"
                style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', color: 'var(--text-primary)', lineHeight: 1 }}
              >
                GET YOUR{' '}
                <span className="text-gradient">{name.toUpperCase()}</span>
              </h2>
              <p className="text-sm max-w-sm mx-auto mb-9" style={{ color: 'var(--text-secondary)' }}>
                Free shipping across Tunisia. Guaranteed authentic products. Fast 24–48h delivery.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={`/shop?brand=${slug}`} className="btn-primary text-sm px-10 py-4 inline-flex items-center gap-2">
                  Shop {name} Now <ArrowRight size={15} />
                </Link>
                <Link href="/contact" className="btn-outline text-sm px-8 py-4">
                  Ask a Question
                </Link>
              </div>
            </div>
          </FadeUp>
        </section>

      </div>
    </>
  );
}
