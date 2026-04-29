import { requireUser } from '@/lib/auth/requireUser'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const user = await requireUser()

  return (
    <div className="min-h-screen bg-black">
      {/* 
        We pass down the seamlessly authenticated profile we retrieved 
        securely from the server via the layout guards!
      */}
      <DashboardClient profile={user.profile} />
    </div>
  )
}
