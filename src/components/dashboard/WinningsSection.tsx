'use client'

import { Trophy, ArrowRight, Wallet, TrendingUp } from 'lucide-react'

export function WinningsSection({ totalWinnings }: { totalWinnings: number }) {
  return (
    <div className="glass-card rounded-[2rem] p-7 relative overflow-hidden group flex flex-col gap-6">
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 blur-[60px] rounded-full group-hover:bg-amber-500/10 transition-all duration-1000" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Total Winnings</h2>
          <p className="text-xs text-zinc-500 font-medium">Performance dividends</p>
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        <div className="text-4xl font-black text-white tracking-tighter">
          ₹{totalWinnings.toLocaleString()}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Withdrawal Available</span>
        </div>
      </div>

      <button className="relative z-10 w-full group/btn rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all hover:border-amber-500/30 hover:bg-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 group-hover/btn:bg-amber-500/10 group-hover/btn:border-amber-500/20 transition-colors">
            <Wallet className="w-4 h-4 text-zinc-400 group-hover/btn:text-amber-400 transition-colors" />
          </div>
          <span className="text-sm font-bold text-white">Settle Winnings</span>
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
