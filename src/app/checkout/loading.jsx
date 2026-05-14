export default function CheckoutLoading() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-4 w-28 rounded animate-pulse mb-2" style={{ background: 'var(--border)' }} />
        <div className="h-10 w-48 rounded animate-pulse mb-10" style={{ background: 'var(--border)' }} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form skeleton */}
          <div className="lg:col-span-3 space-y-5 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-20 rounded mb-1.5" style={{ background: 'var(--border)' }} />
                <div className="h-10 w-full rounded" style={{ background: 'var(--border)' }} />
              </div>
            ))}
          </div>

          {/* Summary skeleton */}
          <div className="lg:col-span-2 animate-pulse">
            <div className="card-glass p-5">
              <div className="h-6 w-32 rounded mb-4" style={{ background: 'var(--border)' }} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded flex-shrink-0" style={{ background: 'var(--border)' }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 rounded" style={{ background: 'var(--border)' }} />
                    <div className="h-2 w-1/2 rounded" style={{ background: 'var(--border)' }} />
                  </div>
                </div>
              ))}
              <div className="h-12 w-full rounded mt-4" style={{ background: 'var(--border)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
