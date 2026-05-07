export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted" />
            <div className="h-3 w-32 bg-muted rounded-xl" />
          </div>
          <div className="h-12 w-72 bg-muted rounded-2xl" />
          <div className="h-4 w-96 bg-muted rounded-xl" />
        </div>
        <div className="flex gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-end gap-1">
              <div className="h-2 w-20 bg-muted rounded" />
              <div className="h-7 w-14 bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick action cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-muted rounded-[32px]" />
        ))}
      </div>

      {/* Bottom grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-muted rounded-[32px]" />
        <div className="h-80 bg-muted rounded-[32px]" />
      </div>
    </div>
  )
}
