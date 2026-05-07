import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/services/profile.service'
import type { Profile } from '@/types/database'
import type { User } from '@supabase/supabase-js'
import { cache } from 'react'

export type AuthUser = {
  id: string
  email: string
  profile: Profile
  user: User
}

/**
 * Fetches the currently authenticated user and their profile.
 * Wrapped in React cache() so multiple calls within the same server
 * render (e.g. layout + page) only hit Supabase ONCE.
 */
export const getUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  // Fetch existing profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .limit(1)
    .single()

  // Delegate profile creation to the service layer if missing
  const resolvedProfile = profile ?? await ensureProfile(supabase, user)

  if (!resolvedProfile) return null

  return {
    id: user.id,
    email: user.email!,
    profile: resolvedProfile as Profile,
    user: user,
  }
})

