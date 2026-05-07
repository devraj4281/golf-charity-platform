export default function CharityLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-52 bg-muted rounded-2xl" />
          <div className="h-4 w-80 bg-muted rounded-xl" />
        </div>
        <div className="h-10 w-40 bg-muted rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-64 bg-muted rounded-[32px]" />
        <div className="h-64 bg-muted rounded-[32px]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 bg-muted rounded-[32px]" />
        <div className="h-80 bg-muted rounded-[32px]" />
      </div>
    </div>
  )
}
