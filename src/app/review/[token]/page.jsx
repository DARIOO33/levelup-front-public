'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { reviewsApi } from '@/lib/api';

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}>
          <Star
            size={36}
            fill={n <= active ? '#7c3aff' : 'none'}
            stroke={n <= active ? '#7c3aff' : 'var(--text-muted)'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent!' };

export default function ReviewFormPage() {
  const { token } = useParams();
  const [context, setContext]   = useState(null);   // { productName, orderId }
  const [status, setStatus]     = useState('loading'); // loading | form | success | invalid
  const [form, setForm]         = useState({ name: '', rating: 0, comment: '', showName: true });
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    reviewsApi.getFormContext(token)
      .then(r => { setContext(r.data.context); setStatus('form'); })
      .catch(() => setStatus('invalid'));
  }, [token]);

  const validate = () => {
    const e = {};
    if (!form.rating) e.rating = 'Please select a rating';
    if (!form.comment.trim()) e.comment = 'Please write a short comment';
    if (form.comment.trim().length < 10) e.comment = 'Comment must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await reviewsApi.submitForm(token, {
        name:     form.showName ? form.name.trim() || 'Anonymous' : '',
        rating:   form.rating,
        comment:  form.comment.trim(),
        showName: form.showName,
      });
      setStatus('success');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('invalid') || msg.includes('used')) setStatus('invalid');
      else setErrors({ submit: msg || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 flex items-start justify-center"
      style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-lg mt-8">

        {/* Top accent */}
        <div className="h-1 w-full rounded-t" style={{ background: 'linear-gradient(90deg,#7c3aff,#a78bfa)' }} />

        <AnimatePresence mode="wait">

          {/* ── Invalid / expired ── */}
          {status === 'invalid' && (
            <motion.div key="invalid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="card-glass p-10 text-center rounded-t-none">
              <AlertCircle size={48} className="mx-auto mb-4" style={{ color: '#ef4444' }} />
              <h1 className="font-display text-3xl tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
                Link expired
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                This review link has already been used or is invalid. Each link can only be used once.
              </p>
              <Link href="/" className="btn-primary text-sm px-8 py-3 inline-flex">Go home</Link>
            </motion.div>
          )}

          {/* ── Success ── */}
          {status === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="card-glass p-10 text-center rounded-t-none">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
                <CheckCircle size={56} className="mx-auto mb-4 text-purple-500" />
              </motion.div>
              <h1 className="font-display text-3xl tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
                Thank you!
              </h1>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Your review has been submitted and will appear on our site after approval.
              </p>
              <p className="text-xs font-mono mb-8" style={{ color: 'var(--text-muted)' }}>
                We appreciate you taking the time to share your experience 🎧
              </p>
              <Link href="/shop" className="btn-primary text-sm px-8 py-3 inline-flex">Browse more gear</Link>
            </motion.div>
          )}

          {/* ── Review form ── */}
          {status === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="card-glass p-8 rounded-t-none">

              {/* Header */}
              <div className="mb-7">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                  LevelUp · Customer Review
                </p>
                <h1 className="font-display text-3xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  Share your experience
                </h1>
                {context?.productName && (
                  <p className="text-sm mt-2 font-medium" style={{ color: 'var(--purple)' }}>
                    {context.productName}
                  </p>
                )}
              </div>

              <div className="space-y-6">

                {/* Star rating */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                    Your Rating *
                  </label>
                  <StarRating value={form.rating} onChange={v => { setForm(f => ({ ...f, rating: v })); setErrors(e => ({ ...e, rating: '' })); }} />
                  {form.rating > 0 && (
                    <p className="mt-1.5 text-xs font-mono" style={{ color: 'var(--purple)' }}>
                      {RATING_LABELS[form.rating]}
                    </p>
                  )}
                  {errors.rating && <p className="mt-1 text-xs text-red-400">{errors.rating}</p>}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Tell us what you think — sound quality, build, value..."
                    value={form.comment}
                    onChange={e => { setForm(f => ({ ...f, comment: e.target.value })); setErrors(e2 => ({ ...e2, comment: '' })); }}
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.comment
                      ? <p className="text-xs text-red-400">{errors.comment}</p>
                      : <span />}
                    <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {form.comment.length}/500
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Your Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    className="input-field"
                    placeholder="e.g. Mohamed A."
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    maxLength={60}
                    disabled={!form.showName}
                    style={{ opacity: form.showName ? 1 : 0.4, transition: 'opacity .2s' }}
                  />
                </div>

                {/* Show name toggle */}
                <div
                  className="flex items-start gap-3 p-4 rounded cursor-pointer select-none"
                  style={{ background: 'var(--bg-secondary)', borderRadius: '4px' }}
                  onClick={() => setForm(f => ({ ...f, showName: !f.showName }))}
                >
                  <div
                    className="mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: form.showName ? 'var(--purple)' : 'var(--border)',
                      background:  form.showName ? 'var(--purple)' : 'transparent',
                    }}
                  >
                    {form.showName && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Show my name publicly
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {form.showName
                        ? 'Your name will appear alongside your review on our website.'
                        : 'Your review will be shown as "Anonymous".'}
                    </p>
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-xs text-red-400 text-center">{errors.submit}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? <div className="spinner !w-4 !h-4" /> : <Star size={15} />}
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>

                <p className="text-center text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  Reviews are moderated before appearing publicly.
                  This link is single-use and tied to your order.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
