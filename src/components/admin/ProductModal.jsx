'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi } from '@/lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['iems', 'accessories'];
const IEM_BRANDS = ['KZ','7HZ','Moondrop','Simgot','Truthear','LETSHUOER','TinHiFi','Dunu','FiiO','QKZ'];
const ACCESSORY_SUBS = ['cables','ear-tips','bags','cleaning','dac','other'];
const emptyVariant = () => ({ title: '', price: '', stock: '', image: '' });
const emptyForm   = () => ({
  name: '', description: '', category: 'iems', subCategory: '', featured: false,
  images: [''], variants: [emptyVariant()], specifications: {},
});

const Label = ({ text, error }) => (
  <label className="block text-[10px] font-mono uppercase tracking-widest mb-1"
    style={{ color: error ? '#f87171' : 'var(--text-muted)' }}>
    {text}{error ? ` — ${error}` : ''}
  </label>
);

const Inp = (props) => (
  <input
    {...props}
    className={`w-full px-3 py-2 text-xs font-body outline-none transition-all duration-150 ${props.className || ''}`}
    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '2px' }}
    onFocus={e => (e.target.style.borderColor = '#7c3aff')}
    onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
  />
);

export default function ProductModal({ mode, product, onClose, onSaved }) {
  const isEdit = mode === 'edit';
  const TITLES = { create: 'Add Product', edit: 'Edit Product', duplicate: 'Duplicate Product' };

  const [form,      setForm]      = useState(emptyForm());
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [watcherInfo, setWatcherInfo] = useState(null);  // { totalWatchers, summary } | null
  const [notifyConfirm, setNotifyConfirm] = useState(false); // show notify-watchers dialog
  const [specsOpen, setSpecsOpen] = useState(false);
  const [specRow,   setSpecRow]   = useState({ key: '', value: '' });

  // 1 — populate form when product is loaded
  useEffect(() => {
    if (!product) return;
    const specs = product.specifications instanceof Map
      ? Object.fromEntries(product.specifications)
      : { ...(product.specifications || {}) };
    setForm({
      name:           mode === 'duplicate' ? `${product.name} (Copy)` : product.name,
      description:    product.description || '',
      category:       product.category    || 'iems',
      subCategory:    product.subCategory  || '',
      featured:       product.featured    || false,
      images:         product.images?.length ? [...product.images] : [''],
      variants:       product.variants?.length
                        ? product.variants.map(v => ({ _id: v._id || '', title: v.title, price: String(v.price), stock: String(v.stock), image: v.image || '' }))
                        : [emptyVariant()],
      specifications: specs,
    });
  }, [product, mode]);

  // 2 — fetch watcher summary when editing (shows who is waiting for restock)
  useEffect(() => {
    if (product?._id && mode === 'edit') {
      productsApi.getWatchers(product._id)
        .then(r => setWatcherInfo(r.data))
        .catch(() => setWatcherInfo(null));
    } else {
      setWatcherInfo(null);
    }
  }, [product, mode]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const setImage    = (i, v) => { const a = [...form.images]; a[i] = v; set('images', a); };
  const addImage    = ()     => set('images', [...form.images, '']);
  const removeImage = (i)   => set('images', form.images.filter((_, j) => j !== i));

  const setVariant    = (i, k, v) => set('variants', form.variants.map((vr, j) => j === i ? { ...vr, [k]: v } : vr));
  const addVariant    = ()        => set('variants', [...form.variants, emptyVariant()]);
  const removeVariant = (i)       => form.variants.length > 1 && set('variants', form.variants.filter((_, j) => j !== i));

  const addSpec    = () => { if (!specRow.key.trim()) return; set('specifications', { ...form.specifications, [specRow.key.trim()]: specRow.value.trim() }); setSpecRow({ key: '', value: '' }); };
  const removeSpec = k  => { const s = { ...form.specifications }; delete s[k]; set('specifications', s); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                                                                      e.name     = 'Required';
    if (form.images.every(img => !img.trim()))                                                  e.images   = 'At least one image URL required';
    if (form.variants.some(v => !v.title.trim() || v.price === '' || v.stock === '' || !v.image.trim())) e.variants = 'Each variant needs title, price, stock and image';
    if (form.variants.some(v => Number(v.price) < 0 || Number(v.stock) < 0))                   e.variants = 'Price / stock cannot be negative';
    setErrors(e);
    return !Object.keys(e).length;
  };

  // Build the payload (shared between submit paths)
  const buildPayload = (notifyWatchers = false) => ({
    name:           form.name.trim(),
    description:    form.description.trim(),
    category:       form.category,
    subCategory:    form.subCategory,
    featured:       form.featured,
    images:         form.images.filter(img => img.trim()),
    variants:       form.variants.map(v => ({ ...(v._id ? { _id: v._id } : {}), title: v.title.trim(), price: Number(v.price), stock: Number(v.stock), image: v.image.trim() })),
    specifications: form.specifications,
    ...(isEdit ? { notifyWatchers } : {}),
  });

  /**
   * Returns the outOfStockWithWatchers entries where the admin has now entered stock > 0.
   * Matches by _id (now preserved in form.variants) — falls back to title.
   */
  const getAffectedWatcherVariants = () => {
    if (!watcherInfo || !watcherInfo.outOfStockWithWatchers?.length) return [];
    return watcherInfo.outOfStockWithWatchers.filter(s => {
      // Try matching by _id first (reliable now that we preserve it)
      const byId = form.variants.find(v => v._id && v._id.toString() === s.variantId);
      if (byId) return Number(byId.stock) > 0;
      // Fallback: match by original product variant title
      const origVariant = product?.variants?.find(pv => pv._id?.toString() === s.variantId);
      if (!origVariant) return false;
      const byTitle = form.variants.find(v => v.title.trim() === origVariant.title.trim());
      return byTitle && Number(byTitle.stock) > 0;
    });
  };

  const doSave = async (notifyWatchers) => {
    setLoading(true);
    try {
      const payload = buildPayload(notifyWatchers);
      if (isEdit && product?._id) {
        const res = await productsApi.update(product._id, payload);
        onSaved(res.data.product, 'update');
        toast.success(notifyWatchers ? 'Product updated — watchers notified' : 'Product updated');
      } else {
        const res = await productsApi.create(buildPayload());
        onSaved(res.data.product, 'create');
        toast.success(mode === 'duplicate' ? 'Product duplicated' : 'Product created');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // If editing and watchers would be affected by stock increase, ask first
    if (isEdit && getAffectedWatcherVariants().length > 0) {
      setNotifyConfirm(true);
    } else {
      doSave(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="w-full max-w-3xl my-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div>
              <span className="tag mb-1 inline-flex capitalize">{mode}</span>
              <h2 className="font-display text-2xl tracking-widest" style={{ color: 'var(--text-primary)' }}>{TITLES[mode]}</h2>
            </div>
            <button onClick={onClose} className="p-2 transition-colors hover:text-red-400" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
          </div>

          {/* Scrollable body */}
          <div className="px-6 py-6 space-y-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>

            {/* Watcher alert badge — only shown when out-of-stock variants have watchers */}
            {watcherInfo?.outOfStockWithWatchers?.length > 0 && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded text-xs"
                style={{ background: 'rgba(124,58,255,0.08)', border: '1px solid rgba(124,58,255,0.25)', color: 'var(--purple)' }}>
                <Bell size={12} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">
                    {watcherInfo.outOfStockWithWatchers.reduce((s, v) => s + v.watcherCount, 0)} user{watcherInfo.outOfStockWithWatchers.reduce((s, v) => s + v.watcherCount, 0) !== 1 ? 's are' : ' is'} waiting for restock
                  </p>
                  <p className="text-[10px] font-mono" style={{ color: 'rgba(124,58,255,0.7)' }}>
                    {watcherInfo.outOfStockWithWatchers.map(v => `${v.variantTitle} (${v.watcherCount})`).join(' · ')}
                  </p>
                </div>
              </div>
            )}

            {/* Name + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label text="Product Name *" error={errors.name} />
                <Inp value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. KZ ZSN Pro X" />
              </div>
              <div>
                <Label text="Category" />
                <select value={form.category} onChange={e => { set('category', e.target.value); set('subCategory', ''); }}
                  className="w-full px-3 py-2 text-xs font-mono outline-none cursor-pointer"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '2px' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Sub-category */}
            <div>
              <Label text={form.category === 'iems' ? 'Brand' : 'Type'} />
              <select value={form.subCategory} onChange={e => set('subCategory', e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono outline-none cursor-pointer"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '2px' }}>
                <option value="">— Select {form.category === 'iems' ? 'brand' : 'type'} —</option>
                {form.category === 'iems'
                  ? IEM_BRANDS.map(b => <option key={b} value={b}>{b}</option>)
                  : ACCESSORY_SUBS.map(s => <option key={s} value={s}>{s}</option>)
                }
              </select>
            </div>

            {/* Description */}
            <div>
              <Label text="Description" />
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                placeholder="Short product description…"
                className="w-full px-3 py-2 text-xs font-body outline-none resize-none transition-all"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '2px' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aff')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            {/* Featured toggle */}
            <label className="flex items-center gap-3 cursor-pointer w-fit select-none">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                <div className="w-9 h-5 rounded-full transition-colors duration-200" style={{ background: form.featured ? '#7c3aff' : 'var(--border)' }} />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  style={{ transform: form.featured ? 'translateX(16px)' : 'none' }} />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Featured product</span>
            </label>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label text="Images *" error={errors.images} />
                <button onClick={addImage} className="flex items-center gap-1 text-[10px] font-mono text-purple-400 hover:text-purple-300 transition-colors">
                  <Plus size={10} /> Add URL
                </button>
              </div>
              <div className="space-y-2">
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-2">
                    <Inp value={img} onChange={e => setImage(i, e.target.value)} placeholder="https://…/image.jpg" />
                    {form.images.length > 1 && (
                      <button onClick={() => removeImage(i)} className="p-2 hover:text-red-400 transition-colors flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label text="Variants *" error={errors.variants} />
                <button onClick={addVariant} className="flex items-center gap-1 text-[10px] font-mono text-purple-400 hover:text-purple-300 transition-colors">
                  <Plus size={10} /> Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {form.variants.map((v, i) => (
                  <div key={i} className="p-3 border space-y-2" style={{ borderColor: 'var(--border)', borderRadius: '4px', background: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Variant {i + 1}</span>
                      {form.variants.length > 1 && (
                        <button onClick={() => removeVariant(i)} className="p-1 hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <Inp className="col-span-2" value={v.title} onChange={e => setVariant(i, 'title', e.target.value)} placeholder="e.g. Black, no mic" />
                      <Inp type="number" min="0" value={v.price} onChange={e => setVariant(i, 'price', e.target.value)} placeholder="Price (TND)" />
                      <Inp type="number" min="0" value={v.stock} onChange={e => setVariant(i, 'stock', e.target.value)} placeholder="Stock" />
                    </div>
                    <Inp value={v.image} onChange={e => setVariant(i, 'image', e.target.value)} placeholder="Variant image URL" />
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications (collapsible) */}
            <div>
              <button onClick={() => setSpecsOpen(o => !o)}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-muted)' }}>
                {specsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Specifications (optional)
              </button>
              {specsOpen && (
                <div className="p-3 border space-y-2" style={{ borderColor: 'var(--border)', borderRadius: '4px', background: 'var(--bg-secondary)' }}>
                  {Object.entries(form.specifications).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2 text-xs">
                      <span className="w-36 font-mono flex-shrink-0 truncate" style={{ color: 'var(--text-muted)' }}>{k}</span>
                      <span className="flex-1" style={{ color: 'var(--text-primary)' }}>{v}</span>
                      <button onClick={() => removeSpec(k)} className="p-1 hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}><X size={11} /></button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    <Inp value={specRow.key}   onChange={e => setSpecRow(s => ({ ...s, key:   e.target.value }))} placeholder="Key (e.g. Driver)" />
                    <Inp value={specRow.value} onChange={e => setSpecRow(s => ({ ...s, value: e.target.value }))} placeholder="Value" onKeyDown={e => e.key === 'Enter' && addSpec()} />
                    <button onClick={addSpec} className="px-3 flex-shrink-0 text-white text-xs hover:opacity-80 transition-opacity" style={{ background: '#7c3aff', borderRadius: '2px' }}>
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <button onClick={onClose} className="btn-outline text-xs px-5 py-2.5">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60 flex items-center gap-2">
              {loading && <div className="spinner !w-3 !h-3" />}
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : mode === 'duplicate' ? 'Duplicate' : 'Create Product'}
            </button>
          </div>

          {/* Notify Watchers Confirm Dialog */}
          {notifyConfirm && (() => {
            const affected = getAffectedWatcherVariants();
            const totalNotified = affected.reduce((s, v) => s + v.watcherCount, 0);
            return (
              <div className="absolute inset-0 flex items-center justify-center z-10 rounded" style={{ background: 'rgba(5,5,8,0.78)' }}>
                <div className="card-glass p-6 mx-6 w-full max-w-sm" style={{ borderTop: '2px solid var(--purple)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Bell size={18} className="text-purple-400 flex-shrink-0" />
                    <p className="font-display text-lg tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      Notify watchers?
                    </p>
                  </div>

                  {/* Per-variant breakdown */}
                  <div className="space-y-2 mb-4">
                    {affected.map(v => (
                      <div key={v.variantId} className="flex items-center justify-between px-3 py-2 rounded"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{v.variantTitle}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                          style={{ background: 'rgba(124,58,255,0.12)', color: 'var(--purple)' }}>
                          {v.watcherCount} waiting
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
                    Send a back-in-stock email to{' '}
                    <span className="font-semibold" style={{ color: 'var(--purple)' }}>
                      {totalNotified} user{totalNotified !== 1 ? 's' : ''}
                    </span>?
                  </p>

                  <div className="flex gap-3">
                    <button onClick={() => { setNotifyConfirm(false); doSave(true); }}
                      className="flex-1 btn-primary py-2.5 text-xs flex items-center justify-center gap-2">
                      <Bell size={12} /> Yes, notify {totalNotified}
                    </button>
                    <button onClick={() => { setNotifyConfirm(false); doSave(false); }}
                      className="flex-1 py-2.5 text-xs font-mono border transition-colors"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', borderRadius: '2px' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                      Save only
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
