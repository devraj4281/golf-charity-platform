'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { Draw } from '@/types/database'
import { Trophy, Clock, ArrowRight, TrendingUp, Users, Target } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const DrawSection = ({ draw }: { draw: Draw | null }) => {
  if (!draw) {
    return (
      <div className="premium-card p-16 flex items-center justify-center">
        <p className="text-slate-500 font-medium tracking-wide italic">The next draw cycle is being synchronized...</p>
      </div>
    )
  }

  return (
    <section className="premium-card p-8 md:p-10 bg-slate-900 text-white relative overflow-hidden group">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-indigo-600 to-transparent" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-indigo-600 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Core Info */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Live Performance Pool</span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">{draw.draw_month}</h2>
              <p className="text-slate-400 text-lg font-medium max-w-md">
                Every score recorded this month contributes to the jackpot and your selected cause.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              Current Prize Liquidity
            </span>
            <span className="text-6xl md:text-8xl font-black text-white tracking-tighter">
              ₹{draw.total_pool?.toLocaleString() || '0'}
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remaining</p>
                <p className="text-sm font-bold">14d 05h 22m</p>
              </div>
            </div>
            {draw.jackpot_carried > 0 && (
              <div className="px-5 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-wider">Rollover</p>
                  <p className="text-sm font-bold text-emerald-400">₹{draw.jackpot_carried.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Distribution */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Distribution</p>
                <h3 className="text-xl font-bold">Match Tier Pool</h3>
              </div>
              <Target className="w-6 h-6 text-indigo-400" />
            </div>

            <div className="space-y-6">
              {[
                { label: 'Match 5 (Jackpot)', amount: draw.prize_pool_5, color: 'bg-indigo-500', pct: '60%' },
                { label: 'Match 4', amount: draw.prize_pool_4, color: 'bg-slate-500', pct: '25%' },
                { label: 'Match 3', amount: draw.prize_pool_3, color: 'bg-slate-700', pct: '15%' },
              ].map((tier, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{tier.label}</span>
                    <span className="text-lg font-black">₹{(tier.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", tier.color)} style={{ width: tier.pct }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                      G{i}
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-400">1.2k Entering</p>
              </div>
              <button className="flex items-center gap-1 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Draw Rules <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
