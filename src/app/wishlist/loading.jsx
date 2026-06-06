export default function WishlistLoading() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-4 w-20 rounded animate-pulse mb-2" style={{ background: 'var(--border)' }} />
        <div className="h-10 w-44 rounded animate-pulse mb-10" style={{ background: 'var(--border)' }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card-glass overflow-hidden animate-pulse">
              <div className="aspect-square" style={{ background: 'var(--border)' }} />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded" style={{ background: 'var(--border)' }} />
                <div className="h-3 w-1/2 rounded" style={{ background: 'var(--border)' }} />
                <div className="h-5 w-1/3 rounded mt-2" style={{ background: 'var(--border)' }} />
                <div className="h-9 w-full rounded mt-3" style={{ background: 'var(--border)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
