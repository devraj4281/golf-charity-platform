'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DrawStatus } from '@/types/database'

export const DrawVisualizer = ({ numbers = [], status }: { numbers?: number[], status?: DrawStatus }) => {
  // If we don't have numbers yet (pending), show 5 placeholders
  const displayNumbers = numbers && numbers.length > 0 ? numbers : [0, 0, 0, 0, 0]

  return (
    <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/5">
      <h3 className="text-sm font-semibold mb-8 text-zinc-500 uppercase tracking-[0.2em]">
        {status === 'pending' ? 'Waiting for Draw' : 'Winning Numbers'}
      </h3>
      <div className="flex gap-4 md:gap-6 justify-center md:justify-start">
        {displayNumbers.map((n, i) => (
          <motion.div 
            key={`${i}-${n}`}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
            className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold shadow-xl ${
              n === 0 
                ? 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-600' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 border border-indigo-400/30'
            }`}
          >
            {n === 0 ? '?' : n}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
