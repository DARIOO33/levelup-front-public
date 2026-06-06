'use client';
import { RotateCcw } from 'lucide-react';

export default function ReviewsError({ reset }) {
  return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-6xl opacity-30">⭐</div>
      <div className="text-center">
        <h2 className="font-display text-3xl tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
          Failed to load reviews
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Check your connection and try again.
        </p>
      </div>
      <button onClick={reset} className="btn-primary flex items-center gap-2 text-sm">
        <RotateCcw size={14} /> Retry
      </button>
    </div>
  );
}
