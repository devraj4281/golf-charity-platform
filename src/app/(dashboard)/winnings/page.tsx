import { requireUser } from '@/lib/auth/requireUser'
import { createClient } from '@/lib/supabase/server'
import { WinningsClient } from '@/components/dashboard/WinningsClient'

export default async function WinningsPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: winners } = await supabase
    .from('winners')
    .select('*, draws(draw_month, drawn_numbers)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const totalWinnings = winners?.reduce((s, w) => s + w.prize_amount, 0) ?? 0
  const pendingAmount = winners?.filter(w => w.status === 'pending' || w.status === 'proof_submitted' || w.status === 'approved')
    .reduce((s, w) => s + w.prize_amount, 0) ?? 0
  const paidAmount = winners?.filter(w => w.status === 'paid')
    .reduce((s, w) => s + w.prize_amount, 0) ?? 0

  return (
    <WinningsClient
      winners={(winners as any[]) ?? []}
      totalWinnings={totalWinnings}
      pendingAmount={pendingAmount}
      paidAmount={paidAmount}
    />
  )
}
