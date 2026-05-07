'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Trophy, Calendar, Plus, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react'
import type { Score } from '@/types/database'
import { addScore } from '@/lib/actions/scores'
import dynamic from 'next/dynamic'

const ScoresAreaChart = dynamic(() => import('./ScoresChart').then(mod => mod.ScoresAreaChart), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-muted/20 animate-pulse rounded-xl" />
})

export function ScoresClient({ initialScores }: { initialScores: Score[] }) {
  const [scoreValue, setScoreValue] = useState('')
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const chartData = [...initialScores]
    .reverse()
    .map(s => ({
      date: new Date(s.entry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      score: s.score,
    }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const v = parseInt(scoreValue)
    if (isNaN(v) || v < 1 || v > 45) return setError('Score must be between 1 and 45.')
    if (!entryDate) return setError('Please select a date.')

    const isDuplicate = initialScores.some(s => s.entry_date.split('T')[0] === entryDate)
    if (isDuplicate) return setError('A score for this date already exists.')

    startTransition(async () => {
      try {
        await addScore(v, entryDate)
        setScoreValue('')
      } catch (err: any) {
        setError(err.message ?? 'Failed to submit score')
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 reveal-stagger">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Score Tracking
          </h1>
          <p className="font-medium mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Analyze your golf performance and track your progress.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <Activity className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          <span style={{ color: 'var(--foreground)' }}>Live Handicap: 12.4</span>
        </div>
      </header>

      {/* Chart Section */}
      <section className="premium-card p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              Scoring Trend
            </h2>
          </div>
          <select
            className="rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
            style={{
              backgroundColor: 'var(--muted)',
              border: '1px solid var(--border)',
              color: 'var(--muted-foreground)',
            }}
          >
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
            <option>All Time</option>
          </select>
        </div>

        {chartData.length > 0 ? (
          <ScoresAreaChart data={chartData} />
        ) : (
          <div
            className="h-[300px] flex items-center justify-center rounded-3xl border-2 border-dashed font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            Record a score to see your trend
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entry Form */}
        <section className="premium-card p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              New Entry
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 rounded-2xl text-sm font-semibold"
                  style={{
                    backgroundColor: 'rgba(238,183,26,0.1)',
                    border: '1px solid rgba(238,183,26,0.25)',
                    color: 'var(--warning)',
                  }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label
                className="text-xs font-black uppercase tracking-wider"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Stableford Score
              </label>
              <div className="relative">
                <Trophy
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'var(--muted-foreground)' }}
                />
                <input
                  type="number" min="1" max="45" value={scoreValue}
                  onChange={e => setScoreValue(e.target.value)}
                  placeholder="e.g. 36"
                  className="w-full rounded-2xl py-4 pl-12 pr-4 font-bold focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--muted)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(173,158,253,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-black uppercase tracking-wider"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Date Played
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'var(--muted-foreground)' }}
                />
                <input
                  type="date" value={entryDate}
                  onChange={e => setEntryDate(e.target.value)}
                  className="w-full rounded-2xl py-4 pl-12 pr-4 font-bold focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--muted)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    colorScheme: 'dark',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(173,158,253,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full py-4 disabled:opacity-50"
            >
              {isPending ? 'Verifying Entry…' : 'Submit Round Score'}
            </button>
          </form>
        </section>

        {/* History List */}
        <section className="premium-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                Recent Rounds
              </h2>
            </div>
            <span
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: 'var(--muted-foreground)' }}
            >
              History
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {initialScores.length === 0 ? (
                <div
                  className="text-center py-12 border-2 border-dashed rounded-3xl font-medium"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                >
                  No rounds recorded yet.
                </div>
              ) : (
                initialScores.map((score, i) => (
                  <motion.div
                    key={score.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'var(--muted)',
                      border: '1px solid var(--border)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(173,158,253,0.3)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors font-black text-lg"
                        style={{
                          backgroundColor: 'rgba(173,158,253,0.1)',
                          color: 'var(--primary)',
                          border: '1px solid rgba(173,158,253,0.2)',
                        }}
                      >
                        {score.score}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                          Stableford Round
                        </p>
                        <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                          {new Date(score.entry_date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'long', day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="w-5 h-5 transition-all group-hover:translate-x-1"
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  )
}
