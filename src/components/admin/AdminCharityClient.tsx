'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Heart, Plus, Building, CheckCircle, AlertCircle, Star } from 'lucide-react'
import { createCharity, toggleCharityStatus } from '@/lib/actions/admin'
import type { Charity } from '@/types/charity'
import { cn } from '@/lib/utils/cn'

function CharityCard({ charity }: { charity: Charity }) {
  const [isPending, start] = useTransition()
  const toggle = () => start(() => toggleCharityStatus(charity.id, !charity.is_active))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={cn(
        "premium-card p-6 transition-all duration-300",
        !charity.is_active && "opacity-60 border-dashed"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center glow-accent">
          <Building className="w-6 h-6 text-red-400" />
        </div>
        <div className="flex items-center gap-2">
          {charity.is_featured && (
            <span className="text-[10px] font-black px-2 py-1 rounded-full bg-warning/10 text-warning border border-warning/20 flex items-center gap-1 uppercase tracking-widest">
              <Star className="w-3 h-3 fill-warning" /> Featured
            </span>
          )}
          <span className={cn(
            "text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest",
            charity.is_active ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground border-border'
          )}>
            {charity.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-foreground leading-tight">{charity.name}</h3>
      {charity.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-medium">{charity.description}</p>}

      <button
        onClick={toggle} disabled={isPending}
        className={cn(
          "mt-6 w-full text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border transition-all disabled:opacity-50",
          charity.is_active
            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
            : 'bg-success/10 text-success border-success/20 hover:bg-success/20'
        )}
      >
        {isPending ? 'Processing…' : charity.is_active ? 'Deactivate Charity' : 'Activate Charity'}
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
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 reveal-stagger">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center glow-accent">
          <Heart className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Charity Management</h1>
          <p className="text-muted-foreground font-medium">{charities.length} organizations registered — {charities.filter(c => c.is_active).length} active partners.</p>
        </div>
      </div>

      {/* Create Form */}
      <div className="premium-card p-8 md:p-10">
        <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
          <Plus className="w-6 h-6 text-primary" /> Add New Charity
        </h2>
        <form onSubmit={handleCreate} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-4 bg-red-500/10 rounded-2xl border border-red-500/20 glow-accent">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-success text-sm p-4 bg-success/10 rounded-2xl border border-success/20 glow-success">
              <CheckCircle className="w-5 h-5" /> Charity partner registered successfully!
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Charity Name *</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Junior Golf Foundation"
                className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-foreground placeholder-muted-foreground/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
              <input
                value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="What is their primary mission?"
                className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-foreground placeholder-muted-foreground/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className={cn(
              "w-5 h-5 rounded-md border-2 border-primary/30 flex items-center justify-center transition-all group-hover:border-primary",
              featured && "bg-primary border-primary"
            )}>
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="sr-only" />
              {featured && <CheckCircle className="w-4 h-4 text-white" />}
            </div>
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Feature this charity on the dashboard</span>
          </label>
          
          <button
            type="submit" disabled={isPending}
            className="btn-primary w-full md:w-auto px-12"
          >
            {isPending ? 'Registering…' : 'Register Charity Partner'}
          </button>
        </form>
      </div>

      {/* Existing Charities Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">All Partner Organizations</h2>
        {charities.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-[32px] text-sm font-medium italic">
            No charities registered yet. Add your first partner above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {charities.map(c => <CharityCard key={c.id} charity={c} />)}
          </div>
        )}
      </div>
    </div>
  )
}
