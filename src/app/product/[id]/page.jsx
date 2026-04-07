'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ArrowLeft, Share2, Check, ChevronDown, ChevronUp, Bell, BellOff, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { productsApi, notifyApi, wishlistApi, reviewsApi } from '@/lib/api';
import { useCartStore, useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import GuestAccountBanner from '@/components/GuestAccountBanner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [added, setAdded] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [watchingChecked, setWatchingChecked] = useState(false); // has DB check completed?

  // Reviews
  const [reviews, setReviews]           = useState([]);
  const [reviewCount, setReviewCount]   = useState(0);
  const [reviewAvg, setReviewAvg]       = useState(null);
  const [reviewsOpen, setReviewsOpen]   = useState(true);

  // Load product
  useEffect(() => {
    productsApi.getOne(id)
      .then(r => { setProduct(r.data.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // Load approved reviews for this product
  useEffect(() => {
    if (!id) return;
    reviewsApi.getForProduct(id)
      .then(r => {
        setReviews(r.data.reviews || []);
        setReviewCount(r.data.count || 0);
        setReviewAvg(r.data.avg || null);
      })
      .catch(() => {});
  }, [id]);

  // Check if product is in wishlist when user is logged in
  useEffect(() => {
    if (!user || !product) return;
    wishlistApi.get()
      .then(r => {
        const ids = (r.data.wishlist || []).map(p => (typeof p === 'string' ? p : p._id?.toString()));
        setInWishlist(ids.includes(product._id?.toString()));
      })
      .catch(() => { });
  }, [user, product]);

  const handleWishlistToggle = async () => {
    if (!user) { toast.error('Please log in to save items'); return; }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await wishlistApi.remove(product._id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistApi.add(product._id);
        setInWishlist(true);
        toast.success('Saved to wishlist!');
      }
    } catch { toast.error('Something went wrong'); }
    finally { setWishlistLoading(false); }
  };

  // Derive the currently selected variant object
  const variant = product?.variants[selectedVariant] ?? null;
  const outOfStock = !variant || variant.stock === 0;

  // When variant changes and user is logged in, check DB for watching state
  useEffect(() => {
    if (!user || !product || !variant) {
      setIsWatching(false);
      setWatchingChecked(true);
      return;
    }
    // Only check for out-of-stock variants — in-stock ones can't be watched
    if (!outOfStock) {
      setIsWatching(false);
      setWatchingChecked(true);
      return;
    }
    setWatchingChecked(false);
    // Pass variant._id as string
    notifyApi.status(id, variant._id.toString())
      .then(r => { setIsWatching(r.data.isWatching); })
      .catch(() => setIsWatching(false))
      .finally(() => setWatchingChecked(true));
  }, [user, product, selectedVariant]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleNotifyToggle = async () => {
    if (!user) {
      toast.error('Please log in to get notified');
      return;
    }
    setNotifyLoading(true);
    try {
      // Always pass variantId as string
      const variantId = variant?._id?.toString();
      if (isWatching) {
        await notifyApi.remove(id, variantId);
        setIsWatching(false);
        toast.success('Notification removed');
      } else {
        await notifyApi.register(id, variantId);
        setIsWatching(true);
        toast.success("We'll notify you when this is back in stock!");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Something went wrong');
    } finally {
      setNotifyLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16"><div className="spinner" /></div>
  );
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 gap-4">
      <p className="font-display text-3xl" style={{ color: 'var(--text-muted)' }}>Product Not Found</p>
      <Link href="/shop" className="btn-outline text-sm flex items-center gap-2"><ArrowLeft size={14} /> Back to Shop</Link>
    </div>
  );

  const allImages = [...product.images, ...product.variants.map(v => v.image).filter(Boolean)]
    .filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <Link href="/shop" className="hover:text-purple-400 transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> {t('nav.shop')}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Images */}
          <div className="space-y-3">
            <motion.div key={activeImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="relative aspect-square overflow-hidden card-glass" style={{ borderRadius: '4px' }}>
              {allImages[activeImage]
                ? <Image src={allImages[activeImage]} alt={product.name} fill className="object-cover" sizes="(max-width:1024px) 100vw,50vw" />
                : <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">🎧</div>}
            </motion.div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className="relative flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-all"
                    style={{ borderRadius: '2px', borderColor: i === activeImage ? 'var(--purple)' : 'var(--border)' }}>
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.featured && <span className="tag mb-3 inline-flex">Featured</span>}
            <h1 className="font-display text-4xl md:text-5xl tracking-wide leading-tight" style={{ color: 'var(--text-primary)' }}>
              {product.name}
            </h1>

            {/* Star rating summary */}
            {reviewCount > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14}
                      fill={s <= Math.round(reviewAvg) ? 'var(--purple)' : 'none'}
                      stroke={s <= Math.round(reviewAvg) ? 'var(--purple)' : 'var(--text-muted)'}
                    />
                  ))}
                </div>
                <span className="text-sm font-mono" style={{ color: 'var(--purple)' }}>{reviewAvg}</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-semibold" style={{ color: 'var(--purple)' }}>
                {variant?.price} TND
              </span>
              {variant && (
                <span className="text-xs font-mono"
                  style={{ color: variant.stock > 5 ? '#22c55e' : variant.stock > 0 ? '#f59e0b' : '#ef4444' }}>
                  {variant.stock > 0 ? `${variant.stock} ${t('shop.stock')}` : t('shop.out_of_stock')}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {product.description}
              </p>
            )}

            {/* Variant selector */}
            <div className="mt-6">
              <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                {t('shop.variants')}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button key={v._id} onClick={() => setSelectedVariant(i)}
                    className="px-4 py-2 text-sm font-mono border transition-all duration-200"
                    style={{
                      borderRadius: '2px',
                      borderColor: i === selectedVariant ? 'var(--purple)' : 'var(--border)',
                      color: i === selectedVariant ? 'var(--purple)' : v.stock === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
                      background: i === selectedVariant ? 'rgba(124,58,255,0.08)' : 'transparent',
                      opacity: v.stock === 0 && i !== selectedVariant ? 0.5 : 1,
                    }}>
                    {v.title}
                    {v.stock === 0 && <span className="ml-1 text-[10px]">· out</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 mt-8">
              {outOfStock ? (
                /* Notify Me */
                <button
                  onClick={handleNotifyToggle}
                  disabled={notifyLoading || !watchingChecked}
                  className="flex-1 py-4 text-sm font-mono border-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    borderRadius: '2px',
                    borderColor: isWatching ? '#22c55e' : 'var(--purple)',
                    color: isWatching ? '#22c55e' : 'var(--purple)',
                    background: isWatching ? 'rgba(34,197,94,0.06)' : 'rgba(124,58,255,0.06)',
                  }}>
                  {(notifyLoading || !watchingChecked) ? (
                    <div className="spinner !w-4 !h-4" />
                  ) : isWatching ? (
                    <><BellOff size={16} /> Stop watching</>
                  ) : user ? (
                    <><Bell size={16} /> Notify me when available</>
                  ) : (
                    <><Bell size={16} /> Log in to get notified</>
                  )}
                </button>
              ) : (
                <button onClick={handleAddToCart}
                  className="flex-1 btn-primary py-4 text-sm flex items-center justify-center gap-2">
                  {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                  {added ? 'Added!' : t('shop.add_cart')}
                </button>
              )}

              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className="btn-outline px-4 transition-all disabled:opacity-50"
                style={inWishlist ? { borderColor: '#ef4444', color: '#ef4444' } : {}}
                title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}>
                {wishlistLoading ? <div className="spinner !w-4 !h-4" /> : <Heart size={16} fill={inWishlist ? '#ef4444' : 'none'} />}
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                className="btn-outline px-4">
                <Share2 size={16} />
              </button>
            </div>

            {/* Out of stock hint */}
            {outOfStock && watchingChecked && (
              <p className="mt-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                {!user
                  ? 'Log in or create an account to receive restock notifications by email.'
                  : isWatching
                    ? '✓ You\'ll receive an email the moment this variant is restocked.'
                    : 'Click "Notify me" and we\'ll email you the moment stock is added.'}
              </p>
            )}

            {/* Specs */}
            {product.specifications && (
              <div className="mt-8 border rounded" style={{ borderColor: 'var(--border)', borderRadius: '4px' }}>
                <button onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full flex items-center justify-between p-4 text-sm font-mono font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--text-primary)' }}>
                  {t('shop.specs')}
                  {specsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {specsOpen && (
                  <div className="border-t divide-y" style={{ borderColor: 'var(--border)' }}>
                    {(product.specifications instanceof Map
                      ? [...product.specifications.entries()]
                      : Object.entries(product.specifications)
                    ).map(([key, val]) => (
                      <div key={key} className="flex px-4 py-2.5 text-xs">
                        <span className="w-40 font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{key}</span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{val || '—'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Reviews Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 pb-4">
        <div className="border rounded" style={{ borderColor: 'var(--border)', borderRadius: '4px' }}>

          {/* Header */}
          <button
            onClick={() => setReviewsOpen(o => !o)}
            className="w-full flex items-center justify-between p-5 text-sm font-mono font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-primary)' }}
          >
            <div className="flex items-center gap-3">
              <span>{t('shop.reviews')}</span>
              {reviewCount > 0 && (
                <span className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{ background: 'rgba(124,58,255,0.12)', color: 'var(--purple)' }}>
                  {reviewCount}
                </span>
              )}
              {reviewAvg && (
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={12}
                      fill={s <= Math.round(reviewAvg) ? 'var(--purple)' : 'none'}
                      stroke={s <= Math.round(reviewAvg) ? 'var(--purple)' : 'var(--text-muted)'}
                    />
                  ))}
                  <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>{reviewAvg} / 5</span>
                </div>
              )}
            </div>
            {reviewsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {reviewsOpen && (
            <div className="border-t" style={{ borderColor: 'var(--border)' }}>
              {reviews.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-3" style={{ color: 'var(--text-muted)' }}>
                  <Star size={32} className="opacity-20" />
                  <p className="text-sm font-mono">No reviews yet for this product.</p>
                  <p className="text-xs">Purchase and complete your order to leave a review.</p>
                </div>
              ) : (
                <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
                  {reviews.map(review => (
                    <div key={review._id} className="p-5 flex flex-col sm:flex-row gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg"
                          style={{ background: 'rgba(124,58,255,0.15)', color: 'var(--purple)' }}>
                          {review.showName && review.name
                            ? review.name[0].toUpperCase()
                            : '?'}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {review.showName && review.name ? review.name : 'Anonymous'}
                          </span>
                          {/* Stars */}
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={13}
                                fill={s <= review.rating ? '#f59e0b' : 'none'}
                                stroke={s <= review.rating ? '#f59e0b' : 'var(--text-muted)'}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            {new Date(review.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                          </span>
                          {review.source && review.source !== 'website' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded capitalize"
                              style={{ background: 'rgba(124,58,255,0.08)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                              {review.source}
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Account nudge for guests browsing products */}
      {!user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 mt-6">
          <GuestAccountBanner context="shop" />
        </div>
      )}
    </div>
  );
}
