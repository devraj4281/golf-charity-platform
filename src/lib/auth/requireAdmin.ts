import { redirect } from 'next/navigation'
import { requireUser } from './requireUser'
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()

  // Custom claims from the Auth Hook are merged into app_metadata
  const role = session?.user?.app_metadata?.user_role

  if (role !== 'admin') {
    redirect('/dashboard')
  }

  return { user, role }
}