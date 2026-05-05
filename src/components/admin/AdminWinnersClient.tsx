'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Trophy, CheckCircle, AlertTriangle, Clock, Upload, ArrowRight } from 'lucide-react'
import { updateWinnerStatus } from '@/lib/actions/admin'

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
  '5_match': 'Match 5 — Jackpot',
  '4_match': 'Match 4',
  '3_match': 'Match 3',
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending:         { label: 'Pending',         color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',    icon: Clock },
  proof_submitted: { label: 'Proof Submitted', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: Upload },
  approved:        { label: 'Approved',        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  rejected:        { label: 'Rejected',        color: 'bg-red-500/10 text-red-400 border-red-500/20',          icon: AlertTriangle },
  paid:            { label: 'Paid',            color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: CheckCircle },
}

function WinnerRow({ winner }: { winner: Winner }) {
  const [isPending, start] = useTransition()
  const [notes, setNotes] = useState(winner.admin_notes ?? '')
  const cfg = statusConfig[winner.status] ?? { label: winner.status, color: '', icon: Clock }
  const Icon = cfg.icon

  const action = (status: string) =>
    start(() => updateWinnerStatus(winner.id, status as any, notes || undefined))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/20 transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white">{matchLabels[winner.match_type] ?? winner.match_type}</span>
            <span className="text-sm font-bold text-emerald-400">₹{winner.prize_amount.toLocaleString()}</span>
          </div>
          <p className="text-sm text-zinc-300">{winner.profiles?.full_name} — <span className="text-zinc-500">{winner.profiles?.email}</span></p>
          <p className="text-xs text-zinc-600">
            {winner.draws?.draw_month
              ? new Date(winner.draws.draw_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) + ' Draw'
              : '—'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
            <Icon className="w-3 h-3" /> {cfg.label}
          </span>
        </div>
      </div>

      {winner.proof_url && (
        <a href={winner.proof_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 underline">
          View Proof <ArrowRight className="w-3 h-3" />
        </a>
      )}

      {/* Admin Notes */}
      <textarea
        rows={2} value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Admin notes (optional)…"
        className="w-full mt-3 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
      />

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {winner.status !== 'approved' && (
          <button onClick={() => action('approved')} disabled={isPending}
            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl transition-all disabled:opacity-50">
            ✓ Approve
          </button>
        )}
        {winner.status !== 'paid' && winner.status === 'approved' && (
          <button onClick={() => action('paid')} disabled={isPending}
            className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-bold rounded-xl transition-all disabled:opacity-50">
            💰 Mark Paid
          </button>
        )}
        {winner.status !== 'rejected' && (
          <button onClick={() => action('rejected')} disabled={isPending}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition-all disabled:opacity-50">
            ✗ Reject
          </button>
        )}
        {isPending && <span className="text-xs text-zinc-500 self-center">Saving…</span>}
      </div>
    </motion.div>
  )
}

export function AdminWinnersClient({ winners }: { winners: Winner[] }) {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = statusFilter === 'all' ? winners : winners.filter(w => w.status === statusFilter)

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Winner Management</h1>
          <p className="text-zinc-400">Review proofs, approve payouts, and update statuses.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'proof_submitted', 'approved', 'rejected', 'paid'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              statusFilter === s
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            {s === 'all' ? 'All' : statusConfig[s]?.label ?? s} ({s === 'all' ? winners.length : winners.filter(w => w.status === s).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-2xl text-sm">
            No winners in this category.
          </div>
        ) : (
          filtered.map(w => <WinnerRow key={w.id} winner={w} />)
        )}
      </div>
    </div>
  )
}
