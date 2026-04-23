/** Random draw: 5 unique numbers, each in the Stableford range 1–45 */
export function generateRandomNumbers(): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 5).sort((a, b) => a - b)
}
