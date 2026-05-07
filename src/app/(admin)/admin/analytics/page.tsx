import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { AdminAnalyticsClient } from '@/components/admin/AdminAnalyticsClient'

export default async function AdminAnalyticsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: activeUsers },
    { data: ledger },
    { data: draws },
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('prize_pool_ledger').select('entry_type, amount'),
    supabase.from('draws').select('draw_month, total_pool, status').order('draw_month', { ascending: false }).limit(12),
  ])

  const totalRevenue = ledger?.filter(l => l.entry_type === 'subscription').reduce((s, l) => s + l.amount, 0) ?? 0
  const totalCharity = ledger?.filter(l => l.entry_type === 'charity').reduce((s, l) => s + l.amount, 0) ?? 0
  const totalPrizes  = ledger?.filter(l => l.entry_type === 'prize_out').reduce((s, l) => s + l.amount, 0) ?? 0

  return (
    <AdminAnalyticsClient
      totalUsers={totalUsers ?? 0}
      activeUsers={activeUsers ?? 0}
      totalRevenue={totalRevenue}
      totalCharity={totalCharity}
      totalPrizes={totalPrizes}
      draws={(draws as any[]) ?? []}
    />
  )
}
