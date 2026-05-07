import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { AdminWinnersClient } from '@/components/admin/AdminWinnersClient'

export default async function AdminWinnersPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: winners } = await supabase
    .from('winners')
    .select('*, profiles(full_name, email), draws(draw_month)')
    .order('created_at', { ascending: false })

  return <AdminWinnersClient winners={winners ?? []} />
}
