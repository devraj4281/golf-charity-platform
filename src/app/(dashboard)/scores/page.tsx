import { requireUser } from '@/lib/auth/requireUser'
import { createClient } from '@/lib/supabase/server'
import type { Score } from '@/types/database'
import { ScoresClient } from '@/components/dashboard/ScoresClient'

export default async function ScoresPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('entry_date', { ascending: false })
    .limit(5)

  return <ScoresClient initialScores={(scores as Score[]) ?? []} />
}
