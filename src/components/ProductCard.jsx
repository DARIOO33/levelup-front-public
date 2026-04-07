'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Eye, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [hovered, setHovered] = useState(false);

  const variant = product.variants?.[selectedVariant];
  const minPrice = Math.min(...(product.variants?.map((v) => v.price) || [0]));
  const inStock = product.variants?.some((v) => v.stock > 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!variant || variant.stock === 0) return;
    addItem(product, variant);
    toast.success(`${product.name} added to cart`, {
      style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid rgba(124,58,255,0.3)' },
      iconTheme: { primary: '#7c3aff', secondary: '#fff' },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card-glass group relative overflow-hidden"
      style={{ borderRadius: '4px' }}
    >
      {product.featured && (
        <div className="absolute top-3 left-3 z-10 tag flex items-center gap-1">
          <Zap size={9} /> Featured
        </div>
      )}

      <Link href={`/product/${product._id}`} className="block relative overflow-hidden aspect-square bg-gradient-to-br from-purple-950/20 to-black">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-5xl opacity-20">🎧</div>
          </div>
        )}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300"
          style={{ background: 'rgba(0,0,0,0.5)', opacity: hovered ? 1 : 0 }}
        >
          <Link href={`/product/${product._id}`}
            className="w-9 h-9 bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 hover:border-purple-400 hover:text-purple-400 transition-all text-white"
            style={{ borderRadius: '2px' }} onClick={(e) => e.stopPropagation()}>
            <Eye size={15} />
          </Link>
          {inStock && (
            <button onClick={handleAddToCart}
              className="w-9 h-9 bg-purple-600 flex items-center justify-center text-white hover:bg-purple-500 transition-all"
              style={{ borderRadius: '2px' }}>
              <ShoppingBag size={15} />
            </button>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-display text-lg tracking-wide leading-tight hover:text-purple-400 transition-colors line-clamp-1" style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </h3>
        </Link>
        {product.variants?.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.variants.map((v, i) => (
              <button key={v._id} onClick={() => setSelectedVariant(i)}
                className="text-[10px] font-mono px-2 py-0.5 border transition-all duration-150"
                style={{ borderRadius: '2px', borderColor: i === selectedVariant ? 'var(--purple)' : 'var(--border)', color: i === selectedVariant ? 'var(--purple)' : 'var(--text-muted)', background: i === selectedVariant ? 'rgba(124,58,255,0.08)' : 'transparent' }}>
                {v.title}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-mono text-base font-semibold" style={{ color: 'var(--purple)' }}>
              {variant ? variant.price : minPrice} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>TND</span>
            </span>
            {variant && (
              <p className="text-[10px] font-mono mt-0.5" style={{ color: variant.stock > 0 ? '#22c55e' : '#ef4444' }}>
                {variant.stock > 0 ? `${variant.stock} ${t('shop.stock')}` : t('shop.out_of_stock')}
              </p>
            )}
          </div>
          {inStock ? (
            <button onClick={handleAddToCart} className="btn-primary px-3 py-1.5 text-xs">
              <ShoppingBag size={12} />{t('shop.add_cart')}
            </button>
          ) : (
            <span className="text-xs font-mono px-3 py-1.5" style={{ color: 'var(--text-muted)' }}>{t('shop.out_of_stock')}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
