import { requireUser } from '@/lib/auth/requireUser'
import { SideNavBar } from '@/components/layout/SideNavBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()

  return (
    <div className="min-h-screen bg-background">
      <SideNavBar userRole={user.profile.role} />

      {/* Main content: offset to the right of the sidebar on md+, bottom offset for mobile nav + status bar */}
      <main className="md:pl-[calc(256px+1.5rem)] pb-24 md:pb-10 min-h-screen">
        {children}
      </main>

      <BottomNavBar />
    </div>
  )
}
