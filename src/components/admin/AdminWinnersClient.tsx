'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Trophy, CheckCircle, AlertTriangle, Clock, Upload, ArrowRight, User, Mail, Calendar } from 'lucide-react'
import { updateWinnerStatus } from '@/lib/actions/admin'
import { cn } from '@/lib/utils/cn'

interface Winner {
  id: string
  match_type: string
  prize_amount: number
  status: string
  proof_url: string | null
  admin_notes: string | null
  created_at: string
  profiles?: { full_name: string; email: string }
  draws?: { draw_month: string }
}

const matchLabels: Record<string, string> = {
  '5_match': 'Jackpot — Match 5',
  '4_match': 'Premium — Match 4',
  '3_match': 'Standard — Match 3',
}

const statusConfig: Record<string, { label: string; color: string; icon: any; glow: string }> = {
  pending:         { label: 'Pending Verification', color: 'bg-warning/10 text-warning border-warning/20', glow: '', icon: Clock },
  proof_submitted: { label: 'Proof Received',      color: 'bg-primary/10 text-primary border-primary/20', glow: 'glow-accent', icon: Upload },
  approved:        { label: 'Verified & Approved', color: 'bg-success/10 text-success border-success/20', glow: 'glow-success', icon: CheckCircle },
  rejected:        { label: 'Claim Rejected',      color: 'bg-red-500/10 text-red-400 border-red-500/20', glow: '', icon: AlertTriangle },
  paid:            { label: 'Payout Completed',    color: 'bg-secondary/10 text-secondary border-secondary/20', glow: '', icon: CheckCircle },
}

function WinnerRow({ winner }: { winner: Winner }) {
  const [isPending, start] = useTransition()
  const [notes, setNotes] = useState(winner.admin_notes ?? '')
  const cfg = statusConfig[winner.status] ?? { label: winner.status, color: 'bg-muted text-muted-foreground', icon: Clock, glow: '' }
  const Icon = cfg.icon

  const action = (status: string) =>
    start(() => updateWinnerStatus(winner.id, status as any, notes || undefined))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 hover:border-primary/50 transition-all group"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex gap-5">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-border shadow-sm",
            winner.status === 'paid' ? 'bg-secondary/20 text-secondary' : 'bg-primary/10 text-primary'
          )}>
            <Trophy className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">{matchLabels[winner.match_type] ?? winner.match_type}</span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="text-xl font-black text-primary tracking-tighter">₹{winner.prize_amount.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{winner.profiles?.full_name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Mail className="w-3.5 h-3.5" />
                <span>{winner.profiles?.email}</span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mt-3 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {winner.draws?.draw_month
                ? new Date(winner.draws.draw_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) + ' Sovereign Draw'
                : 'Unknown Draw'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className={cn(
            "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border shadow-sm",
            cfg.color,
            cfg.glow
          )}>
            <Icon className="w-3 h-3" /> {cfg.label}
          </div>
          
          {winner.proof_url && (
            <a 
              href={winner.proof_url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              Verify Evidence <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {/* Admin Notes */}
        <div className="relative">
          <textarea
            rows={2} value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Platform auditor notes…"
            className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-all resize-none font-medium"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-3 flex-wrap">
            {winner.status !== 'approved' && (
              <button 
                onClick={() => action('approved')} 
                disabled={isPending}
                className="px-6 py-2.5 bg-success/10 hover:bg-success/20 text-success border border-success/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 active:scale-95"
              >
                Approve Claim
              </button>
            )}
            {winner.status !== 'paid' && winner.status === 'approved' && (
              <button 
                onClick={() => action('paid')} 
                disabled={isPending}
                className="px-6 py-2.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 active:scale-95"
              >
                Execute Payout
              </button>
            )}
            {winner.status !== 'rejected' && (
              <button 
                onClick={() => action('rejected')} 
                disabled={isPending}
                className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 active:scale-95"
              >
                Reject Claim
              </button>
            )}
          </div>
          
          {isPending && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing...</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function AdminWinnersClient({ winners }: { winners: Winner[] }) {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = statusFilter === 'all' ? winners : winners.filter(w => w.status === statusFilter)

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12 reveal-stagger">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg glow-accent">
            <Trophy className="w-7 h-7 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Audit & Compliance</span>
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none mt-1">Winner <span className="text-primary">Verification</span></h1>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 flex-wrap p-1.5 bg-muted/30 rounded-[20px] border border-border w-fit">
        {['all', 'pending', 'proof_submitted', 'approved', 'rejected', 'paid'].map(s => {
          const count = s === 'all' ? winners.length : winners.filter(w => w.status === s).length
          const isActive = statusFilter === s
          
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-5 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-card text-primary shadow-sm border border-border" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === 'all' ? 'All Records' : statusConfig[s]?.label.split(' ')[0] ?? s}
              <span className={cn(
                "ml-2 px-1.5 py-0.5 rounded-md text-[8px] border",
                isActive ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border"
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.length === 0 ? (
          <div className="premium-card p-20 text-center space-y-4 border-dashed">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto text-muted-foreground opacity-50">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground font-bold text-lg">Queue Empty</p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">No winners found matching the selected audit criteria.</p>
            </div>
          </div>
        ) : (
          filtered.map(w => <WinnerRow key={w.id} winner={w} />)
        )}
      </div>
    </div>
  )
}
