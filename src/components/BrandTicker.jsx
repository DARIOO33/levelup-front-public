'use client';

const BRANDS = [
  'KZ', '7HZ', 'Moondrop', 'Simgot', 'Truthear', 'LETSHUOER',
  'TinHiFi', 'Kinera', 'FiiO', 'Shanling', 'HIDIZS', 'Tangzu',
  'BLON', 'Kiwi Ears', 'CCA', 'Tripowin', 'Nicehck',
];

export default function BrandTicker() {
  const doubled = [...BRANDS, ...BRANDS];

  return (
    <div className="overflow-hidden py-4 relative" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, var(--bg-primary), transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, var(--bg-primary), transparent)' }}
      />
      <div className="ticker-track">
        {doubled.map((brand, i) => (
          <span key={i} className="flex items-center gap-3 flex-shrink-0">
            <span className="font-display text-2xl tracking-widest" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
              {brand}
            </span>
            <span style={{ color: 'var(--purple)', opacity: 0.4 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
