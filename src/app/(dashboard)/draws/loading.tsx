export default function DrawsLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 bg-muted rounded-2xl" />
          <div className="h-4 w-72 bg-muted rounded-xl" />
        </div>
        <div className="h-10 w-36 bg-muted rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-muted rounded-[32px]" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-[32px]" />
        ))}
      </div>
    </div>
  )
}
