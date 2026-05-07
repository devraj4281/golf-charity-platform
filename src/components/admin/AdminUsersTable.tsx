'use client'

import { flexRender, type Table } from '@tanstack/react-table'
import { Users } from 'lucide-react'
import type { Profile } from '@/types/database'

interface AdminUsersTableProps {
  table: Table<Profile>
  columnsCount: number
}

export function AdminUsersTable({ table, columnsCount }: AdminUsersTableProps) {
  return (
    <div className="premium-card overflow-hidden border-primary/5 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-border bg-muted/20">
                {hg.headers.map(h => (
                  <th key={h.id} className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/70">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border/50">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columnsCount} className="text-center py-24">
                  <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                    <Users className="w-12 h-12" />
                    <p className="text-sm font-black uppercase tracking-widest">No matching profiles</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-primary/[0.03] transition-all duration-300 group/row">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-8 py-6 align-middle">
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
  )
}
