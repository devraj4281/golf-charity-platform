'use client'

import { useState, useTransition } from 'react'
import { Score } from '@/types/database'
import { addScore } from '@/lib/actions/scores'
import { Trophy, Calendar, Plus, Activity, AlertCircle, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ScoreSection({ initialScores }: { initialScores: Score[] }) {
  const [scoreValue, setScoreValue] = useState<string>('')
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const value = parseInt(scoreValue)
    if (isNaN(value) || value < 1 || value > 45) {
      setError('Score must be between 1 and 45')
      return
    }
    if (!entryDate) {
      setError('Please select a date')
      return
    }

    startTransition(async () => {
      try {
        await addScore(value, entryDate)
        setScoreValue('')
      } catch (err: any) {
        setError(err.message || 'Failed to submit score')
      }
    })
  }

  return (
    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full group-hover:bg-emerald-500/10 transition-all duration-1000" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-12">
        {/* Input Architecture */}
        <div className="flex-1 space-y-10">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Record Score</h2>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Tournament Charity Event</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Stableford Score</label>
                <div className="relative group/input">
                  <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/40 group-focus-within/input:text-emerald-400 transition-colors" />
                  <input 
                    type="number"
                    min="1"
                    max="45"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(e.target.value)}
                    placeholder="1-45"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Round Date</label>
                <div className="relative group/input">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/40 group-focus-within/input:text-emerald-400 transition-colors" />
                  <input 
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Synchronizing...
                </span>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Submit Score
                </>
              )}
            </button>
          </form>
        </div>

        {/* Audit Trail */}
        <div className="w-full lg:w-96 space-y-8">
          <div className="flex justify-between items-end">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Recent Scores</h3>
            <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Verified</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {initialScores.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-10 text-center border-2 border-dashed border-white/[0.05] rounded-[2rem] flex flex-col items-center gap-3"
                >
                  <Activity className="w-8 h-8 text-zinc-700" />
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider leading-relaxed">
                    No scores recorded yet <br/> Submit your first score
                  </p>
                </motion.div>
              ) : (
                initialScores.map((score, index) => (
                  <motion.div
                    key={score.id}
                    layout
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                      delay: index * 0.05 
                    }}
                    className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all group/item"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl shadow-2xl group-hover/item:scale-110 transition-transform">
                        {score.score}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-wider">Validated Entry</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase mt-0.5">
                          {new Date(score.entry_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-700 group-hover/item:text-emerald-500 transition-colors" />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
