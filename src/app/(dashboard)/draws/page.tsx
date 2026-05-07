import { requireUser } from '@/lib/auth/requireUser'
import { createClient } from '@/lib/supabase/server'
import type { Draw, DrawEntry, Winner } from '@/types/database'
import { DrawsClient } from '@/components/dashboard/DrawsClient'

export default async function DrawsPage() {
  const user = await requireUser()
  const supabase = await createClient()

  // All draws with their entry for this user (left join via separate query)
  const { data: draws } = await supabase
    .from('draws')
    .select('*')
    .order('draw_month', { ascending: false })
    .limit(12)

  // This user's draw entries
  const { data: myEntries } = await supabase
    .from('draw_entries')
    .select('*')
    .eq('user_id', user.id)

  // This user's wins
  const { data: myWins } = await supabase
    .from('winners')
    .select('*, draws(draw_month)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DrawsClient
      draws={(draws as Draw[]) ?? []}
      myEntries={(myEntries as DrawEntry[]) ?? []}
      myWins={(myWins as any[]) ?? []}
    />
  )
}
