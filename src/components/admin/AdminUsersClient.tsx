'use client'

import { useState, useTransition } from 'react'
import {
  createColumnHelper, flexRender,
  getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  useReactTable, type SortingState,
} from '@tanstack/react-table'
import { Users, Search, ArrowUpDown, ShieldCheck, Mail, Calendar, User, UserCheck, MoreVertical, RefreshCw } from 'lucide-react'
import { updateUserSubscription } from '@/lib/actions/admin'
import type { Profile } from '@/types/database'
import { cn } from '@/lib/utils/cn'
import dynamic from 'next/dynamic'

const AdminUsersTable = dynamic(() => import('./AdminUsersTable').then(mod => mod.AdminUsersTable), {
  ssr: false,
  loading: () => (
    <div className="premium-card p-12 flex flex-col items-center justify-center space-y-4">
      <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Indexing Profiles...</p>
    </div>
  )
})

const col = createColumnHelper<Profile>()

const statusConfig: Record<string, { label: string; color: string }> = {
  active:    { label: 'Active',    color: 'bg-success/10 text-success border-success/20' },
  inactive:  { label: 'Inactive',  color: 'bg-muted/50 text-muted-foreground border-border' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  past_due:  { label: 'Past Due',  color: 'bg-warning/10 text-warning border-warning/20' },
}

function StatusCell({ row }: { row: Profile }) {
  const [isPending, start] = useTransition()
  const currentStatus = row.subscription_status || 'inactive'
  const cfg = statusConfig[currentStatus] || statusConfig.inactive

  const toggle = () => start(() =>
    updateUserSubscription(row.id, currentStatus === 'active' ? 'inactive' : 'active')
  )

  return (
    <div className="flex items-center gap-3">
      <span className={cn(
        "text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full border shadow-sm transition-colors",
        cfg.color
      )}>
        {cfg.label}
      </span>
      
      <button
        onClick={toggle}
        disabled={isPending}
        className="group relative p-2 rounded-xl border border-border bg-muted/20 hover:bg-primary/10 hover:border-primary/30 transition-all disabled:opacity-50 active:scale-95"
        title="Toggle Status"
      >
        <RefreshCw className={cn("w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors", isPending && "animate-spin")} />
      </button>
    </div>
  )
}

const columns = [
  col.accessor('full_name', {
    header: ({ column }) => (
      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-black transition-colors" onClick={() => column.toggleSorting()}>
        Name <ArrowUpDown className="w-3 h-3" />
      </button>
    ),
    cell: info => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">
          {info.getValue()?.substring(0, 2).toUpperCase() || <User className="w-4 h-4" />}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-foreground tracking-tight">{info.getValue() || 'Unnamed User'}</span>
          <span className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-widest leading-none mt-0.5">#{info.row.original.id.substring(0, 8)}</span>
        </div>
      </div>
    ),
  }),
  col.accessor('email', {
    header: 'Contact Info',
    cell: info => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
          <Mail className="w-3.5 h-3.5 text-muted-foreground/50" />
          {info.getValue()}
        </div>
      </div>
    ),
  }),
  col.accessor('role', {
    header: 'Access Level',
    cell: info => {
      const isAdmin = info.getValue() === 'admin'
      return (
        <div className="flex">
          <span className={cn(
            "inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border",
            isAdmin 
              ? 'bg-primary/15 text-primary border-primary/30 shadow-sm' 
              : 'bg-muted/40 text-muted-foreground border-border'
          )}>
            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5 opacity-40" />}
            {isAdmin ? 'Administrator' : 'Subscriber'}
          </span>
        </div>
      )
    },
  }),
  col.accessor('sub_plan', {
    header: 'Premium Plan',
    cell: info => (
      <span className={cn(
        "text-xs font-bold capitalize",
        info.getValue() ? "text-primary" : "text-muted-foreground/40"
      )}>
        {info.getValue() || '—'}
      </span>
    ),
  }),
  col.display({
    id: 'actions',
    header: 'Subscription Status',
    cell: ({ row }) => <StatusCell row={row.original} />,
  }),
  col.accessor('created_at', {
    header: ({ column }) => (
      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-black transition-colors" onClick={() => column.toggleSorting()}>
        Registered <ArrowUpDown className="w-3 h-3" />
      </button>
    ),
    cell: info => (
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        <Calendar className="w-3.5 h-3.5 opacity-40" />
        {new Date(info.getValue()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
    ),
  }),
]

export function AdminUsersClient({ users }: { users: Profile[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12 reveal-stagger">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xl glow-accent ring-8 ring-primary/5">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1 block">Security Audit</span>
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">User <span className="text-primary">Management</span></h1>
            <p className="text-muted-foreground font-medium mt-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              {users.length} authenticated profiles discovered
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search profiles or access levels…"
            className="w-full bg-muted/30 border border-border rounded-[22px] py-4 pl-12 pr-6 text-foreground placeholder-muted-foreground/40 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all shadow-sm"
          />
        </div>
      </div>

      <AdminUsersTable table={table} columnsCount={columns.length} />
    </div>
  )
}
