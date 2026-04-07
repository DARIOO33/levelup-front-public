'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronDown, ChevronUp, ExternalLink, Package, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store';
import { ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:    { color: '#f59e0b', bg: '#f59e0b20', labelKey: 'orders.status_pending'    },
  processing: { color: '#3b82f6', bg: '#3b82f620', labelKey: 'orders.status_processing' },
  shipped:    { color: '#8b5cf6', bg: '#8b5cf620', labelKey: 'orders.status_shipped'    },
  delivered:  { color: '#22c55e', bg: '#22c55e20', labelKey: 'orders.status_delivered'  },
  cancelled:  { color: '#ef4444', bg: '#ef444420', labelKey: 'orders.status_cancelled'  },
};

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function StatusTracker({ status }) {
  const { t } = useTranslation();
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: '#ef444420', color: '#ef4444' }}>
          {t('orders.cancelled')}
        </span>
      </div>
    );
  }
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="mt-4 flex items-center">
      {STATUS_STEPS.map((step, i) => {
        const done   = i <= currentIdx;
        const active = i === currentIdx;
        const cfg    = STATUS_CONFIG[step];
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono border-2 transition-all"
                style={{ background: done ? cfg.color : 'transparent', borderColor: done ? cfg.color : 'var(--border)', color: done ? '#fff' : 'var(--text-muted)' }}>
                {done ? '✓' : i + 1}
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest whitespace-nowrap"
                style={{ color: active ? cfg.color : done ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                {step}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1 mt-[-14px]"
                style={{ background: i < currentIdx ? STATUS_CONFIG[STATUS_STEPS[i + 1]].color : 'var(--border)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const { t } = useTranslation();
  const [expanded, setExpanded]   = useState(false);
  const [reviews, setReviews]     = useState(null); // null = not loaded yet
  const [loadingRev, setLoadingRev] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  // Load review tokens when the user expands the card
  const handleExpand = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && reviews === null && (order.status === 'shipped' || order.status === 'delivered')) {
      setLoadingRev(true);
      try {
        const r = await ordersApi.getOrderReviews(order._id);
        setReviews(r.data.reviews || []);
      } catch {
        setReviews([]);
      } finally {
        setLoadingRev(false);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glass overflow-hidden">
      {/* Header row */}
      <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={handleExpand}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              #{order._id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider"
              style={{ background: cfg.bg, color: cfg.color }}>
              {t(cfg.labelKey)}
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
            </span>
            <span className="font-mono font-bold text-sm" style={{ color: 'var(--purple)' }}>
              {order.totalAmount} TND
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/orders/${order._id}`}
            onClick={e => e.stopPropagation()}
            className="p-1.5 rounded hover:text-purple-400 transition-colors"
            style={{ color: 'var(--text-muted)' }} title="Track order">
            <ExternalLink size={14} />
          </Link>
          {expanded ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </div>

      {/* Status tracker */}
      <div className="px-5 pb-4">
        <StatusTracker status={order.status} />
      </div>

      {/* Expanded: items + review buttons */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                {t('orders.items')}
              </p>

              {order.items?.map((item, i) => {
                // Find if there's a pending (unconsumed) review token for this item
                const reviewEntry = reviews?.find(
                  r => r.productName === item.productName && r.token
                );
                // Find if user already submitted a review for this item
                const submitted = reviews?.find(
                  r => r.productName === item.productName && !r.token && r.comment
                );

                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.productName}</p>
                      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.variantName} × {item.quantity}</p>
                    </div>

                    <div className="flex-shrink-0 ml-3">
                      {loadingRev && (
                        <div className="spinner !w-4 !h-4" />
                      )}
                      {!loadingRev && reviewEntry && (
                        <Link href={`/review/${reviewEntry.token}`}
                          className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 border-2 transition-all"
                          style={{ borderRadius: '2px', borderColor: 'var(--purple)', color: 'var(--purple)', background: 'rgba(124,58,255,0.06)' }}>
                          <Star size={12} /> {t('orders.leave_review')}
                        </Link>
                      )}
                      {!loadingRev && submitted && (
                        <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ background: '#22c55e20', color: '#22c55e' }}>
                          {t('orders.reviewed')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 flex flex-col gap-1 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                <p>📦 {order.customer?.address}</p>
                <p>📞 {order.customer?.phone}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MyOrdersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }
    ordersApi.getUserOrders(user._id || user.id)
      .then(r => setOrders(r.data.orders || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user, initialized]);

  if (!initialized || loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center"><div className="spinner" /></div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag size={22} className="text-purple-400" />
          <div>
            <h1 className="font-display text-3xl tracking-wider" style={{ color: 'var(--text-primary)' }}>{t('orders.title')}</h1>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {t('orders.count_other', { count: orders.length })}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card-glass p-16 text-center">
            <Package size={40} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
            <p className="font-display text-2xl tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>{t('orders.empty')}</p>
            <p className="text-xs font-mono mb-6" style={{ color: 'var(--text-muted)' }}>{t('orders.empty_sub')}</p>
            <Link href="/shop" className="btn-primary text-xs px-6 py-2.5">{t('orders.browse')}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => <OrderCard key={order._id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
