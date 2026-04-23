import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Algorithmic draw: weighted toward scores that appear least often
 * across all active subscribers — increases variance and fairness.
 */
export async function generateAlgorithmicNumbers(supabase: SupabaseClient): Promise<number[]> {
  const { data: scores } = await supabase
    .from('scores')
    .select('score')
    .gte('entry_date', new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0])

  // Frequency map: score → count
  const freq: Record<number, number> = {}
  for (let i = 1; i <= 45; i++) freq[i] = 0
  for (const row of scores ?? []) freq[row.score]++

  // Weight = inverse frequency (rarer scores get higher weight)
  const maxFreq = Math.max(...Object.values(freq)) + 1
  const weights = Object.entries(freq).map(([score, count]) => ({
    score: parseInt(score),
    weight: maxFreq - count,
  }))

  const totalWeight = weights.reduce((s, w) => s + w.weight, 0)

  const chosen: number[] = []
  const remaining = [...weights]

  while (chosen.length < 5) {
    let rand = Math.random() * remaining.reduce((s, w) => s + w.weight, 0)
    for (let i = 0; i < remaining.length; i++) {
      rand -= remaining[i].weight
      if (rand <= 0) {
        chosen.push(remaining[i].score)
        remaining.splice(i, 1)
        break
      }
    }
  }

  return chosen.sort((a, b) => a - b)
}
