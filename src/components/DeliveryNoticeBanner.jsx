'use client';
import { PackageX } from 'lucide-react';
import { useSettingsStore } from '@/store';

export default function DeliveryNoticeBanner() {
  const { deliveryPaused, deliveryNotice, initialized } = useSettingsStore();

  if (!initialized || !deliveryPaused) return null;

  return (
    <div
      className="flex items-center justify-center gap-2.5 px-4 py-2.5 text-center"
      style={{
        background: 'rgba(245,158,11,0.1)',
        borderBottom: '1px solid rgba(245,158,11,0.2)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
        style={{ background: '#f59e0b' }}
      />
      <PackageX size={13} style={{ color: '#f59e0b', flexShrink: 0 }} />
      <p className="text-xs font-mono" style={{ color: '#f59e0b' }}>
        {deliveryNotice || 'Delivery is temporarily paused. Orders are not available right now.'}
      </p>
    </div>
  );
}
