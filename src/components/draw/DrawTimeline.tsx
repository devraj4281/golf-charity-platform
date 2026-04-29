'use client'

import React from 'react'

export const DrawTimeline = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">Draw Schedule</h4>
      <div className="relative border-l-2 border-white/10 pl-6 space-y-8">
        <div className="relative">
          <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900" />
          <p className="text-white font-medium">Next Draw: May 1st, 2026</p>
          <p className="text-sm text-white/40">Entries close in 2 days</p>
        </div>
      </div>
    </div>
  )
}
