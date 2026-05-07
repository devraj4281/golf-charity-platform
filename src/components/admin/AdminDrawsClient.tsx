'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Calendar, Hash, CheckCircle, Clock, BarChart2, Plus } from 'lucide-react'
import type { Draw } from '@/types/database'
import { cn } from '@/lib/utils/cn'

const statusColor: Record<string, string> = {
  pending:   'bg-warning/10 text-warning border-warning/20',
  simulated: 'bg-primary/10 text-primary border-primary/20',
  published: 'bg-success/10 text-success border-success/20',
}

export function AdminDrawsClient({ draws }: { draws: Draw[] }) {
  const publishedDraws = draws.filter(d => d.status === 'published').length

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12 reveal-stagger">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg glow-accent">
            <Trophy className="w-7 h-7 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Platform Engine</span>
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none mt-1">Draw <span className="text-primary">Registry</span></h1>
          </div>
        </div>
        
        <button className="btn-primary flex items-center gap-2 group">
          <Plus className="w-4 h-4" />
          <span>New Scheduled Draw</span>
        </button>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Draws', value: draws.length, icon: BarChart2, color: 'primary' },
          { label: 'Published Results', value: publishedDraws, icon: CheckCircle, color: 'success' },
          { label: 'Simulated/Pending', value: draws.length - publishedDraws, icon: Clock, color: 'warning' },
        ].map(s => (
          <div key={s.label} className="premium-card p-6 group hover:border-primary/30 transition-all">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
              s.color === 'primary' ? 'bg-primary/10 text-primary glow-accent' : 
              s.color === 'success' ? 'bg-success/10 text-success glow-success' : 
              'bg-warning/10 text-warning'
            )}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-foreground tracking-tight leading-none">{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-3">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Draws List */}
      <div className="space-y-4">
        {draws.length === 0 ? (
          <div className="premium-card p-20 text-center space-y-4 border-dashed">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto text-muted-foreground opacity-50">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground font-bold text-lg">No Draw History</p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">Initialize the first platform draw to begin prize distributions.</p>
            </div>
          </div>
        ) : (
          draws.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              className="premium-card p-6 group hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border group-hover:bg-primary transition-colors glow-accent">
                    <Calendar className="w-6 h-6 text-muted-foreground group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-foreground leading-none tracking-tight">
                      {new Date(d.draw_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} Draw
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type: {d.draw_type}</span>
                      <div className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pool: ₹{(d.total_pool ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 ml-18 md:ml-0">
                  {d.drawn_numbers?.length > 0 && (
                    <div className="flex gap-2">
                      {d.drawn_numbers.map(n => (
                        <div key={n} className="w-9 h-9 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-black flex items-center justify-center shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                          {n}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border shadow-sm",
                    statusColor[d.status] || "bg-muted text-muted-foreground"
                  )}>
                    {d.status}
                  </div>
                  {d.jackpot_carried > 0 && (
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                      Rollover: ₹{d.jackpot_carried.toLocaleString()}
                    </div>
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
