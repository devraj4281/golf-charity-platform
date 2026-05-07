import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { AdminCharityClient } from '@/components/admin/AdminCharityClient'

export default async function AdminCharityPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('is_featured', { ascending: false })

  return <AdminCharityClient charities={charities ?? []} />
}
