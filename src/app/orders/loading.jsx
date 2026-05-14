export default function OrdersLoading() {
  return (
    <div className="min-h-screen pt-16 max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="h-4 w-16 rounded animate-pulse mb-2" style={{ background: 'var(--border)' }} />
      <div className="h-10 w-40 rounded animate-pulse mb-8" style={{ background: 'var(--border)' }} />

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-glass p-5 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-28 rounded" style={{ background: 'var(--border)' }} />
              <div className="h-5 w-20 rounded" style={{ background: 'var(--border)' }} />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-1/2 rounded" style={{ background: 'var(--border)' }} />
              <div className="h-3 w-1/3 rounded" style={{ background: 'var(--border)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
