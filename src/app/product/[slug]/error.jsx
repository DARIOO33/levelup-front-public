'use client';
import { RotateCcw, ArrowLeft } from 'lucide-react';

export default function ProductError({ reset }) {
  return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-6xl opacity-30">🎧</div>
      <div className="text-center">
        <h2 className="font-display text-3xl tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
          Product unavailable
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          This product could not be loaded. It may have been removed or moved.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-outline flex items-center gap-2 text-sm">
          <RotateCcw size={14} /> Try again
        </button>
        <a href="/shop" className="btn-primary flex items-center gap-2 text-sm">
          <ArrowLeft size={14} /> Back to shop
        </a>
      </div>
    </div>
  );
}
