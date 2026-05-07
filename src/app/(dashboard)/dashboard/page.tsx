import { requireUser } from '@/lib/auth/requireUser'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const user = await requireUser()
  const supabase = await createClient()

  // Fetch the latest active or upcoming draw
  const { data: latestDraw } = await supabase
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch last 5 user scores
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('entry_date', { ascending: false })
    .limit(5)

  // Fetch user winnings
  const { data: winningsData } = await supabase
    .from('winners')
    .select('prize_amount')
    .eq('user_id', user.id)
  
  const totalWinnings = winningsData?.reduce((acc, curr) => acc + curr.prize_amount, 0) || 0

  // Fetch total charity contributions
  const { data: charityData } = await supabase
    .from('prize_pool_ledger')
    .select('amount')
    .eq('user_id', user.id)
    .eq('entry_type', 'charity')

  const totalCharity = charityData?.reduce((acc, curr) => acc + curr.amount, 0) || 0

  return (
    <DashboardClient 
      profile={user.profile} 
      latestDraw={latestDraw || null}
      initialScores={scores || []}
      totalWinnings={totalWinnings}
      totalCharity={totalCharity}
    />
  )
}
