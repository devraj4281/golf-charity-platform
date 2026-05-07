/**
 * lib/actions/charity.ts
 * Server actions for charity selection and contribution management
 */
'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth/requireUser'
import { revalidatePath } from 'next/cache'

export async function selectCharity(charityId: string, pct: number) {
  const user = await requireUser()
  const supabase = await createClient()

  if (pct < 10 || pct > 100) {
    throw new Error('Contribution percentage must be between 10% and 100%')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ charity_id: charityId, charity_pct: pct })
    .eq('id', user.id)

  if (error) throw new Error('Failed to update charity preference')

  revalidatePath('/charity')
  revalidatePath('/dashboard')
}
