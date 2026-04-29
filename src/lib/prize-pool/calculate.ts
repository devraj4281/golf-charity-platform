import { createClient } from '@/lib/supabase/server'

const SUBSCRIPTION_PRICES = {
  monthly: 9.99,
  yearly:  99.99,
}

const PRIZE_POOL_PCT = 0.60

const POOL_SPLIT = {
  five:  0.40,
  four:  0.35,
  three: 0.25,
}

export async function calculatePrizePool(drawMonth: Date) {
  const supabase = await createClient()

  const { data: subscribers, error } = await supabase
    .from('profiles')
    .select('sub_plan, charity_pct')
    .eq('subscription_status', 'active')

  if (error) throw error

  let totalPool = 0

  for (const sub of subscribers) {
    const basePrice = sub.sub_plan === 'yearly'
      ? SUBSCRIPTION_PRICES.yearly / 12
      : SUBSCRIPTION_PRICES.monthly

    const charityPct = (sub.charity_pct ?? 10) / 100
    const afterCharity = basePrice * (1 - charityPct)
    totalPool += afterCharity * PRIZE_POOL_PCT
  }

  const { data: prevDraw } = await supabase
    .from('draws')
    .select('id, prize_pool_5, jackpot_carried')
    .lt('draw_month', drawMonth.toISOString())
    .order('draw_month', { ascending: false })
    .limit(1)
    .single()

  const { data: prevWinners } = await supabase
    .from('winners')
    .select('id')
    .eq('draw_id', prevDraw?.id ?? '')
    .eq('match_type', '5_match')
    .limit(1)

  const jackpotCarried =
    prevDraw && (!prevWinners || prevWinners.length === 0)
      ? (prevDraw.prize_pool_5 + prevDraw.jackpot_carried)
      : 0

  const pool5 = totalPool * POOL_SPLIT.five + jackpotCarried
  const pool4 = totalPool * POOL_SPLIT.four
  const pool3 = totalPool * POOL_SPLIT.three

  return {
    totalPool: parseFloat(totalPool.toFixed(2)),
    pool5:     parseFloat(pool5.toFixed(2)),
    pool4:     parseFloat(pool4.toFixed(2)),
    pool3:     parseFloat(pool3.toFixed(2)),
    jackpotCarried,
    subscriberCount: subscribers.length,
  }
}
