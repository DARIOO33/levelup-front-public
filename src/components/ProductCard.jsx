'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Eye, Zap, Heart } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/store';
import { productPathSegment } from '@/lib/productPath';
import { wishlistApi } from '@/lib/api';
import QuickViewModal from '@/components/QuickViewModal';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [quickView, setQuickView] = useState(false);

  const variant = product.variants?.[selectedVariant];
  const minPrice = Math.min(...(product.variants?.map((v) => v.price) || [0]));
  const inStock = product.variants?.some((v) => v.stock > 0);
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const maxVariants = 3;

  useEffect(() => {
    if (!product.variants?.length) return;
    const cur = product.variants[selectedVariant];
    if (cur?.stock === 0) {
      const idx = product.variants.findIndex(v => v.stock > 0);
      if (idx !== -1 && idx !== selectedVariant) setSelectedVariant(idx);
    }
  }, [product.variants, selectedVariant]);

  useEffect(() => {
    if (!product.variants?.length) return;
    if (product.variants[0]?.stock === 0) {
      const idx = product.variants.findIndex(v => v.stock > 0);
      if (idx !== -1) setSelectedVariant(idx);
    }
  }, [product.variants]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!variant || variant.stock === 0) return;
    addItem(product, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toast.success(`${product.name} added to cart`, {
      style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid rgba(124,58,255,0.3)' },
      iconTheme: { primary: '#7c3aff', secondary: '#fff' },
    });
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to save wishlist', { style: { background: 'var(--bg-card)', color: 'var(--text-primary)' } }); return; }
    try { await wishlistApi.toggle(product._id); setWishlist(w => !w); } catch {}
  };

  return (
    <>
      {/* ── Card — no 3D tilt, no framer-motion, pure CSS hover ── */}
      <div
        className="product-card group flex flex-col"
        style={{ borderRadius: '4px', height: '100%' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* SEO microdata */}
        <meta itemProp="name" content={product.name} />
        {product.brand && <meta itemProp="brand" content={product.brand} />}
        {product.description && <meta itemProp="description" content={product.description} />}
        {product.images?.[0] && <meta itemProp="image" content={product.images[0]} />}
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer" style={{ display: 'none' }}>
          <meta itemProp="priceCurrency" content="TND" />
          <meta itemProp="price" content={String(variant ? variant.price : minPrice)} />
          <meta itemProp="availability" content={inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
          <meta itemProp="url" content={`/product/${productPathSegment(product)}`} />
          <meta itemProp="seller" content="Level Up TN" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.featured && <span className="tag flex items-center gap-1"><Zap size={9} />Featured</span>}
          {inStock && totalStock < 5 && (
            <span className="tag text-[9px]" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}>
              Only {totalStock} left
            </span>
          )}
          {!inStock && (
            <span className="tag text-[9px]" style={{ background: 'rgba(100,100,120,0.12)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '2px',
            opacity: hovered || wishlist ? 1 : 0,
            transition: 'opacity 0.2s ease',
            color: wishlist ? '#f87171' : 'white',
          }}
        >
          <Heart size={13} fill={wishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Image */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ aspectRatio: '1', background: 'linear-gradient(135deg, rgba(124,58,255,0.07), var(--bg-secondary))' }}
        >
          <Link href={`/product/${productPathSegment(product)}`} className="block w-full h-full">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={`${product.name}${product.brand ? ' by ' + product.brand : ''} — Level Up TN`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl opacity-15">🎧</span>
              </div>
            )}
          </Link>

          {/* Hover overlay — CSS opacity transition, no framer-motion */}
          <div
            className="absolute inset-0 flex items-end justify-center pb-4 gap-2 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <button
              onClick={(e) => { e.preventDefault(); setQuickView(true); }}
              className="pointer-events-auto flex items-center gap-1.5 text-xs font-mono text-white px-3 py-2"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '2px',
                transition: 'border-color 0.2s ease',
              }}
            >
              <Eye size={12} /> Quick View
            </button>
            {inStock && (
              <button
                onClick={handleAddToCart}
                className="pointer-events-auto flex items-center gap-1.5 text-xs font-mono text-white px-3 py-2"
                style={{
                  background: added ? 'rgba(34,197,94,0.85)' : 'rgba(124,58,255,0.88)',
                  border: `1px solid ${added ? 'rgba(34,197,94,0.5)' : 'rgba(124,58,255,0.6)'}`,
                  borderRadius: '2px',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                }}
              >
                <ShoppingBag size={12} />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            )}
          </div>

          {/* Bottom purple line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{
              background: 'linear-gradient(90deg,transparent,var(--purple),transparent)',
              transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-2" style={{ minHeight: '3.2rem' }}>
            <Link href={`/product/${productPathSegment(product)}`}>
              <h3
                className="font-display text-lg tracking-wide leading-tight line-clamp-2"
                style={{
                  color: hovered ? 'var(--purple-light)' : 'var(--text-primary)',
                  transition: 'color 0.2s ease',
                }}
                itemProp="name"
              >
                {product.name}
              </h3>
            </Link>
            {product.brand && (
              <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {product.brand}
              </p>
            )}
          </div>

          <div className="mb-3" style={{ minHeight: '1.75rem' }}>
            {product.variants?.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {product.variants.slice(0, maxVariants).map((v, i) => (
                  <button
                    key={v._id}
                    onClick={() => v.stock > 0 && setSelectedVariant(i)}
                    className="text-[10px] font-mono px-2 py-0.5 border"
                    style={{
                      borderRadius: '2px',
                      borderColor: i === selectedVariant ? 'var(--purple)' : 'var(--border)',
                      color: i === selectedVariant ? 'var(--purple)' : 'var(--text-muted)',
                      background: i === selectedVariant ? 'rgba(124,58,255,0.08)' : 'transparent',
                      opacity: v.stock === 0 ? 0.4 : 1,
                      cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                      transition: 'border-color 0.15s ease, color 0.15s ease',
                    }}
                    disabled={v.stock === 0}
                  >
                    {v.title}
                  </button>
                ))}
                {product.variants.length > maxVariants && (
                  <button
                    onClick={() => setQuickView(true)}
                    className="text-[10px] font-mono px-2 py-0.5 border"
                    style={{ borderRadius: '2px', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                  >
                    +{product.variants.length - maxVariants} more
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div>
              <span className="font-mono text-base font-semibold" style={{ color: 'var(--purple)' }}>
                {variant ? variant.price : minPrice}
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>TND</span>
              </span>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: totalStock > 0 ? '#22c55e' : '#ef4444' }}>
                {totalStock > 0 ? `${totalStock} ${t('shop.stock')}` : t('shop.out_of_stock')}
              </p>
            </div>

            {inStock ? (
              <button
                onClick={handleAddToCart}
                className="btn-primary px-3 py-1.5 text-xs"
                style={added ? { background: 'linear-gradient(135deg,#16a34a,#15803d)' } : {}}
              >
                <ShoppingBag size={12} />
                {added ? 'Added!' : t('shop.add_cart')}
              </button>
            ) : (
              <span className="text-xs font-mono px-3 py-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('shop.out_of_stock')}
              </span>
            )}
          </div>
        </div>
      </div>

      {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
    </>
  );
}
