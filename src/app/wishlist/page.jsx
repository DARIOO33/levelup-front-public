'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { useAuthStore, useCartStore } from '@/store';
import { wishlistApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const addItem = useCartStore(s => s.addItem);
  const { t } = useTranslation();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }
    wishlistApi.get()
      .then(r => setItems(r.data.wishlist || []))
      .catch(() => toast.error('Failed to load wishlist'))
      .finally(() => setLoading(false));
  }, [user, initialized]);

  const handleRemove = async (productId) => {
    try {
      await wishlistApi.remove(productId);
      setItems(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  const handleAddToCart = (product) => {
    const variant = product.variants?.find(v => v.stock > 0);
    if (!variant) { toast.error('Out of stock'); return; }
    addItem(product, variant);
    toast.success(`${product.name} added to cart`);
  };

  if (!initialized || loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center"><div className="spinner" /></div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={22} className="text-purple-400" />
          <div>
            <h1 className="font-display text-3xl tracking-wider" style={{ color: 'var(--text-primary)' }}>{t('wishlist.title')}</h1>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{t('wishlist.count_other', { count: items.length })}</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="card-glass p-16 text-center">
            <Heart size={40} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
            <p className="font-display text-2xl tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>{t('wishlist.empty')}</p>
            <p className="text-xs font-mono mb-6" style={{ color: 'var(--text-muted)' }}>{t('wishlist.empty_sub')}</p>
            <Link href="/shop" className="btn-primary text-xs px-6 py-2.5">{t('wishlist.browse')}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {items.map(product => {
                const minPrice   = Math.min(...(product.variants?.map(v => v.price) || [0]));
                const inStock    = product.variants?.some(v => v.stock > 0);
                return (
                  <motion.div key={product._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="card-glass overflow-hidden group">
                    <Link href={`/product/${product._id}`} className="block relative aspect-square overflow-hidden"
                      style={{ background: 'var(--bg-secondary)' }}>
                      {product.images?.[0]
                        ? <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 100vw,33vw" />
                        : <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🎧</div>}
                    </Link>
                    <div className="p-4">
                      <Link href={`/product/${product._id}`}>
                        <h3 className="font-display text-lg tracking-wide line-clamp-1 hover:text-purple-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                      </Link>
                      <p className="font-mono text-base font-semibold mt-1" style={{ color: 'var(--purple)' }}>{minPrice} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>TND</span></p>
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => handleAddToCart(product)} disabled={!inStock}
                          className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                          <ShoppingBag size={12} /> {inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button onClick={() => handleRemove(product._id)}
                          className="p-2 rounded transition-colors hover:text-red-400 flex-shrink-0"
                          style={{ color: 'var(--text-muted)' }} title={t('wishlist.remove')}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
