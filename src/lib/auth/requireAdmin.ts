import { redirect } from 'next/navigation'
import { requireUser } from './requireUser'
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const user = await requireUser()

  // 1. Check custom claim from JWT (authentic/authentic one)
  // 2. Fallback to database profile role (for local dev safety)
  const role = (user.user.app_metadata?.user_role as string) || user.profile.role

  if (role !== 'admin') {
    redirect('/dashboard')
  }

  return { user, role }
}