'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Heart, Plus, Building, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react'
import { createCharity, toggleCharityStatus } from '@/lib/actions/admin'
import type { Charity } from '@/types/charity'

function CharityCard({ charity }: { charity: Charity }) {
  const [isPending, start] = useTransition()
  const toggle = () => start(() => toggleCharityStatus(charity.id, !charity.is_active))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-md border rounded-2xl p-5 transition-all ${charity.is_active ? 'border-white/10' : 'border-white/5 opacity-60'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
          <Building className="w-5 h-5 text-rose-400" />
        </div>
        <div className="flex items-center gap-2">
          {charity.is_featured && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Star className="w-2.5 h-2.5" /> Featured
            </span>
          )}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${charity.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-700 text-zinc-400 border-zinc-600'}`}>
            {charity.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <h3 className="text-sm font-bold text-white">{charity.name}</h3>
      {charity.description && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{charity.description}</p>}

      <button
        onClick={toggle} disabled={isPending}
        className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all disabled:opacity-50 ${
          charity.is_active
            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
        }`}
      >
        {isPending ? '…' : charity.is_active ? 'Deactivate' : 'Activate'}
      </button>
    </motion.div>
  )
}

export function AdminCharityClient({ charities }: { charities: Charity[] }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [featured, setFeatured] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, start] = useTransition()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setSuccess(false)
    if (!name.trim()) return setError('Charity name is required.')
    start(async () => {
      try {
        await createCharity(name.trim(), desc.trim(), featured)
        setName(''); setDesc(''); setFeatured(false); setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
          <Heart className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Charity Management</h1>
          <p className="text-zinc-400">{charities.length} charities total — {charities.filter(c => c.is_active).length} active.</p>
        </div>
      </div>

      {/* Create Form */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-rose-400" /> Add New Charity
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-500/10 rounded-xl border border-red-500/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" /> Charity created successfully!
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Charity Name *</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Junior Golf Foundation"
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-rose-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Description</label>
              <input
                value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="Short description…"
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-amber-400 w-4 h-4" />
            <span className="text-sm text-zinc-300">Mark as Featured charity</span>
          </label>
          <button
            type="submit" disabled={isPending}
            className="px-6 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl transition-all disabled:opacity-50 text-sm"
          >
            {isPending ? 'Creating…' : 'Create Charity'}
          </button>
        </form>
      </div>

      {/* Existing Charities Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">All Charities</h2>
        {charities.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-2xl text-sm">
            No charities yet. Add the first one above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {charities.map(c => <CharityCard key={c.id} charity={c} />)}
          </div>
        )}
      </div>
    </div>
  )
}
