/**
 * lib/services/profile.service.ts
 *
 * Handles profile lifecycle business logic.
 * Called by auth layer and API routes — never by DB layer.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { upsertProfile } from '@/lib/db/queries'

type DB = SupabaseClient<Database>

/**
 * Ensures a profile exists for the given auth user.
 * Upserts it from auth metadata if missing.
 * Used by getUser() and auth callbacks.
 */
export async function ensureProfile(db: DB, user: User) {
  const fullName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email?.split('@')[0] ||
    'Golfer'

  return upsertProfile(db, {
    id: user.id,
    email: user.email!,
    full_name: fullName,
    role: 'subscriber',
    subscription_status: 'inactive',
    charity_pct: 10,
  })
}
