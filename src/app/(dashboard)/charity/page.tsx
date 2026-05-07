import { requireUser } from '@/lib/auth/requireUser'
import { createClient } from '@/lib/supabase/server'
import type { Charity } from '@/types/charity'
import { CharityClient } from '@/components/dashboard/CharityClient'

export default async function CharityPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })

  const { data: charityContribs } = await supabase
    .from('prize_pool_ledger')
    .select('amount')
    .eq('user_id', user.id)
    .eq('entry_type', 'charity')

  const totalCharity = charityContribs?.reduce((s, r) => s + r.amount, 0) ?? 0

  return (
    <CharityClient
      charities={(charities as Charity[]) ?? []}
      selectedCharityId={user.profile.charity_id}
      currentPct={user.profile.charity_pct}
      totalContributed={totalCharity}
    />
  )
}
