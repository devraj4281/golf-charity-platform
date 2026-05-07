import { requireUser } from '@/lib/auth/requireUser'
import { createClient } from '@/lib/supabase/server'
import { SettingsClient } from '@/components/dashboard/SettingsClient'

export default async function SettingsPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: charities } = await supabase
    .from('charities')
    .select('id, name')
    .eq('is_active', true)

  return (
    <SettingsClient
      profile={user.profile}
      charities={charities ?? []}
    />
  )
}
