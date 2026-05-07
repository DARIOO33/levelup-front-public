'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useAuthStore } from '@/store';
import GuestAccountBanner from '@/components/GuestAccountBanner';

export default function CartPage() {
  const { t } = useTranslation();
  const { items, removeItem, updateQty } = useCartStore();
  const { user } = useAuthStore();
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <span className="tag mb-3 inline-flex">Your Selection</span>
        <h1 className="section-title mb-6">{t('cart.title')}</h1>
        {!user && items.length > 0 && (
          <GuestAccountBanner context="cart" />
        )}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <ShoppingBag size={64} className="opacity-10" style={{ color: 'var(--purple)' }} />
            <div className="text-center">
              <p className="font-display text-3xl tracking-wide" style={{ color: 'var(--text-primary)' }}>{t('cart.empty')}</p>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{t('cart.empty_sub')}</p>
            </div>
            <Link href="/shop" className="btn-primary flex items-center gap-2">{t('cart.browse')} <ArrowRight size={15} /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div key={`${item.productId}-${item.variantId}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="card-glass p-4 flex items-center gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden" style={{ borderRadius: '2px', background: 'var(--bg-secondary)' }}>
                      {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" /> : <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">🎧</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg tracking-wide truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.variantName}</p>
                      <p className="font-mono text-sm font-semibold mt-1" style={{ color: 'var(--purple)' }}>{item.price} TND</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border transition-all hover:border-purple-500"
                        style={{ borderColor: 'var(--border)', borderRadius: '2px', color: 'var(--text-secondary)' }}><Minus size={12} /></button>
                      <span className="font-mono text-sm w-6 text-center" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border transition-all hover:border-purple-500"
                        style={{ borderColor: 'var(--border)', borderRadius: '2px', color: 'var(--text-secondary)' }}><Plus size={12} /></button>
                    </div>
                    <div className="text-right w-20 flex-shrink-0">
                      <p className="font-mono text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>TND</p>
                    </div>
                    <button onClick={() => removeItem(item.productId, item.variantId)} className="p-2 transition-colors hover:text-red-400 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div>
              <div className="card-glass p-6 sticky top-24">
                <h2 className="font-display text-2xl tracking-wide mb-5" style={{ color: 'var(--text-primary)' }}>{t('cart.summary')}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>{t('cart.subtotal')}</span><span className="font-mono">{total.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>{t('cart.shipping')}</span><span className="text-green-400 font-mono">{t('cart.shipping_free')}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <span>{t('cart.total')}</span>
                    <span className="font-mono text-base" style={{ color: 'var(--purple)' }}>{total.toFixed(2)} TND</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-primary w-full mt-6 flex items-center justify-center gap-2 text-sm py-4">
                  {t('cart.checkout')} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
