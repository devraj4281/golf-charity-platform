'use client'

import React from 'react'

export const CharitySelector = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['Green Earth', 'Ocean Clean', 'Education for All'].map((charity) => (
        <button key={charity} className="p-4 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all text-left">
          <p className="text-white font-medium">{charity}</p>
          <p className="text-xs text-white/40">Supporting local communities since 2010</p>
        </button>
      ))}
    </div>
  )
}
