'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { reviewsApi } from '@/lib/api';

const SOURCES = ['all', 'website', 'instagram', 'tiktok', 'facebook', 'manual'];
const SOURCE_LABELS = { all: 'All', website: 'Website', instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook', manual: 'In-store' };

function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={size}
          fill={n <= rating ? '#7c3aff' : 'none'}
          stroke={n <= rating ? '#7c3aff' : 'var(--text-muted)'}
          strokeWidth={1.5} />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.06, duration: 0.4 }}
      className="card-glass p-6 flex flex-col gap-4 h-full"
    >
      <div className="flex items-start justify-between gap-2">
        <StarRow rating={review.rating} />
        <span className="tag text-[9px] uppercase tracking-wider flex-shrink-0">
          {SOURCE_LABELS[review.source] || review.source}
        </span>
      </div>

      <div className="flex-1">
        <Quote size={16} className="mb-2 opacity-30" style={{ color: 'var(--purple)' }} />
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {review.comment}
        </p>
      </div>

      <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs font-mono font-semibold" style={{ color: 'var(--purple)' }}>
          {review.showName !== false && review.name ? review.name : 'Anonymous'}
        </p>
        {review.productName && (
          <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {review.productName}
          </p>
        )}
        <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </motion.div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [sort, setSort]       = useState('recent'); // 'recent' | 'top'

  useEffect(() => {
    reviewsApi.getApproved()
      .then(r => setReviews(r.data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? reviews : reviews.filter(r => r.source === filter);
    if (sort === 'top') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [reviews, filter, sort]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';
  const dist = [5, 4, 3, 2, 1].map(n => ({ n, count: reviews.filter(r => r.rating === n).length }));

  return (
    <div className="min-h-screen pt-16">

      {/* Hero */}
      <div className="relative py-20 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center top,rgba(124,58,255,0.12),transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <span className="tag mb-3 inline-flex">Verified Reviews</span>
          <h1 className="section-title">WHAT THEY SAY</h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            Real customers. Real impressions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Stats bar */}
        {!loading && reviews.length > 0 && (
          <div className="card-glass p-6 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Average */}
            <div className="flex items-center gap-5">
              <div className="text-center">
                <p className="font-display text-6xl tracking-widest text-gradient">{avg}</p>
                <StarRow rating={Math.round(Number(avg))} size={18} />
                <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {/* Distribution */}
            <div className="space-y-1.5">
              {dist.map(({ n, count }) => (
                <div key={n} className="flex items-center gap-2 text-xs">
                  <span className="font-mono w-4 text-right" style={{ color: 'var(--text-muted)' }}>{n}</span>
                  <Star size={10} fill="#7c3aff" stroke="#7c3aff" />
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full rounded-full" style={{
                      width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%',
                      background: 'var(--purple)',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  <span className="font-mono w-4" style={{ color: 'var(--text-muted)' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="flex flex-wrap gap-2 flex-1">
            {SOURCES.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="text-xs font-mono px-3 py-1.5 border transition-all"
                style={{
                  borderRadius: '2px',
                  borderColor: filter === s ? 'var(--purple)' : 'var(--border)',
                  color:       filter === s ? 'var(--purple)' : 'var(--text-muted)',
                  background:  filter === s ? 'rgba(124,58,255,0.08)' : 'transparent',
                }}>
                {SOURCE_LABELS[s]}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="text-xs font-mono px-3 py-1.5 outline-none cursor-pointer"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '2px' }}>
            <option value="recent">Most Recent</option>
            <option value="top">Top Rated</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-32"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl tracking-wider" style={{ color: 'var(--text-muted)' }}>No reviews yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r, i) => <ReviewCard key={r._id} review={r} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
