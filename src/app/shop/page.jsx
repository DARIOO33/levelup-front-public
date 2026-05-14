'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { productsApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import GuestAccountBanner from '@/components/GuestAccountBanner';
import { useAuthStore } from '@/store';

const CAT_LABELS = { iems: 'IEMs', accessories: 'Accessories' };
const SUB_LABELS = { cables: 'Cables', 'ear-tips': 'Ear Tips', bags: 'Carrying Bags', cleaning: 'Cleaning Kits', dac: 'DAC / Dongles', other: 'Other' };

const PAGE_SIZE = 12;

// ── Inner component — uses useSearchParams, must live inside <Suspense> ───────
function ShopContent() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  const [page, setPage] = useState(1);

  // Read URL filters
  const urlCat = searchParams.get('cat') || '';
  const urlSub = searchParams.get('sub') || '';
  const urlBrand = searchParams.get('brand') || '';

  useEffect(() => {
    productsApi.getAll()
      .then(r => setProducts(r.data.products || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    // Filters
    if (urlCat) {
      list = list.filter((p) => p.category === urlCat);
    }

    if (urlSub) {
      list = list.filter((p) => p.subCategory === urlSub);
    }

    if (urlBrand) {
      list = list.filter(
        (p) => p.subCategory?.toLowerCase() === urlBrand.toLowerCase()
      );
    }

    if (search) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sorting
    list.sort((a, b) => {
      const aInStock = a.variants?.some((v) => v.stock > 0);
      const bInStock = b.variants?.some((v) => v.stock > 0);

      // Always prioritize in-stock products
      if (aInStock !== bInStock) {
        return aInStock ? -1 : 1;
      }

      // Price low -> high
      if (sort === 'price_asc') {
        return (
          Math.min(...a.variants.map((v) => v.price)) -
          Math.min(...b.variants.map((v) => v.price))
        );
      }

      // Price high -> low
      if (sort === 'price_desc') {
        return (
          Math.min(...b.variants.map((v) => v.price)) -
          Math.min(...a.variants.map((v) => v.price))
        );
      }

      // Newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return list;
  }, [products, search, sort, urlCat, urlSub, urlBrand]);

  // Reset to page 1 whenever filters change
  const prevFilterKey = `${search}|${sort}|${urlCat}|${urlSub}|${urlBrand}`;
  const [lastFilterKey, setLastFilterKey] = useState(prevFilterKey);
  if (prevFilterKey !== lastFilterKey) {
    setLastFilterKey(prevFilterKey);
    setPage(1);
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeLabel = urlBrand
    ? urlBrand
    : urlSub ? (SUB_LABELS[urlSub] || urlSub)
      : urlCat ? (CAT_LABELS[urlCat] || urlCat)
        : null;

  return (
    <div className="min-h-screen pt-16">
      <div className="relative py-20 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center top,rgba(124,58,255,0.12),transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <span className="tag mb-3 inline-flex">{activeLabel || 'Full Collection'}</span>
          <h1 className="section-title">{activeLabel ? activeLabel.toUpperCase() : t('shop.title')}</h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''} available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Account creation nudge for guests */}
        {!user && <GuestAccountBanner context="shop" />}

        {/* Active filter chips */}
        {(urlCat || urlSub || urlBrand) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {urlBrand && (
              <span className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded" style={{ background: 'rgba(124,58,255,0.1)', color: 'var(--purple)', border: '1px solid rgba(124,58,255,0.3)' }}>
                Brand: {urlBrand}
                <a href="/shop" className="hover:text-white transition-colors"><X size={10} /></a>
              </span>
            )}
            {!urlBrand && urlCat && (
              <span className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded" style={{ background: 'rgba(124,58,255,0.1)', color: 'var(--purple)', border: '1px solid rgba(124,58,255,0.3)' }}>
                {CAT_LABELS[urlCat] || urlCat}
                <a href="/shop" className="hover:text-white transition-colors"><X size={10} /></a>
              </span>
            )}
            {urlSub && (
              <span className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded" style={{ background: 'rgba(124,58,255,0.1)', color: 'var(--purple)', border: '1px solid rgba(124,58,255,0.3)' }}>
                {SUB_LABELS[urlSub] || urlSub}
                <a href={`/shop?cat=${urlCat}`} className="hover:text-white transition-colors"><X size={10} /></a>
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('shop.search')} className="input-field pl-10 pr-10" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}><X size={14} /></button>}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="input-field sm:w-52 cursor-pointer">
            <option value="new">{t('shop.sort_new')}</option>
            <option value="price_asc">{t('shop.sort_price_asc')}</option>
            <option value="price_desc">{t('shop.sort_price_desc')}</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32"><div className="spinner" /></div>
        ) : filtered.length > 0 ? (
          <>
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
                {paginated.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-mono border transition-colors disabled:opacity-30"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce((acc, n, i, arr) => {
                    if (i > 0 && n - arr[i - 1] > 1) acc.push('…');
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === '…'
                      ? <span key={`ellipsis-${i}`} className="px-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>…</span>
                      : (
                        <button
                          key={n}
                          onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-8 h-8 text-xs font-mono border transition-colors"
                          style={{
                            borderRadius: '2px',
                            borderColor: page === n ? 'var(--purple)' : 'var(--border)',
                            background: page === n ? 'rgba(124,58,255,0.12)' : 'transparent',
                            color: page === n ? 'var(--purple)' : 'var(--text-muted)',
                          }}
                        >
                          {n}
                        </button>
                      )
                  )}

                <button
                  onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-mono border transition-colors disabled:opacity-30"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}
                >
                  Next →
                </button>
              </div>
            )}

            <p className="text-center text-[10px] font-mono mt-3" style={{ color: 'var(--text-muted)' }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="text-6xl opacity-30">🎧</div>
            <p className="font-display text-2xl tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('shop.no_products')}</p>
            {(search || urlCat || urlBrand) && (
              <a href="/shop" className="btn-outline text-sm">Clear filters</a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page export — wraps the content in Suspense (required by Next.js for ─────
// any component that calls useSearchParams during static generation)  ─────────
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
