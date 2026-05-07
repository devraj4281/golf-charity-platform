'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth/requireUser'
import { revalidatePath } from 'next/cache'

export async function addScore(scoreValue: number, entryDate: string) {
  const user = await requireUser()
  const supabase = await createClient()

  if (scoreValue < 1 || scoreValue > 45) {
    throw new Error('Score must be between 1 and 45')
  }

  // 1. Fetch current scores to check count
  const { data: currentScores, error: fetchError } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', user.id)
    .order('entry_date', { ascending: false })

  if (fetchError) throw new Error('Failed to fetch scores')

  // 2. If 5 or more, delete oldest (keep 4 newest so we can insert the 5th)
  if (currentScores && currentScores.length >= 5) {
    const idsToDelete = currentScores.slice(4).map(s => s.id)
    
    const { error: deleteError } = await supabase
      .from('scores')
      .delete()
      .in('id', idsToDelete)
      
    if (deleteError) throw new Error('Failed to clean up old scores')
  }

  // 3. Insert new score
  const { data, error } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score: scoreValue,
      entry_date: entryDate
    })
    .select()
    .single()

  if (error) {
    // Unique constraint violation for entry_date per user
    if (error.code === '23505') {
       throw new Error('A score already exists for this date.')
    }
    throw new Error('Failed to submit score')
  }

  revalidatePath('/dashboard')
  return { success: true, data }
}
