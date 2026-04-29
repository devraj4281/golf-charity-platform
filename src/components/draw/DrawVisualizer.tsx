'use client'

import React from 'react'

export const DrawVisualizer = () => {
  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
      <h3 className="text-xl font-semibold mb-4 text-white">Live Draw Visualizer</h3>
      <div className="flex gap-4 justify-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-indigo-500/20">
            ?
          </div>
        ))}
      </div>
    </div>
  )
}
