'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DrawStatus } from '@/types/database'

export const DrawVisualizer = ({ numbers = [], status }: { numbers?: number[], status?: DrawStatus }) => {
  // If we don't have numbers yet (pending), show 5 placeholders
  const displayNumbers = numbers && numbers.length > 0 ? numbers : [0, 0, 0, 0, 0]

  return (
    <div className="space-y-6">
      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
        {status === 'pending' ? 'Cycle Verification Pending' : 'Verified Winning Sequence'}
      </h3>
      <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
        {displayNumbers.map((n, i) => (
          <motion.div 
            key={`${i}-${n}`}
            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`w-14 h-14 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center text-2xl md:text-3xl font-black shadow-2xl transition-all duration-500 hover:scale-110 hover:-rotate-3 cursor-default border ${
              n === 0 
                ? 'bg-white/[0.03] border-white/[0.05] text-zinc-700' 
                : 'bg-white text-black border-white shadow-[0_10px_40px_rgba(255,255,255,0.15)]'
            }`}
          >
            {n === 0 ? '?' : n}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

