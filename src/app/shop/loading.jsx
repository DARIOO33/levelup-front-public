export default function ShopLoading() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero banner skeleton */}
      <div className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-4 w-24 rounded animate-pulse mb-3" style={{ background: 'var(--border)' }} />
          <div className="h-10 w-64 rounded animate-pulse mb-2" style={{ background: 'var(--border)' }} />
          <div className="h-3 w-32 rounded animate-pulse" style={{ background: 'var(--border)' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-8">
          <div className="h-10 flex-1 rounded animate-pulse" style={{ background: 'var(--border)' }} />
          <div className="h-10 w-52 rounded animate-pulse" style={{ background: 'var(--border)' }} />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card-glass overflow-hidden animate-pulse">
              <div className="aspect-square" style={{ background: 'var(--border)' }} />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded" style={{ background: 'var(--border)' }} />
                <div className="h-3 w-1/2 rounded" style={{ background: 'var(--border)' }} />
                <div className="h-5 w-1/3 rounded mt-3" style={{ background: 'var(--border)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
