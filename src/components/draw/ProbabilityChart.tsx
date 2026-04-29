'use client'

import React from 'react'

export const ProbabilityChart = () => {
  return (
    <div className="h-48 flex items-end gap-2 justify-between">
      {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
        <div 
          key={i} 
          style={{ height: `${h}%` }} 
          className="flex-1 bg-gradient-to-t from-indigo-500/20 to-indigo-500 rounded-t-sm"
        />
      ))}
    </div>
  )
}
