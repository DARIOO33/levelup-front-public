'use client';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, danger = true }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
        onClick={e => e.target === e.currentTarget && onCancel()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.94, y: 8  }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-sm p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px' }}
        >
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{ background: danger ? 'rgba(239,68,68,0.12)' : 'rgba(124,58,255,0.12)', borderRadius: '4px' }}>
              <AlertTriangle size={18} style={{ color: danger ? '#ef4444' : '#7c3aff' }} />
            </div>
            <div>
              <h3 className="font-display text-xl tracking-wide" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{message}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={onCancel} className="btn-outline text-xs px-4 py-2">Cancel</button>
            <button onClick={onConfirm}
              className="text-xs px-4 py-2 font-semibold text-white transition-all hover:opacity-90 flex items-center gap-2"
              style={{ background: danger ? '#ef4444' : '#7c3aff', borderRadius: '2px', clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
