'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Calendar, Hash, CheckCircle, Clock, BarChart2 } from 'lucide-react'
import type { Draw } from '@/types/database'

const statusColor: Record<string, string> = {
  pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  simulated: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export function AdminDrawsClient({ draws }: { draws: Draw[] }) {
  const publishedDraws = draws.filter(d => d.status === 'published').length

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Draw Management</h1>
          <p className="text-zinc-400">{draws.length} total draws — {publishedDraws} published.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Draws', value: draws.length, icon: BarChart2, color: 'indigo' },
          { label: 'Published', value: publishedDraws, icon: CheckCircle, color: 'emerald' },
          { label: 'Pending / Simulated', value: draws.length - publishedDraws, icon: Clock, color: 'amber' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-lg bg-${s.color}-500/20 flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 text-${s.color}-400`} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Draws List */}
      <div className="space-y-4">
        {draws.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-2xl text-sm">
            No draws have been run yet. Use the API to trigger a draw.
          </div>
        ) : (
          draws.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-indigo-500/20 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {new Date(d.draw_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} Draw
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">Type: {d.draw_type}</p>
                    <p className="text-xs text-zinc-600">Total Pool: ₹{(d.total_pool ?? 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 ml-14 md:ml-0">
                  {d.drawn_numbers?.length > 0 && (
                    <div className="flex gap-1">
                      {d.drawn_numbers.map(n => (
                        <span key={n} className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center">
                          {n}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor[d.status] ?? ''}`}>
                    {d.status}
                  </span>
                  {d.jackpot_carried > 0 && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      +₹{d.jackpot_carried.toLocaleString()} rollover
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
