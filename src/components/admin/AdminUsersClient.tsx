'use client'

import { useState, useTransition } from 'react'
import {
  createColumnHelper, flexRender,
  getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  useReactTable, type SortingState,
} from '@tanstack/react-table'
import { Users, Search, ArrowUpDown, ShieldCheck } from 'lucide-react'
import { updateUserSubscription } from '@/lib/actions/admin'
import type { Profile } from '@/types/database'

const col = createColumnHelper<Profile>()

const statusColor: Record<string, string> = {
  active:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  inactive: 'bg-zinc-700 text-zinc-400 border-zinc-600',
  cancelled:'bg-red-500/10 text-red-400 border-red-500/20',
  past_due: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

function StatusCell({ row }: { row: Profile }) {
  const [isPending, start] = useTransition()
  const toggle = () => start(() =>
    updateUserSubscription(row.id, row.subscription_status === 'active' ? 'inactive' : 'active')
  )
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColor[row.subscription_status] ?? ''}`}>
        {row.subscription_status}
      </span>
      <button
        onClick={toggle} disabled={isPending}
        className="text-xs text-zinc-500 hover:text-white underline transition-colors disabled:opacity-50"
      >
        {isPending ? '…' : 'Toggle'}
      </button>
    </div>
  )
}

const columns = [
  col.accessor('full_name', {
    header: ({ column }) => (
      <button className="flex items-center gap-1 text-zinc-400 hover:text-white" onClick={() => column.toggleSorting()}>
        Name <ArrowUpDown className="w-3.5 h-3.5" />
      </button>
    ),
    cell: info => <span className="text-sm font-semibold text-white">{info.getValue()}</span>,
  }),
  col.accessor('email', {
    header: 'Email',
    cell: info => <span className="text-sm text-zinc-400">{info.getValue()}</span>,
  }),
  col.accessor('role', {
    header: 'Role',
    cell: info => (
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${info.getValue() === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
        {info.getValue() === 'admin' ? <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> admin</span> : 'subscriber'}
      </span>
    ),
  }),
  col.accessor('sub_plan', {
    header: 'Plan',
    cell: info => <span className="text-sm text-zinc-300 capitalize">{info.getValue() ?? '—'}</span>,
  }),
  col.display({
    id: 'actions',
    header: 'Subscription',
    cell: ({ row }) => <StatusCell row={row.original} />,
  }),
  col.accessor('created_at', {
    header: ({ column }) => (
      <button className="flex items-center gap-1 text-zinc-400 hover:text-white" onClick={() => column.toggleSorting()}>
        Joined <ArrowUpDown className="w-3.5 h-3.5" />
      </button>
    ),
    cell: info => <span className="text-xs text-zinc-500">{new Date(info.getValue()).toLocaleDateString('en-IN')}</span>,
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Users className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">User Management</h1>
          <p className="text-zinc-400">{users.length} total users registered.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="border-b border-white/10">
                  {hg.headers.map(h => (
                    <th key={h.id} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length} className="text-center py-12 text-zinc-500 text-sm">No users found.</td></tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
