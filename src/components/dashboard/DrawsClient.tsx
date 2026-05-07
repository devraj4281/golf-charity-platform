'use client'

import { motion } from 'framer-motion'
import { Trophy, Calendar, CheckCircle, XCircle, Clock, Hash, Medal, ChevronRight } from 'lucide-react'
import type { Draw, DrawEntry } from '@/types/database'
import { cn } from '@/lib/utils/cn'

interface DrawWithEntry {
  draw: Draw
  entry?: DrawEntry
  win?: { match_type: string; prize_amount: number; status: string }
}

interface Props {
  draws: Draw[]
  myEntries: DrawEntry[]
  myWins: any[]
}

const statusColors: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Upcoming', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  simulated: { label: 'Finalizing', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  published: { label: 'Completed', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
}

const matchLabels: Record<string, string> = {
  '5_match': 'Match 5 — Jackpot',
  '4_match': 'Match 4',
  '3_match': 'Match 3',
}

export function DrawsClient({ draws, myEntries, myWins }: Props) {
  const entryMap = new Map(myEntries.map(e => [e.draw_id, e]))
  const winMap   = new Map(myWins.map(w => [w.draw_id, w]))

  const combined: DrawWithEntry[] = draws.map(d => ({
    draw: d,
    entry: entryMap.get(d.id),
    win:   winMap.get(d.id),
  }))

  const entered  = combined.filter(c => c.entry).length
  const won      = combined.filter(c => c.win).length
  const totalExposure = draws.reduce((s, d) => s + (d.total_pool ?? 0), 0)

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 reveal-stagger">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Draw History</h1>
          <p className="text-slate-500 font-medium">Track your participation and winnings across all grand draws.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Trophy className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-semibold text-slate-700">Participating in Active Draw</span>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Draws Entered', value: entered, icon: Hash, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Wins Recorded', value: won, icon: Medal, color: 'bg-amber-50 text-amber-600' },
          { label: 'Total Prize Pools', value: `₹${totalExposure.toLocaleString()}`, icon: Trophy, color: 'bg-emerald-50 text-emerald-600' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6 space-y-4"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Draw History */}
      <section className="premium-card overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">All Time Draws</h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {combined.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p className="font-medium">No draws available yet. Check back soon!</p>
            </div>
          ) : (
            combined.map(({ draw, entry, win }, i) => {
              const statusCfg = statusColors[draw.status] || { label: draw.status, color: 'bg-slate-50 text-slate-500 border-slate-100' }
              return (
                <motion.div
                  key={draw.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 hover:bg-slate-50/50 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100 shadow-sm">
                      <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 leading-tight">
                        {new Date(draw.draw_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} Grand Draw
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm font-medium text-slate-500">
                          ₹{(draw.total_pool ?? 0).toLocaleString()} Pool
                        </p>
                        {draw.jackpot_carried > 0 && (
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            +₹{draw.jackpot_carried.toLocaleString()} Rollover
                          </span>
                        )}
                      </div>
                      {entry && (
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Entered</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {entry.match_count != null ? `${entry.match_count} Matches Found` : `Scores: ${entry.scores_used?.join(', ')}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 ml-19 sm:ml-0">
                    {win && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 shadow-sm animate-in fade-in zoom-in duration-500">
                        <Trophy className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-tighter leading-none">{matchLabels[win.match_type] ?? 'Match Found'}</span>
                          <span className="text-xs font-black">₹{win.prize_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    
                    <span className={cn(
                      "text-[10px] font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider",
                      statusCfg.color
                    )}>
                      {statusCfg.label}
                    </span>
                    
                    {!entry && draw.status === 'pending' && (
                      <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
                        Enter Now <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
