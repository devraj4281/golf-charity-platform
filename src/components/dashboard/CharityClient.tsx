'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, CheckCircle, AlertCircle, Building, ChevronRight, Globe, Wind, Droplets } from 'lucide-react'
import type { Charity } from '@/types/charity'
import { selectCharity } from '@/lib/actions/charity'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

interface Props {
  charities: Charity[]
  selectedCharityId: string | null
  currentPct: number
  totalContributed: number
}

export function CharityClient({ charities, selectedCharityId, currentPct, totalContributed }: Props) {
  const [selected, setSelected] = useState(selectedCharityId ?? '')
  const [pct, setPct] = useState(currentPct)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const selectedCharity = charities.find(c => c.id === selected) || charities[0]

  const handleSave = () => {
    setError(null)
    setSuccess(false)
    if (!selected) return setError('Please select a charity first.')
    startTransition(async () => {
      try {
        await selectCharity(selected, pct)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 reveal-stagger">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Charity Impact</h1>
          <p className="text-slate-500 font-medium">Your golf rounds translate directly into life-changing impact.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
          <Heart className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">Level 4 Contributor</span>
        </div>
      </header>

      {/* Impact Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Impact Card */}
        <section className="lg:col-span-2 premium-card p-8 bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Heart className="w-32 h-32 text-emerald-600" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Impact Generated</p>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black text-slate-900">45.2</span>
                <span className="text-2xl font-bold text-emerald-600 mb-2">Kilograms</span>
              </div>
              <p className="text-slate-500 font-medium">Equivalent to 2,260 plastic bottles removed from oceans.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lifetime Giving</p>
                <p className="text-xl font-bold text-slate-900">₹{totalContributed.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Milestone</p>
                <p className="text-xl font-bold text-slate-900">50kg</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rank</p>
                <p className="text-xl font-bold text-indigo-600">Top 5%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Charity Card */}
        <section className="premium-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Selected Cause</h3>
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <Building className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 relative">
              <Image 
                src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=600" 
                alt="Impact" 
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover" 
              />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{selectedCharity?.name || 'Ocean Cleanup'}</p>
              <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-1">
                {selectedCharity?.description || 'Developing advanced technologies to rid the world\'s oceans of plastic.'}
              </p>
            </div>
            <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
              View Website <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contribution Level */}
        <section className="premium-card p-8 space-y-8">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Contribution Level</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">{pct}% of Monthly Fee</p>
                  <p className="text-xs text-slate-500 font-medium">Minimum requirement is 10%</p>
                </div>
                <span className="text-4xl font-black text-indigo-600">{pct}%</span>
              </div>
              
              <input
                type="range" min="10" max="100" step="5"
                value={pct}
                onChange={e => setPct(Number(e.target.value))}
                className="w-full h-3 appearance-none rounded-full bg-slate-100 cursor-pointer accent-indigo-600 border border-slate-200"
              />
              
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-700">Estimated Monthly Impact</p>
                  <p className="text-lg font-bold text-indigo-600">₹{Math.round(4900 * pct / 100).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? 'Updating...' : 'Save Contribution Preferences'}
            </button>
          </div>
        </section>

        {/* Other Causes */}
        <section className="premium-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Available Causes</h2>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Directory</span>
          </div>

          <div className="space-y-4">
            {charities.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                  selected === c.id 
                    ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    selected === c.id ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400"
                  )}>
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{c.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Environment & Sustainability</p>
                  </div>
                </div>
                {selected === c.id ? (
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                )}
              </button>
            ))}
          </div>
        </section>

      </div>
      
      {/* Alert Messaging */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-8 right-8 p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50",
              error ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
            )}
          >
            {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span className="font-bold text-sm">{error || 'Preferences updated successfully!'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
