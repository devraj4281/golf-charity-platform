export function generateAlgorithmicNumbers(freq: Record<number, number>): number[] {
  if (!freq || Object.keys(freq).length === 0) return []

  const maxFreq = Math.max(...Object.values(freq)) + 1

  const weights = Object.entries(freq).map(([score, count]) => ({
    score: parseInt(score),
    weight: maxFreq - count,
  }))

  const chosen: number[] = []
  const remaining = [...weights]

  const limit = Math.min(5, remaining.length)
  let totalWeight = remaining.reduce((s, w) => s + w.weight, 0)

  while (chosen.length < limit) {
    let rand = Math.random() * totalWeight

    for (let i = 0; i < remaining.length; i++) {
      rand -= remaining[i].weight

      if (rand <= 0) {
        chosen.push(remaining[i].score)
        totalWeight -= remaining[i].weight
        remaining.splice(i, 1)
        break
      }
    }
  }

  return chosen.sort((a, b) => a - b)
}