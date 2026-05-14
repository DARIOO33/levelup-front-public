'use client';
import { useEffect } from 'react';
import { RotateCcw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <span className="font-display text-2xl text-red-400">!</span>
        </div>

        <h1 className="font-display text-4xl tracking-widest mb-3" style={{ color: 'var(--text-primary)' }}>
          Something went wrong
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
          >
            <RotateCcw size={14} /> Try again
          </button>
          <a href="/" className="btn-outline flex items-center gap-2 text-sm px-5 py-2.5">
            <Home size={14} /> Go home
          </a>
        </div>
      </div>
    </div>
  );
}
