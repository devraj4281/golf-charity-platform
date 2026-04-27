import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { generateRandomNumbers } from './random'
import { generateAlgorithmicNumbers } from './algorithmic'
import {
  getAllActiveSubscribers,
  getAllActiveScores,
  getScoreFrequency,
  getPreviousDrawForRollover,
  insertDraw,
  insertDrawEntries,
  insertWinners,
  publishDraw,
} from '@/lib/db/queries'

type DB = SupabaseClient<Database>

export type DrawType = 'random' | 'algorithmic'
export type DrawStatus = 'simulated' | 'published'

export type DrawResult = {
  drawId:         string
  drawnNumbers:   number[]
  totalPool:      number
  pool5:          number
  pool4:          number
  pool3:          number
  jackpotCarried: number
  winners: {
    five:  string[]
    four:  string[]
    three: string[]
  }
  prizes: {
    five:  number
    four:  number
    three: number
  }
  totalEntrants:  number
  status:         DrawStatus
}

// ─── Prize pool constants ────────────────────────────────────────────────────

const SUBSCRIPTION_MONTHLY_PRICE = 9.99
const SUBSCRIPTION_YEARLY_PRICE  = 99.99
const PRIZE_POOL_SHARE           = 0.60 // 60% of net-of-charity subscription

const POOL_SPLIT = { five: 0.40, four: 0.35, three: 0.25 } as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countMatches(userScores: number[], drawnNumbers: number[]): number {
  const drawn = new Set(drawnNumbers)
  return userScores.filter(s => drawn.has(s)).length
}

async function calculatePools(
  db: DB,
  drawMonth: Date
): Promise<{
  totalPool:      number
  pool5:          number
  pool4:          number
  pool3:          number
  jackpotCarried: number
}> {
  const subscribers = await getAllActiveSubscribers(db)

  let base = 0
  for (const sub of subscribers) {
    const monthlyEquiv = sub.sub_plan === 'yearly'
      ? SUBSCRIPTION_YEARLY_PRICE / 12
      : SUBSCRIPTION_MONTHLY_PRICE
    const charityPct   = (sub.charity_pct ?? 10) / 100
    base += monthlyEquiv * (1 - charityPct) * PRIZE_POOL_SHARE
  }

  const { jackpotCarried } = await getPreviousDrawForRollover(db, drawMonth)

  const pool5 = parseFloat((base * POOL_SPLIT.five + jackpotCarried).toFixed(2))
  const pool4 = parseFloat((base * POOL_SPLIT.four).toFixed(2))
  const pool3 = parseFloat((base * POOL_SPLIT.three).toFixed(2))
  const totalPool = parseFloat((pool5 + pool4 + pool3).toFixed(2))

  return { totalPool, pool5, pool4, pool3, jackpotCarried }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * Runs a draw (simulation or publish) for the given month.
 *
 * @param db         - Supabase admin client (bypasses RLS)
 * @param drawMonth  - First day of the draw month (Date object)
 * @param drawType   - 'random' | 'algorithmic'
 * @param simulate   - true = save as 'simulated', false = publish
 */
export async function runDraw(
  db: DB,
  drawMonth: Date,
  drawType: DrawType,
  simulate = false
): Promise<DrawResult> {
  // 1. Calculate pools
  const { totalPool, pool5, pool4, pool3, jackpotCarried } =
    await calculatePools(db, drawMonth)

  // 2. Generate draw numbers
  let drawnNumbers: number[]
  if (drawType === 'algorithmic') {
    const freq = await getScoreFrequency(db, 90)
    drawnNumbers = generateAlgorithmicNumbers(freq)
  } else {
    drawnNumbers = generateRandomNumbers()
  }

  // 3. Fetch all active subscriber IDs and their scores
  const subscribers = await getAllActiveSubscribers(db)
  const userIds     = subscribers.map(s => s.id)
  const scoresByUser = await getAllActiveScores(db, userIds)

  // 4. Evaluate matches
  const winners5: string[] = []
  const winners4: string[] = []
  const winners3: string[] = []

  const entries: Database['public']['Tables']['draw_entries']['Insert'][] = []

  // (draw record inserted below so we have an ID)
  const drawRecord = await insertDraw(db, {
    draw_month:      drawMonth.toISOString().split('T')[0],
    status:          simulate ? 'simulated' : 'published',
    draw_type:       drawType,
    drawn_numbers:   drawnNumbers,
    prize_pool_5:    pool5,
    prize_pool_4:    pool4,
    prize_pool_3:    pool3,
    jackpot_carried: jackpotCarried,
    total_pool:      totalPool,
    published_at:    simulate ? null : new Date().toISOString(),
  })

  for (const userId of userIds) {
    const userScores = scoresByUser[userId]
    if (!userScores || userScores.length === 0) continue

    const matches = countMatches(userScores, drawnNumbers)
    const matchCount = matches >= 3 ? matches : null

    entries.push({
      draw_id:     drawRecord.id,
      user_id:     userId,
      scores_used: userScores,
      match_count: matchCount,
    })

    if      (matches === 5) winners5.push(userId)
    else if (matches === 4) winners4.push(userId)
    else if (matches === 3) winners3.push(userId)
  }

  // 5. Persist entries
  await insertDrawEntries(db, entries)

  // 6. Split prizes equally within each tier
  const prizeFor5 = winners5.length > 0
    ? parseFloat((pool5 / winners5.length).toFixed(2))
    : 0
  const prizeFor4 = winners4.length > 0
    ? parseFloat((pool4 / winners4.length).toFixed(2))
    : 0
  const prizeFor3 = winners3.length > 0
    ? parseFloat((pool3 / winners3.length).toFixed(2))
    : 0

  // 7. Persist winners
  await insertWinners(db, [
    ...winners5.map(uid => ({
      draw_id: drawRecord.id, user_id: uid,
      match_type: '5_match' as const,  prize_amount: prizeFor5,
      status: 'pending' as const, proof_url: null, admin_notes: null,
    })),
    ...winners4.map(uid => ({
      draw_id: drawRecord.id, user_id: uid,
      match_type: '4_match' as const, prize_amount: prizeFor4,
      status: 'pending' as const, proof_url: null, admin_notes: null,
    })),
    ...winners3.map(uid => ({
      draw_id: drawRecord.id, user_id: uid,
      match_type: '3_match' as const, prize_amount: prizeFor3,
      status: 'pending' as const, proof_url: null, admin_notes: null,
    })),
  ])

  return {
    drawId:         drawRecord.id,
    drawnNumbers,
    totalPool,
    pool5,
    pool4,
    pool3,
    jackpotCarried,
    winners:        { five: winners5, four: winners4, three: winners3 },
    prizes:         { five: prizeFor5, four: prizeFor4, three: prizeFor3 },
    totalEntrants:  entries.length,
    status:         simulate ? 'simulated' : 'published',
  }
}
