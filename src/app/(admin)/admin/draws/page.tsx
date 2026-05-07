import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { AdminDrawsClient } from '@/components/admin/AdminDrawsClient'

export default async function AdminDrawsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: draws } = await supabase
    .from('draws')
    .select('*')
    .order('draw_month', { ascending: false })

  return <AdminDrawsClient draws={draws ?? []} />
}
