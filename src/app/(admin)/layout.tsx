import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminNavBar } from '@/components/layout/AdminNavBar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-background">
      <AdminNavBar />
      
      {/* Main Content Area */}
      <main className="md:pl-64 pb-20 md:pb-0 min-h-screen bg-background">
        {children}
      </main>
    </div>
  )
}

