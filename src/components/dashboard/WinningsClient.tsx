'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { 
  Wallet, 
  Trophy, 
  CheckCircle, 
  Clock, 
  ArrowUpDown, 
  AlertTriangle, 
  Upload, 
  ChevronRight,
  Filter,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

import dynamic from 'next/dynamic'

const WinningsTable = dynamic(() => import('./WinningsTable').then(mod => mod.WinningsTable), {
  ssr: false,
  loading: () => (
    <div className="premium-card p-12 flex flex-col items-center justify-center space-y-4">
      <Clock className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loading History...</p>
    </div>
  )
})

interface WinnerRow {
  id: string
  draw_id: string
  match_type: string
  prize_amount: number
  status: string
  proof_url: string | null
  admin_notes: string | null
  created_at: string
  draws?: { draw_month: string; drawn_numbers: number[] }
}

const matchLabels: Record<string, string> = {
  '5_match': 'Match 5 — Jackpot',
  '4_match': 'Match 4',
  '3_match': 'Match 3',
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending:          { label: 'Pending',          color: 'bg-warning/10 text-warning border-warning/20',   icon: Clock },
  proof_submitted:  { label: 'Under Review',     color: 'bg-primary/10 text-primary border-primary/20', icon: Upload },
  approved:         { label: 'Approved',          color: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
  rejected:         { label: 'Rejected',          color: 'bg-red-500/10 text-red-400 border-red-500/20',         icon: AlertTriangle },
  paid:             { label: 'Paid',              color: 'bg-primary text-white border-transparent glow-accent', icon: CheckCircle },
}

const col = createColumnHelper<WinnerRow>()
const columns = [
  col.accessor(r => r.draws?.draw_month ?? r.created_at, {
    id: 'month',
    header: 'Draw Month',
    cell: info => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-foreground">
          {new Date(info.getValue<string>()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Draw Event</span>
      </div>
    ),
  }),
  col.accessor('match_type', {
    header: 'Match Type',
    cell: info => <span className="text-sm font-medium text-foreground/80">{matchLabels[info.getValue()] ?? info.getValue()}</span>,
  }),
  col.accessor('prize_amount', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Prize <ArrowUpDown className="w-3.5 h-3.5" />
      </button>
    ),
    cell: info => <span className="text-sm font-black text-foreground">₹{info.getValue<number>().toLocaleString()}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: info => {
      const cfg = statusConfig[info.getValue()] ?? { label: info.getValue(), color: 'bg-muted/40 text-muted-foreground border-border', icon: Clock }
      const Icon = cfg.icon
      return (
        <span className={cn(
          "inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full border",
          cfg.color
        )}>
          <Icon className="w-3 h-3" /> {cfg.label.toUpperCase()}
        </span>
      )
    },
  }),
]

interface Props {
  winners: WinnerRow[]
  totalWinnings: number
  pendingAmount: number
  paidAmount: number
}

export function WinningsClient({ winners, totalWinnings, pendingAmount, paidAmount }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: winners,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 reveal-stagger">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings Overview</h1>
          <p className="text-muted-foreground font-medium">Manage your prize winnings and track payment statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-card border border-border rounded-xl hover:bg-muted/40 transition-colors">
            <Download className="w-5 h-5 text-foreground" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 btn-primary">
            <span>Withdraw All</span>
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Lifetime Winnings',  value: totalWinnings, icon: Trophy,    color: 'indigo' },
          { label: 'Pending Approval',  value: pendingAmount, icon: Clock,     color: 'amber' },
          { label: 'Paid to Account',    value: paidAmount,    icon: CheckCircle, color: 'emerald' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6 space-y-4"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              s.color === 'indigo' ? "bg-primary/10 text-primary" :
              s.color === 'amber' ? "bg-warning/10 text-warning" :
              "bg-success/10 text-success"
            )}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-foreground">₹{s.value.toLocaleString()}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verification Action Needed */}
      {winners.some(w => w.status === 'pending') && (
        <section className="bg-primary rounded-[24px] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/20 glow-accent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold">Action Required: Verify Score</p>
              <p className="text-white/80 text-sm font-medium">Please upload a photo of your scorecard to claim your prize.</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2">
            Upload Scorecard <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* History Table */}
      <div className="space-y-4">
        <div className="px-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Winning History</h2>
          <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        <WinningsTable table={table} />
      </div>
    </div>
  )
}
