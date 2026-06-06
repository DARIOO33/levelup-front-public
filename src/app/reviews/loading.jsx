export default function ReviewsLoading() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero skeleton */}
      <div className="relative py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="h-4 w-28 rounded animate-pulse mx-auto" style={{ background: 'var(--border)' }} />
          <div className="h-10 w-64 rounded animate-pulse mx-auto" style={{ background: 'var(--border)' }} />
          <div className="h-3 w-48 rounded animate-pulse mx-auto" style={{ background: 'var(--border)' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Stats bar skeleton */}
        <div className="card-glass p-6 mb-8 flex items-center gap-6 animate-pulse">
          <div className="h-12 w-16 rounded" style={{ background: 'var(--border)' }} />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-32 rounded" style={{ background: 'var(--border)' }} />
            <div className="h-2 w-48 rounded" style={{ background: 'var(--border)' }} />
          </div>
        </div>

        {/* Filter bar skeleton */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded flex-shrink-0 animate-pulse" style={{ background: 'var(--border)' }} />
          ))}
        </div>

        {/* Review cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="card-glass p-6 animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 rounded" style={{ background: 'var(--border)' }} />
                <div className="h-4 w-16 rounded" style={{ background: 'var(--border)' }} />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded" style={{ background: 'var(--border)' }} />
                <div className="h-3 w-5/6 rounded" style={{ background: 'var(--border)' }} />
                <div className="h-3 w-4/6 rounded" style={{ background: 'var(--border)' }} />
              </div>
              <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="h-3 w-28 rounded" style={{ background: 'var(--border)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
