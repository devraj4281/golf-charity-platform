export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded-2xl" />
          <div className="h-4 w-48 bg-muted rounded-xl" />
        </div>
        <div className="h-10 w-40 bg-muted rounded-2xl" />
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Hero card */}
          <div className="h-72 bg-muted rounded-[32px]" />
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="h-32 bg-muted rounded-[32px]" />
            <div className="h-32 bg-muted rounded-[32px]" />
          </div>
          {/* Activity list */}
          <div className="space-y-4">
            <div className="h-6 w-40 bg-muted rounded-xl" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-[32px]" />
            ))}
          </div>
        </div>
        {/* Right column */}
        <div className="space-y-8">
          <div className="h-56 bg-muted rounded-[32px]" />
          <div className="h-72 bg-muted rounded-[32px]" />
        </div>
      </div>
    </div>
  )
}
