'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { ordersApi } from '@/lib/api';

const STATUS_CONFIG = {
  pending:    { color: '#f59e0b', bg: '#f59e0b15', Icon: Clock,       label: 'Order Pending',    desc: 'Your order has been received and is awaiting confirmation.'      },
  processing: { color: '#3b82f6', bg: '#3b82f615', Icon: RefreshCw,   label: 'Processing',       desc: 'Your order is being prepared and packed by our team.'             },
  shipped:    { color: '#8b5cf6', bg: '#8b5cf615', Icon: Truck,       label: 'Shipped',          desc: 'Your order is on its way! Expect delivery soon.'                  },
  delivered:  { color: '#22c55e', bg: '#22c55e15', Icon: CheckCircle, label: 'Delivered',        desc: 'Your order has been delivered. Enjoy your purchase!'              },
  cancelled:  { color: '#ef4444', bg: '#ef444415', Icon: XCircle,     label: 'Cancelled',        desc: 'This order has been cancelled. Contact us if you have questions.' },
};

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function Timeline({ status }) {
  const isCancelled = status === 'cancelled';
  const currentIdx  = STATUS_STEPS.indexOf(status);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-5 bottom-0 w-px" style={{ background: 'var(--border)' }} />

      <div className="space-y-0">
        {STATUS_STEPS.map((step, i) => {
          const cfg      = STATUS_CONFIG[step];
          const done     = !isCancelled && i <= currentIdx;
          const active   = !isCancelled && i === currentIdx;
          const Icon     = cfg.Icon;

          return (
            <div key={step} className="flex items-start gap-5 pb-8 last:pb-0 relative">
              {/* Circle */}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all"
                style={{
                  background:  done ? cfg.color : 'var(--bg-secondary)',
                  borderColor: done ? cfg.color : 'var(--border)',
                }}>
                <Icon size={16} style={{ color: done ? '#fff' : 'var(--text-muted)' }}
                  className={active ? 'animate-pulse' : ''} />
              </div>
              {/* Content */}
              <div className="pt-1.5">
                <p className="text-sm font-mono font-semibold"
                  style={{ color: active ? cfg.color : done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {cfg.label}
                </p>
                {(done || active) && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cfg.desc}</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Cancelled step */}
        {isCancelled && (
          <div className="flex items-start gap-5 relative">
            <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center"
              style={{ background: '#ef4444', borderColor: '#ef4444' }}>
              <XCircle size={16} style={{ color: '#fff' }} />
            </div>
            <div className="pt-1.5">
              <p className="text-sm font-mono font-semibold" style={{ color: '#ef4444' }}>Cancelled</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{STATUS_CONFIG.cancelled.desc}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  const { id }                    = useParams();
  const [order, setOrder]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);

  useEffect(() => {
    ordersApi.track(id)
      .then(r => setOrder(r.data.order))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="spinner" /></div>;

  if (notFound) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 px-4">
      <Package size={48} className="opacity-20" style={{ color: 'var(--text-muted)' }} />
      <p className="font-display text-3xl tracking-wider" style={{ color: 'var(--text-muted)' }}>Order Not Found</p>
      <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Check the order ID and try again.</p>
      <Link href="/" className="btn-primary text-xs px-6 py-2.5 mt-2">Go Home</Link>
    </div>
  );

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const { Icon: StatusIcon } = cfg;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        <Link href="/orders" className="inline-flex items-center gap-2 text-xs font-mono mb-8 hover:text-purple-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={13} /> Back to My Orders
        </Link>

        {/* Status hero card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card-glass p-6 mb-6 flex items-center gap-5"
          style={{ borderTop: `2px solid ${cfg.color}` }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: cfg.bg }}>
            <StatusIcon size={24} style={{ color: cfg.color }} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>
              Order #{id.slice(0, 8).toUpperCase()}
            </p>
            <p className="font-display text-2xl tracking-wider" style={{ color: cfg.color }}>{cfg.label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cfg.desc}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card-glass p-6">
            <p className="text-[10px] font-mono uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>
              Tracking Timeline
            </p>
            <Timeline status={order.status} />
          </motion.div>

          {/* Order summary */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="card-glass p-5">
              <p className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Order Summary</p>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--text-primary)' }}>{item.productName}</span>
                    <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{item.variantName} × {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Total</span>
                <span className="font-mono font-bold" style={{ color: 'var(--purple)' }}>{order.totalAmount} TND</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="card-glass p-5">
              <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Details</p>
              <div className="space-y-1.5 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                <p>👤 {order.customer?.fullname}</p>
                <p>📅 {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <p>🕒 Last updated: {new Date(order.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
