'use client'

import { Heart, ArrowRight, Building, Sparkles } from 'lucide-react'

export function CharitySection({ totalCharity }: { totalCharity: number }) {
  return (
    <div className="glass-card rounded-[2rem] p-7 relative overflow-hidden group flex flex-col gap-6">
      <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 blur-[60px] rounded-full group-hover:bg-rose-500/10 transition-all duration-1000" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="w-11 h-11 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform duration-300">
          <Heart className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Charity Impact</h2>
          <p className="text-xs text-zinc-500 font-medium">Global philanthropic contribution</p>
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        <div className="text-4xl font-black text-white tracking-tighter">
          ₹{totalCharity.toLocaleString()}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 rounded-xl border border-rose-500/20">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Impact Verified</span>
        </div>
      </div>

      <button className="relative z-10 w-full group/btn rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all hover:border-rose-500/30 hover:bg-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 group-hover/btn:bg-rose-500/10 group-hover/btn:border-rose-500/20 transition-colors">
            <Building className="w-4 h-4 text-zinc-400 group-hover/btn:text-rose-400 transition-colors" />
          </div>
          <span className="text-sm font-bold text-white">Foundation Direct</span>
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
