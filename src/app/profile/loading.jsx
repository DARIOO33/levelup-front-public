export default function ProfileLoading() {
  return (
    <div className="min-h-screen pt-16 max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Avatar + name */}
      <div className="flex items-center gap-5 mb-10 animate-pulse">
        <div className="w-16 h-16 rounded-full" style={{ background: 'var(--border)' }} />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded" style={{ background: 'var(--border)' }} />
          <div className="h-3 w-32 rounded" style={{ background: 'var(--border)' }} />
        </div>
      </div>

      {/* Form fields */}
      <div className="card-glass p-6 space-y-5 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-20 rounded mb-1.5" style={{ background: 'var(--border)' }} />
            <div className="h-10 w-full rounded" style={{ background: 'var(--border)' }} />
          </div>
        ))}
        <div className="h-10 w-32 rounded" style={{ background: 'var(--border)' }} />
      </div>
    </div>
  );
}
