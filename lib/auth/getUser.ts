import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

export type AuthUser = {
  id: string
  email: string
  profile: Profile
}

/**
 * Fetches the currently authenticated user and their profile.
 * Returns null if not authenticated or if the profile doesn't exist.
 *
 * Always use this instead of supabase.auth.getSession() —
 * getSession() trusts the client cookie and does NOT re-validate with the server.
 * getUser() makes a network call to Supabase Auth and is the only safe method.
 */
export async function getUser(): Promise<AuthUser | null> {
  // ✅ Must be awaited — createClient() is async (reads cookies)
  const supabase = await createClient()

  // ✅ Safe: validates token with Supabase Auth server
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('[getUser] Auth failed:', authError?.message || 'No user')
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('[getUser] Profile fetch failed for user', user.id, 'Error:', profileError?.message)
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    profile,
  }
}
