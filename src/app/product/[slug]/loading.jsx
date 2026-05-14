export default function ProductLoading() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image gallery skeleton */}
          <div className="space-y-3 animate-pulse">
            <div className="aspect-square rounded" style={{ background: 'var(--border)' }} />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded flex-shrink-0" style={{ background: 'var(--border)' }} />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="space-y-5 animate-pulse">
            <div className="h-4 w-24 rounded" style={{ background: 'var(--border)' }} />
            <div className="h-10 w-3/4 rounded" style={{ background: 'var(--border)' }} />
            <div className="h-8 w-32 rounded" style={{ background: 'var(--border)' }} />
            <div className="space-y-2">
              <div className="h-3 w-full rounded" style={{ background: 'var(--border)' }} />
              <div className="h-3 w-5/6 rounded" style={{ background: 'var(--border)' }} />
              <div className="h-3 w-4/6 rounded" style={{ background: 'var(--border)' }} />
            </div>
            {/* Variant pills */}
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 w-24 rounded" style={{ background: 'var(--border)' }} />
              ))}
            </div>
            <div className="h-12 w-full rounded" style={{ background: 'var(--border)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
