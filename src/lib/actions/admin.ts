/**
 * lib/actions/admin.ts
 * Server actions for admin operations (draw runs, winner management, charity CRUD)
 */
'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { revalidatePath } from 'next/cache'
import type { WinnerStatus } from '@/types/draw'

export async function updateWinnerStatus(winnerId: string, status: WinnerStatus, notes?: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('winners')
    .update({ status, admin_notes: notes ?? null, updated_at: new Date().toISOString() })
    .eq('id', winnerId)

  if (error) throw new Error('Failed to update winner status')
  revalidatePath('/admin/winners')
}

export async function createCharity(name: string, description: string, isFeatured: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('charities')
    .insert({ name, description, is_featured: isFeatured, is_active: true })

  if (error) throw new Error('Failed to create charity')
  revalidatePath('/admin/charity')
}

export async function toggleCharityStatus(charityId: string, isActive: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('charities')
    .update({ is_active: isActive })
    .eq('id', charityId)

  if (error) throw new Error('Failed to update charity status')
  revalidatePath('/admin/charity')
}

export async function updateUserSubscription(userId: string, status: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ subscription_status: status, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw new Error('Failed to update subscription status')
  revalidatePath('/admin/users')
}
