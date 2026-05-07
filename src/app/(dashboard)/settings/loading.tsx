export default function SettingsLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-36 bg-muted rounded-2xl" />
          <div className="h-4 w-60 bg-muted rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-[32px]" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-[32px]" />
      </div>
    </div>
  )
}
