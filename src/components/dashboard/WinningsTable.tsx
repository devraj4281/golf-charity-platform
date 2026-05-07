'use client'

import { flexRender, type Table } from '@tanstack/react-table'
import { Trophy } from 'lucide-react'

interface WinningsTableProps {
  table: Table<any>
}

export function WinningsTable({ table }: WinningsTableProps) {
  return (
    <section className="premium-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="bg-muted/30">
                {hg.headers.map(h => (
                  <th key={h.id} className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-20 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="font-medium">No winnings recorded yet. Keep playing!</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors group">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-8 py-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
