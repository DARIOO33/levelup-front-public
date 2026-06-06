'use client';
import { RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutError({ reset }) {
  return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-6xl opacity-30">🛒</div>
      <div className="text-center">
        <h2 className="font-display text-3xl tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
          Checkout error
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Something went wrong. Your cart is safe — try again.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary flex items-center gap-2 text-sm">
          <RotateCcw size={14} /> Retry
        </button>
        <Link href="/cart" className="btn-outline text-sm px-5 py-2.5">Back to Cart</Link>
      </div>
    </div>
  );
}
