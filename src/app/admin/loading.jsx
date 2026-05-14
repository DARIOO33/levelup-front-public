export default function AdminLoading() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Page title skeleton */}
        <div className="mb-8">
          <div className="h-4 w-16 rounded animate-pulse mb-2" style={{ background: 'var(--border)' }} />
          <div className="h-12 w-48 rounded animate-pulse" style={{ background: 'var(--border)' }} />
        </div>

        {/* Tab bar skeleton */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-8 w-24 flex-shrink-0 rounded animate-pulse" style={{ background: 'var(--border)' }} />
          ))}
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-glass p-5 animate-pulse">
              <div className="h-3 w-20 rounded mb-2" style={{ background: 'var(--border)' }} />
              <div className="h-10 w-16 rounded" style={{ background: 'var(--border)' }} />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="card-glass overflow-hidden">
          <div className="p-4 border-b animate-pulse" style={{ borderColor: 'var(--border)' }}>
            <div className="h-4 w-32 rounded" style={{ background: 'var(--border)' }} />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3 border-b animate-pulse" style={{ borderColor: 'var(--border)' }}>
              {Array.from({ length: 5 }).map((__, j) => (
                <div key={j} className="h-3 rounded flex-1" style={{ background: 'var(--border)' }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
