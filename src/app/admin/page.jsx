'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Package, ShoppingBag, Activity, Star, Users,
  Check, X, DollarSign, Clock, Trash2, Plus, Pencil, Copy, Loader2,
  Eye, Search, Filter, Mail, Send, ChevronDown, Tag, MessageSquare, CheckCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ordersApi, productsApi, reviewsApi, activityApi, usersApi, marketingApi, couponApi, contactApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import ProductModal from '@/components/admin/ProductModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import UsersTab from '@/components/admin/UsersTab';

/* ── constants ─────────────────────────────────────────────────────────────── */
const STATUS_COLORS = {
  pending: '#f59e0b', processing: '#3b82f6',
  shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444',
};
const TABS = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { id: 'orders',    label: 'Orders',    icon: ShoppingBag     },
  { id: 'products',  label: 'Products',  icon: Package         },
  { id: 'users',     label: 'Users',     icon: Users           },
  { id: 'reviews',   label: 'Reviews',   icon: Star            },
  { id: 'activity',  label: 'Activity',  icon: Activity        },
  { id: 'marketing', label: 'Marketing', icon: Mail            },
  { id: 'coupons',   label: 'Coupons',   icon: Tag             },
  { id: 'messages',  label: 'Messages',  icon: MessageSquare   },
];

/* ── shared primitives ──────────────────────────────────────────────────────── */
const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest whitespace-nowrap"
    style={{ color: 'var(--text-muted)' }}>{children}</th>
);
const Td = ({ children, style }) => (
  <td className="px-4 py-3 text-xs font-mono" style={style}>{children}</td>
);
const StatusBadge = ({ status }) => (
  <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
    style={{ background: `${STATUS_COLORS[status]}20`, color: STATUS_COLORS[status], borderRadius: '2px' }}>
    {status}
  </span>
);
const IconBtn = ({ icon: Icon, label, onClick, hoverColor, disabled }) => (
  <button title={label} onClick={onClick} disabled={disabled}
    className="p-1.5 rounded transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
    style={{ color: 'var(--text-muted)' }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = hoverColor; }}
    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
    <Icon size={13} />
  </button>
);

/* Search + filter bar — shared across tabs */
function FilterBar({ search, onSearch, filters = [], placeholder = 'Search…' }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <div className="relative flex-1 min-w-[180px]">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-9 py-2 text-xs w-full"
        />
        {search && (
          <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            <X size={12} />
          </button>
        )}
      </div>
      {filters.map(f => (
        <select key={f.key} value={f.value} onChange={e => f.onChange(e.target.value)}
          className="input-field py-2 text-xs cursor-pointer"
          style={{ minWidth: 110 }}>
          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ))}
    </div>
  );
}

/* ── Global action lock ─────────────────────────────────────────────────────── */
function ActionOverlay({ active }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: 'rgba(5,5,8,0.6)', backdropFilter: 'blur(2px)' }}>
      <div className="card-glass px-8 py-5 flex items-center gap-4" style={{ borderTop: '2px solid var(--purple)' }}>
        <Loader2 size={20} className="text-purple-400 animate-spin" />
        <p className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>Processing…</p>
      </div>
    </div>
  );
}

/* ── Notify client dialog ────────────────────────────────────────────────────── */
function NotifyDialog({ open, order, onConfirm, onCancel }) {
  if (!open || !order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="card-glass p-6 w-full max-w-sm" style={{ borderTop: '2px solid var(--purple)' }}>
        <p className="font-display text-xl tracking-wider mb-1" style={{ color: 'var(--text-primary)' }}>Notify the client?</p>
        <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>Order #{order.orderId?.slice(0, 8).toUpperCase()}</p>
        <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
          Status → <span className="font-mono" style={{ color: 'var(--purple)' }}>{order.newStatus}</span>
          <br />Send a notification email to the customer?
        </p>
        <div className="flex gap-3">
          <button onClick={() => onConfirm(true)} className="flex-1 btn-primary py-2.5 text-xs">✓ Yes, notify</button>
          <button onClick={() => onConfirm(false)}
            className="flex-1 py-2.5 text-xs font-mono border transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', borderRadius: '2px' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            ✕ No, skip
          </button>
        </div>
        <button onClick={onCancel} className="w-full mt-2 text-xs font-mono py-1.5 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          Cancel status change
        </button>
      </div>
    </div>
  );
}

/* ── Order detail modal ──────────────────────────────────────────────────────── */
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  const cfg = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };
  const color = cfg[order.status] || cfg.pending;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
        className="card-glass overflow-hidden w-full max-w-lg max-h-[90vh] flex flex-col"
        style={{ borderTop: `2px solid ${color}` }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Order Details</p>
            <p className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>#{order._id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button onClick={onClose} className="p-1.5 hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}><X size={16} /></button>
          </div>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Customer</p>
            <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {[['Name', order.customer?.fullname], ['Email', order.customer?.email], ['Phone', order.customer?.phone], ['Address', order.customer?.address]].map(([k, v]) => (
                <p key={k}><span className="font-mono w-16 inline-block" style={{ color: 'var(--text-muted)' }}>{k}</span>{v}</p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Items</p>
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                {item.variantImage && <img src={item.variantImage} alt="" className="w-10 h-10 object-cover rounded flex-shrink-0" style={{ border: '1px solid var(--border)' }} referrerPolicy="no-referrer" crossOrigin="anonymous" />}
                <div className="flex-1">
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{item.productName}</p>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{item.variantName} × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total</p>
            <p className="font-mono font-bold text-lg" style={{ color: 'var(--purple)' }}>{order.totalAmount} TND</p>
          </div>
          <div className="text-[10px] font-mono space-y-1" style={{ color: 'var(--text-muted)' }}>
            <p>Placed: {new Date(order.createdAt).toLocaleString('en-GB')}</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="btn-outline text-xs px-5 py-2.5 w-full">Close</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, initialized } = useAuthStore();

  /* data */
  const [orders,   setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);

  /* ui */
  const [active,      setActive]      = useState('overview');
  const [modal,       setModal]       = useState(null);
  const [confirm,     setConfirm]     = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [actionBusy,  setActionBusy]  = useState(false);

  /* order */
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  /* manual review */
  const [manualOpen,    setManualOpen]    = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualForm,    setManualForm]    = useState({ name: '', rating: 5, comment: '', source: 'manual', productName: '', showName: true });

  /* ── per-tab search / filter state ── */
  const [orderSearch,  setOrderSearch]  = useState('');
  const [orderStatus,  setOrderStatus]  = useState('all');
  const [productSearch,setProductSearch]= useState('');
  const [productCat,   setProductCat]   = useState('all');
  const [productStock, setProductStock] = useState('all');
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStatus, setReviewStatus] = useState('all');  // all | approved | pending | waiting
  const [reviewRating, setReviewRating] = useState('all');
  const [activitySearch, setActivitySearch] = useState('');
  const [activityLabel,  setActivityLabel]  = useState('all');

  /* coupons */
  const [coupons,      setCoupons]      = useState([]);
  const [couponsLoaded,setCouponsLoaded]= useState(false);
  const [couponForm,   setCouponForm]   = useState({ code: '', type: 'percent', value: '', minOrderAmount: '', maxUses: '', expiresAt: '' });
  const [couponFormOpen, setCouponFormOpen] = useState(false);
  const [couponSaving, setCouponSaving] = useState(false);

  /* messages */
  const [messages,       setMessages]       = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  /* marketing */
  const [campaign, setCampaign] = useState({ subject: '', headline: '', body: '', ctaLabel: 'SHOP NOW', ctaUrl: '', productImageUrl: '', targetGroup: 'all' });
  const [audience, setAudience] = useState(null);
  const [campaignSending, setCampaignSending] = useState(false);

  /* load */
  useEffect(() => {
    if (!initialized) return;
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) { router.push('/'); return; }
    Promise.all([ordersApi.getAll(), productsApi.getAll(), reviewsApi.getAll(), activityApi.getAll()])
      .then(([o, p, r, a]) => {
        setOrders(o.data.orders     || []);
        setProducts(p.data.products || []);
        setReviews(r.data.reviews   || []);
        setActivity(a.data.activity || []);
      }).catch(() => toast.error('Failed to load admin data'))
        .finally(() => setLoading(false));
  }, [user, initialized]);

  /* load audience when marketing tab opens */
  useEffect(() => {
    if (active === 'marketing' && !audience) {
      marketingApi.getAudience().then(r => setAudience(r.data.audience)).catch(() => {});
    }
    if (active === 'coupons' && !couponsLoaded) {
      couponApi.getAll().then(r => { setCoupons(r.data.coupons || []); setCouponsLoaded(true); }).catch(() => {});
    }
    if (active === 'messages' && !messagesLoaded) {
      contactApi.getAll().then(r => { setMessages(r.data.messages || []); setMessagesLoaded(true); }).catch(() => {});
    }
  }, [active]);

  /* ── lock helper ── */
  const withLock = async (fn) => {
    if (actionBusy) return;
    setActionBusy(true);
    try { await fn(); } finally { setActionBusy(false); }
  };

  /* orders */
  const requestStatusChange = (id, newStatus) => { if (!actionBusy) setPendingStatusChange({ orderId: id, newStatus }); };
  const confirmStatusChange = (notifyClient) => {
    const snap = pendingStatusChange;
    setPendingStatusChange(null);
    withLock(async () => {
      await ordersApi.updateStatus(snap.orderId, snap.newStatus, notifyClient);
      setOrders(prev => prev.map(o => o._id === snap.orderId ? { ...o, status: snap.newStatus } : o));
      toast.success(`Status updated${notifyClient ? ' — client notified' : ''}`);
    }).catch(() => toast.error('Failed to update status'));
  };

  /* products */
  const openCreate    = () => { if (!actionBusy) setModal({ mode: 'create',    product: null }); };
  const openEdit      = (p) => { if (!actionBusy) setModal({ mode: 'edit',      product: p   }); };
  const openDuplicate = (p) => { if (!actionBusy) setModal({ mode: 'duplicate', product: p   }); };
  const handleProductSaved = (saved, action) => {
    if (action === 'update') setProducts(prev => prev.map(p => p._id === saved._id ? saved : p));
    else                     setProducts(prev => [saved, ...prev]);
  };
  const requestDelete = (p) => { if (!actionBusy) setConfirm({ id: p._id, name: p.name }); };
  const confirmDelete = () => {
    const snap = confirm; setConfirm(null);
    withLock(async () => {
      await productsApi.delete(snap.id);
      setProducts(prev => prev.filter(p => p._id !== snap.id));
      toast.success('Product deleted');
    }).catch(() => toast.error('Failed to delete product'));
  };

  /* reviews */
  const deleteReview  = (id) => withLock(async () => { await reviewsApi.delete(id); setReviews(prev => prev.filter(r => r._id !== id)); toast.success('Review deleted'); }).catch(() => toast.error('Failed'));
  const approveReview = (id, approved) => withLock(async () => { const res = await reviewsApi.update(id, { isApproved: approved }); setReviews(prev => prev.map(r => r._id === id ? res.data.review : r)); toast.success(approved ? 'Approved' : 'Unapproved'); }).catch(() => toast.error('Failed'));
  const createManualReview = () => {
    if (!manualForm.comment.trim() || !manualForm.rating) { toast.error('Rating and comment are required'); return; }
    setManualLoading(true);
    withLock(async () => {
      const res = await reviewsApi.create({ ...manualForm, isApproved: true });
      setReviews(prev => [res.data.review, ...prev]);
      setManualForm({ name: '', rating: 5, comment: '', source: 'manual', productName: '', showName: true });
      setManualOpen(false);
      toast.success('Review added');
    }).catch(() => toast.error('Failed')).finally(() => setManualLoading(false));
  };



  /* marketing */
  const sendCampaign = async () => {
    if (!campaign.subject || !campaign.headline || !campaign.body) { toast.error('Subject, headline and body are required'); return; }
    setCampaignSending(true);
    try {
      const res = await marketingApi.sendCampaign(campaign);
      toast.success(res.data.message);
      setCampaign({ subject: '', headline: '', body: '', ctaLabel: 'SHOP NOW', ctaUrl: '', productImageUrl: '', targetGroup: 'all' });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to send campaign'); }
    finally { setCampaignSending(false); }
  };

  /* coupons handlers */
  const saveCoupon = () => {
    if (!couponForm.code || !couponForm.value) { toast.error('Code and value are required'); return; }
    setCouponSaving(true);
    withLock(async () => {
      const payload = { code: couponForm.code.trim().toUpperCase(), type: couponForm.type, value: Number(couponForm.value), minOrderAmount: Number(couponForm.minOrderAmount || 0), maxUses: couponForm.maxUses ? Number(couponForm.maxUses) : null, expiresAt: couponForm.expiresAt || null };
      const res = await couponApi.create(payload);
      setCoupons(prev => [res.data.coupon, ...prev]);
      setCouponForm({ code: '', type: 'percent', value: '', minOrderAmount: '', maxUses: '', expiresAt: '' });
      setCouponFormOpen(false);
      toast.success('Coupon created');
    }).catch(e => toast.error(e.response?.data?.message || 'Failed')).finally(() => setCouponSaving(false));
  };
  const toggleCouponActive = (id, isActive) => withLock(async () => {
    const res = await couponApi.update(id, { isActive });
    setCoupons(prev => prev.map(c => c._id === id ? res.data.coupon : c));
    toast.success(isActive ? 'Coupon activated' : 'Coupon deactivated');
  }).catch(() => toast.error('Failed'));
  const deleteCouponItem = (id) => withLock(async () => {
    await couponApi.delete(id);
    setCoupons(prev => prev.filter(c => c._id !== id));
    toast.success('Coupon deleted');
  }).catch(() => toast.error('Failed'));

  /* messages handlers */
  const markMessageRead = (id) => withLock(async () => {
    await contactApi.markRead(id);
    setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
  }).catch(() => toast.error('Failed'));
  const deleteMessage = (id) => withLock(async () => {
    await contactApi.delete(id);
    setMessages(prev => prev.filter(m => m._id !== id));
    toast.success('Message deleted');
  }).catch(() => toast.error('Failed'));

  /* ── filtered data ── */
  const filteredOrders = useMemo(() => {
    const q = orderSearch.toLowerCase();
    return orders.filter(o => {
      if (orderStatus !== 'all' && o.status !== orderStatus) return false;
      if (!q) return true;
      return o._id.includes(q) || o.customer?.fullname?.toLowerCase().includes(q) || o.customer?.email?.toLowerCase().includes(q);
    });
  }, [orders, orderSearch, orderStatus]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase();
    return products.filter(p => {
      if (productCat !== 'all' && p.category !== productCat) return false;
      if (productStock === 'out') { const s = p.variants?.reduce((a, v) => a + v.stock, 0) || 0; if (s > 0) return false; }
      if (productStock === 'low') { const s = p.variants?.reduce((a, v) => a + v.stock, 0) || 0; if (s === 0 || s > 5) return false; }
      if (productStock === 'ok')  { const s = p.variants?.reduce((a, v) => a + v.stock, 0) || 0; if (s <= 5) return false; }
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.subCategory?.toLowerCase().includes(q);
    });
  }, [products, productSearch, productCat, productStock]);

  const filteredReviews = useMemo(() => {
    const q = reviewSearch.toLowerCase();
    return reviews.filter(r => {
      if (reviewStatus === 'approved' && !r.isApproved) return false;
      if (reviewStatus === 'pending'  &&  r.isApproved) return false;
      if (reviewStatus === 'waiting'  && !r.token)      return false;
      if (reviewRating !== 'all' && String(r.rating) !== reviewRating) return false;
      if (!q) return true;
      return (r.name || '').toLowerCase().includes(q) || (r.comment || '').toLowerCase().includes(q) || (r.productName || '').toLowerCase().includes(q);
    });
  }, [reviews, reviewSearch, reviewStatus, reviewRating]);

  const filteredActivity = useMemo(() => {
    const q = activitySearch.toLowerCase();
    return activity.filter(a => {
      if (activityLabel !== 'all' && a.label !== activityLabel) return false;
      if (!q) return true;
      return (a.content || '').toLowerCase().includes(q) || (a.user || '').toLowerCase().includes(q);
    });
  }, [activity, activitySearch, activityLabel]);

  /* derived */
  const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pending  = orders.filter(o => o.status === 'pending').length;

  if (!initialized || loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="spinner" /></div>;

  return (
    <div className="min-h-screen pt-16">
      <ActionOverlay active={actionBusy} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <span className="tag mb-2 inline-flex">Admin</span>
          <h1 className="font-display text-5xl tracking-widest" style={{ color: 'var(--text-primary)' }}>{t('admin.title')}</h1>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => !actionBusy && setActive(id)} disabled={actionBusy}
              className="flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex-shrink-0"
              style={{ borderRadius: '2px', background: active === id ? 'var(--purple)' : 'var(--bg-secondary)', color: active === id ? 'white' : 'var(--text-muted)', border: `1px solid ${active === id ? 'var(--purple)' : 'var(--border)'}` }}>
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ══ OVERVIEW ══ */}
          {active === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Orders',  value: orders.length,      icon: ShoppingBag, color: '#7c3aff' },
                  { label: 'Revenue (TND)', value: revenue.toFixed(0), icon: DollarSign,  color: '#22c55e' },
                  { label: 'Pending',       value: pending,            icon: Clock,       color: '#f59e0b' },
                  { label: 'Products',      value: products.length,    icon: Package,     color: '#3b82f6' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="card-glass p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</p>
                        <p className="font-display text-4xl mt-1 tracking-wide" style={{ color: 'var(--text-primary)' }}>{value}</p>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center" style={{ background: `${color}20`, borderRadius: '4px' }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="font-display text-2xl tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>Recent Orders</h2>
              <div className="card-glass overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      {['ID','Customer','Items','Total','Status'].map(h => <Th key={h}>{h}</Th>)}
                    </tr></thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o._id} className="border-b hover:bg-purple-500/5 transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <Td style={{ color: 'var(--text-muted)' }}>#{o._id.slice(0,8)}</Td>
                          <Td style={{ color: 'var(--text-primary)' }}>{o.customer?.fullname}</Td>
                          <Td style={{ color: 'var(--text-muted)' }}>{o.items?.length}</Td>
                          <Td style={{ color: '#7c3aff', fontWeight: 700 }}>{o.totalAmount} TND</Td>
                          <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && <p className="text-center py-10 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>No orders yet</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ ORDERS ══ */}
          {active === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FilterBar
                search={orderSearch} onSearch={setOrderSearch} placeholder="Search by ID, name or email…"
                filters={[{ key: 'status', value: orderStatus, onChange: setOrderStatus, options: [
                  { value: 'all', label: 'All statuses' },
                  ...['pending','processing','shipped','delivered','cancelled'].map(s => ({ value: s, label: s.charAt(0).toUpperCase()+s.slice(1) }))
                ]}]}
              />
              <p className="text-[10px] font-mono mb-3" style={{ color: 'var(--text-muted)' }}>{filteredOrders.length} / {orders.length} orders</p>
              <div className="card-glass overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      {['ID','Customer','Email','Items','Total','Status','Details','Change Status'].map(h => <Th key={h}>{h}</Th>)}
                    </tr></thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o._id} className="border-b hover:bg-purple-500/5 transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <Td style={{ color: 'var(--text-muted)' }}>#{o._id.slice(0,8)}</Td>
                          <Td style={{ color: 'var(--text-primary)' }}>{o.customer?.fullname}</Td>
                          <Td style={{ color: 'var(--text-muted)' }}>{o.customer?.email}</Td>
                          <Td style={{ color: 'var(--text-muted)' }}>{o.items?.length}</Td>
                          <Td style={{ color: '#7c3aff', fontWeight: 700 }}>{o.totalAmount} TND</Td>
                          <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                          <td className="px-4 py-3">
                            <IconBtn icon={Eye} label="View details" onClick={() => setOrderDetail(o)} hoverColor="#7c3aff" disabled={actionBusy} />
                          </td>
                          <td className="px-4 py-3">
                            <select value={o.status} onChange={e => requestStatusChange(o._id, e.target.value)} disabled={actionBusy}
                              className="text-[10px] px-2 py-1.5 outline-none cursor-pointer font-mono disabled:opacity-50"
                              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '2px' }}>
                              {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && <p className="text-center py-12 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{orders.length === 0 ? 'No orders yet' : 'No results match your filters'}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ PRODUCTS ══ */}
          {active === 'products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FilterBar
                search={productSearch} onSearch={setProductSearch} placeholder="Search products…"
                filters={[
                  { key: 'cat', value: productCat, onChange: setProductCat, options: [{ value: 'all', label: 'All categories' }, { value: 'iems', label: 'IEMs' }, { value: 'accessories', label: 'Accessories' }] },
                  { key: 'stock', value: productStock, onChange: setProductStock, options: [{ value: 'all', label: 'All stock' }, { value: 'ok', label: 'In stock' }, { value: 'low', label: 'Low stock (≤5)' }, { value: 'out', label: 'Out of stock' }] },
                ]}
              />
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{filteredProducts.length} / {products.length} products</p>
                <button onClick={openCreate} disabled={actionBusy} className="btn-primary text-xs px-4 py-2 flex items-center gap-2 disabled:opacity-50">
                  <Plus size={13} /> Add Product
                </button>
              </div>
              <div className="card-glass overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      {['Product','Category','Brand','Variants','Min Price','Featured','Stock','Actions'].map(h => <Th key={h}>{h}</Th>)}
                    </tr></thead>
                    <tbody>
                      {filteredProducts.map(p => {
                        const minPrice   = p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : 0;
                        const totalStock = p.variants?.reduce((s, v) => s + v.stock, 0) || 0;
                        return (
                          <tr key={p._id} className="border-b hover:bg-purple-500/5 transition-colors" style={{ borderColor: 'var(--border)' }}>
                            <Td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.name}</Td>
                            <td className="px-4 py-3"><span className="tag capitalize">{p.category}</span></td>
                            <Td style={{ color: 'var(--text-muted)' }}>{p.subCategory || '—'}</Td>
                            <Td style={{ color: 'var(--text-muted)' }}>{p.variants?.length}</Td>
                            <Td style={{ color: '#7c3aff', fontWeight: 700 }}>{minPrice} TND</Td>
                            <td className="px-4 py-3">{p.featured ? <Check size={14} className="text-green-400" /> : <X size={14} style={{ color: 'var(--text-muted)' }} />}</td>
                            <Td style={{ color: totalStock > 5 ? '#22c55e' : totalStock > 0 ? '#f59e0b' : '#ef4444' }}>{totalStock}</Td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-0.5">
                                <IconBtn icon={Pencil} label="Edit"      onClick={() => openEdit(p)}      hoverColor="#7c3aff" disabled={actionBusy} />
                                <IconBtn icon={Copy}   label="Duplicate" onClick={() => openDuplicate(p)} hoverColor="#3b82f6" disabled={actionBusy} />
                                <IconBtn icon={Trash2} label="Delete"    onClick={() => requestDelete(p)} hoverColor="#ef4444" disabled={actionBusy} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                      <p className="font-display text-2xl tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>{products.length === 0 ? 'No products yet' : 'No results match your filters'}</p>
                      {products.length === 0 && <button onClick={openCreate} disabled={actionBusy} className="btn-primary text-xs inline-flex items-center gap-2"><Plus size={13} /> Add First Product</button>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ USERS ══ */}
          {active === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UsersTab />
            </motion.div>
          )}

          {/* ══ REVIEWS ══ */}
          {active === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FilterBar
                search={reviewSearch} onSearch={setReviewSearch} placeholder="Search by name, product or comment…"
                filters={[
                  { key: 'status', value: reviewStatus, onChange: setReviewStatus, options: [{ value: 'all', label: 'All' }, { value: 'approved', label: 'Approved' }, { value: 'pending', label: 'Unapproved' }, { value: 'waiting', label: 'Awaiting submission' }] },
                  { key: 'rating', value: reviewRating, onChange: setReviewRating, options: [{ value: 'all', label: 'All ratings' }, ...['5','4','3','2','1'].map(n => ({ value: n, label: `${'★'.repeat(Number(n))} ${n}/5` }))] },
                ]}
              />
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  {filteredReviews.length} / {reviews.length} · {reviews.filter(r => r.isApproved).length} approved · {reviews.filter(r => r.token).length} pending
                </p>
                <button onClick={() => !actionBusy && setManualOpen(v => !v)} disabled={actionBusy}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-2 disabled:opacity-50">
                  <Plus size={13} /> Add Manually
                </button>
              </div>

              {manualOpen && (
                <div className="card-glass p-5 mb-4 space-y-4" style={{ borderTop: '2px solid var(--purple)' }}>
                  <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>New Manual Review</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[['Customer Name', 'name', 'text', 'e.g. Ahmed B.'], ['Product Name', 'productName', 'text', 'e.g. KZ ZSN Pro X']].map(([label, key, type, ph]) => (
                      <div key={key}>
                        <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
                        <input className="input-field text-xs" type={type} placeholder={ph} value={manualForm[key]} onChange={e => setManualForm(f => ({ ...f, [key]: e.target.value }))} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Rating</label>
                      <select className="input-field text-xs cursor-pointer" value={manualForm.rating} onChange={e => setManualForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} {n}/5</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Source</label>
                      <select className="input-field text-xs cursor-pointer" value={manualForm.source} onChange={e => setManualForm(f => ({ ...f, source: e.target.value }))}>
                        {['manual','website','instagram','tiktok','facebook'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Review Comment *</label>
                    <textarea className="input-field text-xs resize-none" rows={3} placeholder="Customer's review text…" value={manualForm.comment} onChange={e => setManualForm(f => ({ ...f, comment: e.target.value }))} maxLength={500} />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-purple-500" checked={manualForm.showName} onChange={e => setManualForm(f => ({ ...f, showName: e.target.checked }))} />
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Show name publicly</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button onClick={createManualReview} disabled={manualLoading || actionBusy} className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60 flex items-center gap-2">
                      {manualLoading && <div className="spinner !w-3 !h-3" />} Save Review
                    </button>
                    <button onClick={() => setManualOpen(false)} className="btn-outline text-xs px-5 py-2.5">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {filteredReviews.map(r => (
                  <div key={r._id} className="card-glass p-4 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-mono font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.showName !== false && r.name ? r.name : 'Anonymous'}</p>
                        <span className="tag capitalize">{r.source}</span>
                        {r.rating > 0 && <span className="text-[10px] font-mono" style={{ color: '#7c3aff' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>}
                        {r.productName && <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>· {r.productName}</span>}
                        {r.token && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>PENDING</span>}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {r.comment || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Waiting for customer submission…</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!r.token && (
                        <button onClick={() => approveReview(r._id, !r.isApproved)} disabled={actionBusy}
                          className="text-[10px] font-mono px-3 py-1.5 border transition-all disabled:opacity-50"
                          style={{ borderRadius: '2px', borderColor: r.isApproved ? '#22c55e' : 'var(--border)', color: r.isApproved ? '#22c55e' : 'var(--text-muted)' }}>
                          {r.isApproved ? '✓ Approved' : 'Approve'}
                        </button>
                      )}
                      <IconBtn icon={Trash2} label="Delete" onClick={() => deleteReview(r._id)} hoverColor="#ef4444" disabled={actionBusy} />
                    </div>
                  </div>
                ))}
                {filteredReviews.length === 0 && <p className="text-center py-12 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{reviews.length === 0 ? 'No reviews yet' : 'No results match your filters'}</p>}
              </div>
            </motion.div>
          )}

          {/* ══ ACTIVITY ══ */}
          {active === 'activity' && (
            <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FilterBar
                search={activitySearch} onSearch={setActivitySearch} placeholder="Search activity…"
                filters={[{ key: 'label', value: activityLabel, onChange: setActivityLabel, options: [{ value: 'all', label: 'All actions' }, { value: 'Admin Action', label: 'Admin Actions' }, { value: 'User Action', label: 'User Actions' }] }]}
              />
              <p className="text-[10px] font-mono mb-3" style={{ color: 'var(--text-muted)' }}>{filteredActivity.length} / {activity.length} entries</p>
              <div className="space-y-2">
                {filteredActivity.map((a, i) => (
                  <div key={a._id || i} className="card-glass px-5 py-3 flex items-center gap-4">
                    <span className="tag flex-shrink-0" style={{ color: a.label === 'Admin Action' ? 'var(--purple)' : 'var(--text-muted)', borderColor: a.label === 'Admin Action' ? 'rgba(124,58,255,0.3)' : 'var(--border)' }}>{a.label}</span>
                    <p className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{a.content}</p>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{a.user}</p>
                      <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {filteredActivity.length === 0 && <p className="text-center py-12 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{activity.length === 0 ? 'No activity recorded' : 'No results match your filters'}</p>}
              </div>
            </motion.div>
          )}

          {/* ══ MARKETING ══ */}
          {active === 'marketing' && (
            <motion.div key="marketing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Audience stats */}
              {audience && (
                <div className="mb-8 space-y-3">
                  {/* Top row — totals */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Total Reach',      value: audience.totalCount,       color: '#22c55e' },
                      { label: 'Registered Users', value: audience.registeredCount,  color: '#7c3aff' },
                      { label: 'Guest Customers',  value: audience.guestCount,       color: '#3b82f6' },
                      { label: 'Subscribers',      value: audience.subscriberCount,  color: '#ec4899' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="card-glass p-4">
                        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</p>
                        <p className="font-display text-3xl mt-1 tracking-wide" style={{ color }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Bottom row — registered segments */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'No orders yet',  value: audience.noOrdersCount,    color: '#f59e0b', key: 'no_orders'    },
                      { label: 'Single order',   value: audience.singleOrderCount, color: '#8b5cf6', key: 'single_order' },
                      { label: '2–4 orders',     value: audience.returningCount,   color: '#3b82f6', key: 'returning'    },
                      { label: '5+ orders',      value: audience.loyalCount,       color: '#22c55e', key: 'loyal'        },
                    ].map(({ label, value, color, key }) => (
                      <div key={key} className="card-glass p-3 cursor-pointer transition-all"
                        onClick={() => setCampaign(c => ({ ...c, targetGroup: key }))}
                        style={{ borderColor: campaign.targetGroup === key ? color : 'var(--border)', borderWidth: '1px', borderStyle: 'solid' }}>
                        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</p>
                        <p className="font-display text-2xl mt-0.5 tracking-wide" style={{ color }}>{value}</p>
                        {campaign.targetGroup === key && (
                          <p className="text-[9px] font-mono mt-1" style={{ color }}>● selected</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Campaign composer */}
              <div className="card-glass p-6 space-y-5" style={{ borderTop: '2px solid var(--purple)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <Send size={16} className="text-purple-400" />
                  <p className="font-display text-xl tracking-wider" style={{ color: 'var(--text-primary)' }}>New Campaign</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Subject *</label>
                    <input className="input-field text-xs" placeholder="🎧 New Drop: KZ ZSN Pro X is here!" value={campaign.subject} onChange={e => setCampaign(c => ({ ...c, subject: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Headline *</label>
                    <input className="input-field text-xs" placeholder="New Drop Available Now" value={campaign.headline} onChange={e => setCampaign(c => ({ ...c, headline: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>CTA Button Label</label>
                    <input className="input-field text-xs" placeholder="SHOP NOW" value={campaign.ctaLabel} onChange={e => setCampaign(c => ({ ...c, ctaLabel: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>CTA URL</label>
                    <input className="input-field text-xs" placeholder="/shop or https://…" value={campaign.ctaUrl} onChange={e => setCampaign(c => ({ ...c, ctaUrl: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Product / Hero Image URL (optional)</label>
                    <input className="input-field text-xs" placeholder="https://…/product.jpg" value={campaign.productImageUrl} onChange={e => setCampaign(c => ({ ...c, productImageUrl: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Body *</label>
                  <textarea className="input-field text-xs resize-none" rows={5} placeholder="Write your message here. You can use line breaks for paragraphs." value={campaign.body} onChange={e => setCampaign(c => ({ ...c, body: e.target.value }))} maxLength={1500} />
                  <p className="text-[10px] font-mono mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{campaign.body.length}/1500</p>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Send To</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all',          label: `Everyone`,                                              count: audience?.totalCount          },
                      { value: 'registered',   label: `All registered`,                                        count: audience?.registeredCount     },
                      { value: 'guests',       label: `Guests only`,                                           count: audience?.guestCount          },
                      { value: 'subscribers',  label: `Subscribers only`,                                      count: audience?.subscriberCount     },
                      { value: 'no_orders',    label: `No orders yet`,                                         count: audience?.noOrdersCount       },
                      { value: 'single_order', label: `Single order`,                                          count: audience?.singleOrderCount    },
                      { value: 'returning',    label: `2–4 orders`,                                            count: audience?.returningCount      },
                      { value: 'loyal',        label: `5+ orders`,                                             count: audience?.loyalCount          },
                    ].map(opt => {
                      const active = campaign.targetGroup === opt.value;
                      return (
                        <button key={opt.value} onClick={() => setCampaign(c => ({ ...c, targetGroup: opt.value }))}
                          className="text-xs font-mono px-3 py-1.5 border transition-all flex items-center gap-1.5"
                          style={{ borderRadius: '2px', borderColor: active ? 'var(--purple)' : 'var(--border)', color: active ? 'var(--purple)' : 'var(--text-muted)', background: active ? 'rgba(124,58,255,0.08)' : 'transparent' }}>
                          {opt.label}
                          {opt.count !== undefined && (
                            <span className="text-[10px] px-1 rounded" style={{ background: active ? 'rgba(124,58,255,0.15)' : 'var(--bg-secondary)' }}>
                              {opt.count ?? '—'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={sendCampaign} disabled={campaignSending || !campaign.subject || !campaign.headline || !campaign.body}
                    className="btn-primary text-xs px-6 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {campaignSending ? <><div className="spinner !w-3 !h-3" /> Sending…</> : <><Send size={13} /> Send Campaign</>}
                  </button>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Emails are sent in the background. This may take a few minutes for large audiences.
                  </p>
                </div>
              </div>
            </motion.div>
          )}


          {/* ══ COUPONS ══ */}
          {active === 'coupons' && (
            <motion.div key="coupons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{coupons.length} coupon{coupons.length !== 1 ? 's' : ''}</p>
                <button onClick={() => setCouponFormOpen(v => !v)} disabled={actionBusy}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-2 disabled:opacity-50">
                  <Plus size={13} /> New Coupon
                </button>
              </div>

              {couponFormOpen && (
                <div className="card-glass p-5 mb-5 space-y-4" style={{ borderTop: '2px solid var(--purple)' }}>
                  <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Create Coupon</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Code *</label>
                      <input className="input-field text-xs uppercase" placeholder="SUMMER10"
                        value={couponForm.code} onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
                      <select className="input-field text-xs cursor-pointer" value={couponForm.type} onChange={e => setCouponForm(f => ({ ...f, type: e.target.value }))}>
                        <option value="percent">% Percent</option>
                        <option value="fixed">TND Fixed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Value *</label>
                      <input className="input-field text-xs" type="number" min="0" placeholder={couponForm.type === 'percent' ? '10' : '5'}
                        value={couponForm.value} onChange={e => setCouponForm(f => ({ ...f, value: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Min Order (TND)</label>
                      <input className="input-field text-xs" type="number" min="0" placeholder="0"
                        value={couponForm.minOrderAmount} onChange={e => setCouponForm(f => ({ ...f, minOrderAmount: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Max Uses</label>
                      <input className="input-field text-xs" type="number" min="1" placeholder="Unlimited"
                        value={couponForm.maxUses} onChange={e => setCouponForm(f => ({ ...f, maxUses: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Expires</label>
                      <input className="input-field text-xs" type="date"
                        value={couponForm.expiresAt} onChange={e => setCouponForm(f => ({ ...f, expiresAt: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={saveCoupon} disabled={couponSaving || actionBusy}
                      className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60 flex items-center gap-2">
                      {couponSaving && <div className="spinner !w-3 !h-3" />} Create Coupon
                    </button>
                    <button onClick={() => setCouponFormOpen(false)} className="btn-outline text-xs px-5 py-2.5">Cancel</button>
                  </div>
                </div>
              )}

              <div className="card-glass overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      {['Code','Type','Value','Min Order','Uses','Expires','Active','Actions'].map(h => <Th key={h}>{h}</Th>)}
                    </tr></thead>
                    <tbody>
                      {coupons.map(c => {
                        const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                        return (
                          <tr key={c._id} className="border-b hover:bg-purple-500/5 transition-colors" style={{ borderColor: 'var(--border)', opacity: (!c.isActive || expired) ? 0.5 : 1 }}>
                            <Td style={{ color: 'var(--purple)', fontWeight: 700 }}>{c.code}</Td>
                            <Td style={{ color: 'var(--text-muted)' }}>{c.type === 'percent' ? '%' : 'TND'}</Td>
                            <Td style={{ color: 'var(--text-primary)' }}>{c.value}{c.type === 'percent' ? '%' : ' TND'}</Td>
                            <Td style={{ color: 'var(--text-muted)' }}>{c.minOrderAmount > 0 ? `${c.minOrderAmount} TND` : '—'}</Td>
                            <Td style={{ color: 'var(--text-muted)' }}>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</Td>
                            <Td style={{ color: expired ? '#ef4444' : 'var(--text-muted)' }}>
                              {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-GB') : '∞'}
                            </Td>
                            <td className="px-4 py-3">
                              <button onClick={() => toggleCouponActive(c._id, !c.isActive)} disabled={actionBusy}
                                className="text-[10px] font-mono px-2.5 py-1 border transition-all disabled:opacity-50"
                                style={{ borderRadius: '2px', borderColor: c.isActive ? '#22c55e' : 'var(--border)', color: c.isActive ? '#22c55e' : 'var(--text-muted)' }}>
                                {c.isActive ? '● On' : '○ Off'}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <IconBtn icon={Trash2} label="Delete coupon" onClick={() => deleteCouponItem(c._id)} hoverColor="#ef4444" disabled={actionBusy} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {coupons.length === 0 && <p className="text-center py-12 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>No coupons yet</p>}
                </div>
              </div>
            </motion.div>
          )}


          {/* ══ MESSAGES ══ */}
          {active === 'messages' && (
            <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-[10px] font-mono mb-5" style={{ color: 'var(--text-muted)' }}>
                {messages.length} total · {messages.filter(m => !m.isRead).length} unread
              </p>
              <div className="space-y-3">
                {messages.map(m => (
                  <div key={m._id} className="card-glass p-5 flex items-start gap-4"
                    style={{ borderLeft: `2px solid ${m.isRead ? 'var(--border)' : 'var(--purple)'}` }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <p className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                        <a href={`mailto:${m.email}`} className="text-xs font-mono hover:text-purple-400 transition-colors" style={{ color: 'var(--text-muted)' }}>{m.email}</a>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(m.createdAt).toLocaleString('en-GB')}</span>
                        {!m.isRead && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,255,0.15)', color: 'var(--purple)' }}>NEW</span>}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{m.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!m.isRead && (
                        <IconBtn icon={CheckCheck} label="Mark as read" onClick={() => markMessageRead(m._id)} hoverColor="#22c55e" disabled={actionBusy} />
                      )}
                      <a href={`mailto:${m.email}?subject=Re: Your message to Level Up TN`}
                        className="p-1.5 rounded transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#7c3aff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Reply by email">
                        <Mail size={13} />
                      </a>
                      <IconBtn icon={Trash2} label="Delete message" onClick={() => deleteMessage(m._id)} hoverColor="#ef4444" disabled={actionBusy} />
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-center py-12 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>No messages yet</p>}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <AnimatePresence>{orderDetail && <OrderDetailModal order={orderDetail} onClose={() => setOrderDetail(null)} />}</AnimatePresence>
      <NotifyDialog open={!!pendingStatusChange} order={pendingStatusChange} onConfirm={confirmStatusChange} onCancel={() => setPendingStatusChange(null)} />
      {modal && <ProductModal mode={modal.mode} product={modal.product} onClose={() => setModal(null)} onSaved={handleProductSaved} />}
      <ConfirmDialog open={!!confirm} title="Delete Product" message={`Are you sure you want to permanently delete "${confirm?.name}"? This cannot be undone.`} confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => setConfirm(null)} danger />
    </div>
  );
}
