'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, ArrowRight, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useAuthStore } from '@/store';
import { productPathSegment } from '@/lib/productPath';
import { wishlistApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function QuickViewModal({ product, onClose }) {
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const variant = product?.variants?.[selectedVariant];
  const minPrice = Math.min(...(product?.variants?.map((v) => v.price) || [0]));
  const inStock = product?.variants?.some((v) => v.stock > 0);
  const totalStock = product?.variants?.reduce((s, v) => s + v.stock, 0) || 0;
  const images = product?.images?.length > 0 ? product.images : [];

  // Auto-select first in-stock variant
  useEffect(() => {
    if (!product?.variants?.length) return;
    const firstOk = product.variants.findIndex(v => v.stock > 0);
    if (firstOk !== -1) setSelectedVariant(firstOk);
  }, [product]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleAddToCart = () => {
    if (!variant || variant.stock === 0) return;
    addItem(product, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    toast.success(`${product.name} added to cart`, {
      style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid rgba(124,58,255,0.3)' },
      iconTheme: { primary: '#7c3aff', secondary: '#fff' },
    });
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Login to save wishlist'); return; }
    try { await wishlistApi.toggle(product._id); setWishlist(w => !w); } catch {}
  };

  const prevImg = () => setActiveImage(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImage(i => (i + 1) % images.length);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.75)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(124,58,255,0.3)',
            borderTop: '2px solid var(--purple)',
            borderRadius: '4px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,255,0.1)',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center transition-all hover:rotate-90"
            style={{ background: 'rgba(124,58,255,0.1)', border: '1px solid rgba(124,58,255,0.25)', borderRadius: '2px', color: 'var(--text-muted)' }}
          >
            <X size={14} />
          </button>

          {/* ── LEFT: Image gallery ── */}
          <div className="relative w-full md:w-[48%] flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(124,58,255,0.06), var(--bg-secondary))' }}>
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  {images[activeImage] ? (
                    <Image
                      src={images[activeImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl opacity-20">🎧</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.featured && (
                  <span className="tag flex items-center gap-1"><Zap size={9} />Featured</span>
                )}
                {!inStock && (
                  <span className="tag text-[9px]" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
                    Out of Stock
                  </span>
                )}
                {inStock && totalStock < 5 && (
                  <span className="tag text-[9px]" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}>
                    Only {totalStock} left
                  </span>
                )}
              </div>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-all hover:scale-110 z-10"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', color: 'white' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={nextImg}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-all hover:scale-110 z-10"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', color: 'white' }}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="relative flex-shrink-0 w-14 h-14 overflow-hidden transition-all"
                    style={{
                      border: `1.5px solid ${i === activeImage ? 'var(--purple)' : 'var(--border)'}`,
                      borderRadius: '2px',
                      boxShadow: i === activeImage ? '0 0 10px rgba(124,58,255,0.4)' : 'none',
                      opacity: i === activeImage ? 1 : 0.6,
                    }}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
            {/* Brand + name */}
            <div>
              {product.brand && (
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--purple)' }}>
                  {product.brand}
                </p>
              )}
              <h2 className="font-display text-3xl tracking-wider leading-tight" style={{ color: 'var(--text-primary)' }}>
                {product.name}
              </h2>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-semibold" style={{ color: 'var(--purple)' }}>
                {variant ? variant.price : minPrice}
              </span>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>TND</span>
              <span className={`text-xs font-mono ml-2 ${totalStock > 0 ? 'text-green-500' : 'text-red-400'}`}>
                {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: 'var(--border)' }} />

            {/* Description */}
            {product.description && (
              <p className="text-sm leading-relaxed line-clamp-4" style={{ color: 'var(--text-secondary)' }}>
                {product.description}
              </p>
            )}

            {/* Variants */}
            {product.variants?.length > 1 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  Select Option
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={v._id}
                      onClick={() => v.stock > 0 && setSelectedVariant(i)}
                      disabled={v.stock === 0}
                      className="px-3 py-1.5 text-xs font-mono border transition-all duration-150 relative"
                      style={{
                        borderRadius: '2px',
                        borderColor: i === selectedVariant ? 'var(--purple)' : 'var(--border)',
                        color: i === selectedVariant ? 'var(--purple)' : 'var(--text-secondary)',
                        background: i === selectedVariant ? 'rgba(124,58,255,0.1)' : 'transparent',
                        opacity: v.stock === 0 ? 0.4 : 1,
                        cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                        boxShadow: i === selectedVariant ? '0 0 12px rgba(124,58,255,0.3)' : 'none',
                      }}
                    >
                      {v.title}
                      {i === selectedVariant && (
                        <motion.span
                          layoutId="variant-check"
                          className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center"
                          style={{ background: 'var(--purple)', borderRadius: '50%' }}
                        >
                          <Check size={8} color="white" />
                        </motion.span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specs snippet */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="p-2 text-xs" style={{ background: 'var(--bg-secondary)', borderRadius: '2px', border: '1px solid var(--border)' }}>
                    <p className="font-mono uppercase tracking-wider mb-0.5 text-[9px]" style={{ color: 'var(--text-muted)' }}>{k}</p>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="btn-primary flex-1 justify-center py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={added ? { background: 'linear-gradient(135deg, #16a34a, #15803d)' } : {}}
                >
                  {added ? (
                    <><Check size={15} /> Added to Cart!</>
                  ) : (
                    <><ShoppingBag size={15} /> {inStock ? 'Add to Cart' : 'Out of Stock'}</>
                  )}
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-12 flex items-center justify-center border transition-all hover:border-red-400"
                  style={{
                    borderColor: wishlist ? '#f87171' : 'var(--border)',
                    color: wishlist ? '#f87171' : 'var(--text-muted)',
                    borderRadius: '2px',
                    background: wishlist ? 'rgba(239,68,68,0.08)' : 'transparent',
                  }}
                >
                  <Heart size={16} fill={wishlist ? 'currentColor' : 'none'} />
                </button>
              </div>

              <Link
                href={`/product/${productPathSegment(product)}`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 text-xs font-mono py-2 transition-colors hover:text-purple-400"
                style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}
              >
                View Full Details <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
