/**
 * Centralized database queries.
 * All Supabase table access goes through here — no raw .from() calls in components or pages.
 *
 * Each function takes a `supabase` client as its first argument so it works with
 * both the standard cookie-based server client and the admin client.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type DB = SupabaseClient<Database>

// ─── Profiles ────────────────────────────────────────────────────────────────

export async function getProfileById(db: DB, userId: string) {
  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(
  db: DB,
  userId: string,
  updates: Partial<Database['public']['Tables']['profiles']['Update']>
) {
  const { data, error } = await db
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getAllActiveSubscribers(db: DB) {
  const { data, error } = await db
    .from('profiles')
    .select('id, sub_plan, charity_id, charity_pct')
    .eq('subscription_status', 'active')
  if (error) throw error
  return data ?? []
}

// ─── Scores ───────────────────────────────────────────────────────────────────

/**
 * Returns latest 5 scores for a user, most recent first.
 */
export async function getUserScores(db: DB, userId: string) {
  const { data, error } = await db
    .from('scores')
    .select('*')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false })
    .limit(5)
  if (error) throw error
  return data ?? []
}

/**
 * Upserts a score. Unique constraint on (user_id, entry_date) enforces one per date.
 * The DB trigger `trg_rolling_scores` handles the rolling-5 deletion.
 */
export async function upsertScore(
  db: DB,
  userId: string,
  score: number,
  entryDate: string // 'YYYY-MM-DD'
) {
  if (score < 1 || score > 45) {
    throw new Error('Score must be between 1 and 45 (Stableford format)')
  }

  const { data, error } = await db
    .from('scores')
    .upsert(
      {
        user_id: userId,
        score,
        entry_date: entryDate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,entry_date' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteScore(db: DB, scoreId: string, userId: string) {
  const { error } = await db
    .from('scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', userId)
  if (error) throw error
}

/**
 * Gets all active subscriber scores for draw evaluation.
 * Returns a map of userId → score[]
 */
export async function getAllActiveScores(
  db: DB,
  userIds: string[]
): Promise<Record<string, number[]>> {
  if (userIds.length === 0) return {}

  const { data, error } = await db
    .from('scores')
    .select('user_id, score')
    .in('user_id', userIds)

  if (error) throw error

  const map: Record<string, number[]> = {}
  for (const row of data ?? []) {
    if (!map[row.user_id]) map[row.user_id] = []
    map[row.user_id].push(row.score)
  }
  return map
}

/**
 * Gets score frequency across all active users for algorithmic draw.
 * Returns a map of score (1–45) → count
 */
export async function getScoreFrequency(
  db: DB,
  lookbackDays = 90
): Promise<Record<number, number>> {
  const since = new Date(Date.now() - lookbackDays * 86_400_000)
    .toISOString()
    .split('T')[0]

  const { data, error } = await db
    .from('scores')
    .select('score')
    .gte('entry_date', since)

  if (error) throw error

  const freq: Record<number, number> = {}
  for (let i = 1; i <= 45; i++) freq[i] = 0
  for (const row of data ?? []) freq[row.score]++

  return freq
}

// ─── Charities ────────────────────────────────────────────────────────────────

export async function getAllCharities(db: DB) {
  const { data, error } = await db
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getFeaturedCharity(db: DB) {
  const { data, error } = await db
    .from('charities')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(1)
    .single()
  if (error) return null
  return data
}

export async function getCharityById(db: DB, charityId: string) {
  const { data, error } = await db
    .from('charities')
    .select('*')
    .eq('id', charityId)
    .single()
  if (error) throw error
  return data
}

// ─── Draws ────────────────────────────────────────────────────────────────────

export async function getPublishedDraws(db: DB, limit = 12) {
  const { data, error } = await db
    .from('draws')
    .select('*')
    .eq('status', 'published')
    .order('draw_month', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getDrawById(db: DB, drawId: string) {
  const { data, error } = await db
    .from('draws')
    .select('*')
    .eq('id', drawId)
    .single()
  if (error) throw error
  return data
}

export async function getLatestPublishedDraw(db: DB) {
  const { data, error } = await db
    .from('draws')
    .select('*')
    .eq('status', 'published')
    .order('draw_month', { ascending: false })
    .limit(1)
    .single()
  if (error) return null
  return data
}

/**
 * Returns the last draw that had no 5-match winner (for jackpot rollover calculation).
 */
export async function getPreviousDrawForRollover(db: DB, beforeMonth: Date) {
  const { data: prevDraw, error } = await db
    .from('draws')
    .select('id, prize_pool_5, jackpot_carried')
    .lt('draw_month', beforeMonth.toISOString().split('T')[0])
    .order('draw_month', { ascending: false })
    .limit(1)
    .single()

  if (error || !prevDraw) return { jackpotCarried: 0 }

  const { data: prevWinners } = await db
    .from('winners')
    .select('id')
    .eq('draw_id', prevDraw.id)
    .eq('match_type', '5_match')
    .limit(1)

  const hadJackpotWinner = prevWinners && prevWinners.length > 0

  return {
    jackpotCarried: hadJackpotWinner
      ? 0
      : (prevDraw.prize_pool_5 + prevDraw.jackpot_carried),
  }
}

export async function insertDraw(
  db: DB,
  draw: Database['public']['Tables']['draws']['Insert']
) {
  const { data, error } = await db
    .from('draws')
    .insert(draw)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function publishDraw(db: DB, drawId: string) {
  const { data, error } = await db
    .from('draws')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', drawId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Draw entries ─────────────────────────────────────────────────────────────

export async function insertDrawEntries(
  db: DB,
  entries: Database['public']['Tables']['draw_entries']['Insert'][]
) {
  if (entries.length === 0) return
  const { error } = await db.from('draw_entries').insert(entries)
  if (error) throw error
}

export async function getDrawEntryForUser(
  db: DB,
  drawId: string,
  userId: string
) {
  const { data, error } = await db
    .from('draw_entries')
    .select('*')
    .eq('draw_id', drawId)
    .eq('user_id', userId)
    .single()
  if (error) return null
  return data
}

// ─── Winners ──────────────────────────────────────────────────────────────────

export async function insertWinners(
  db: DB,
  winners: Database['public']['Tables']['winners']['Insert'][]
) {
  if (winners.length === 0) return
  const { error } = await db.from('winners').insert(winners)
  if (error) throw error
}

export async function getWinnersForDraw(db: DB, drawId: string) {
  const { data, error } = await db
    .from('winners')
    .select('*, profiles(full_name, email)')
    .eq('draw_id', drawId)
  if (error) throw error
  return data ?? []
}

export async function getWinnersForUser(db: DB, userId: string) {
  const { data, error } = await db
    .from('winners')
    .select('*, draws(draw_month, drawn_numbers)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function updateWinnerStatus(
  db: DB,
  winnerId: string,
  updates: Pick<
    Database['public']['Tables']['winners']['Update'],
    'status' | 'proof_url' | 'admin_notes'
  >
) {
  const { data, error } = await db
    .from('winners')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', winnerId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getAllPendingWinners(db: DB) {
  const { data, error } = await db
    .from('winners')
    .select('*, profiles(full_name, email), draws(draw_month)')
    .in('status', ['proof_submitted', 'pending'])
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ─── Prize pool ledger ────────────────────────────────────────────────────────

export async function insertLedgerEntry(
  db: DB,
  entry: Database['public']['Tables']['prize_pool_ledger']['Insert']
) {
  const { error } = await db.from('prize_pool_ledger').insert(entry)
  if (error) throw error
}

export async function getTotalPrizePool(db: DB): Promise<number> {
  const { data, error } = await db
    .from('prize_pool_ledger')
    .select('amount, entry_type')

  if (error) throw error

  return (data ?? []).reduce((sum, row) => {
    if (row.entry_type === 'prize_out') return sum - row.amount
    return sum + row.amount
  }, 0)
}
