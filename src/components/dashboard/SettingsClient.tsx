'use client'

import { useState, useTransition } from 'react'
import { Settings, User, CreditCard, Bell, AlertCircle, CheckCircle, LogOut, Shield, ChevronRight, Clock } from 'lucide-react'
import type { Profile } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { RazorpayCheckout } from '@/components/payment/RazorpayCheckout'

interface Props {
  profile: Profile
  charities: { id: string; name: string }[]
}

export function SettingsClient({ profile, charities }: Props) {
  const supabase = createClient()
  const [fullName, setFullName] = useState(profile.full_name)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSaveProfile = () => {
    setError(null); setSuccess(null)
    if (!fullName.trim()) return setError('Name cannot be empty.')
    startTransition(async () => {
      const { error: err } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      if (err) return setError('Failed to save profile.')
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const subStatusColor: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-muted text-muted-foreground border-border',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    past_due: 'bg-warning/10 text-warning border-warning/20',
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-12 reveal-stagger">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg glow-accent">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Preferences</span>
            <h1 className="text-4xl font-black text-foreground tracking-tighter leading-none mt-1">Platform <span className="text-primary">Settings</span></h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Profile Section */}
          <section className="premium-card p-8 space-y-10">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Personal Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Identity</label>
                <input
                  type="text" value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-2xl py-4 px-6 text-foreground font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Account Email</label>
                <input
                  type="email" value={profile.email} disabled
                  className="w-full bg-muted border border-border rounded-2xl py-4 px-6 text-muted-foreground font-bold cursor-not-allowed opacity-60"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-border">
              <div className="flex flex-col">
                {error && (
                  <span className="text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </span>
                )}
                {success && (
                  <span className="text-success text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> {success}
                  </span>
                )}
              </div>
              <button
                onClick={handleSaveProfile} disabled={isPending}
                className="btn-primary px-10"
              >
                {isPending ? 'Synchronizing...' : 'Save Preferences'}
              </button>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="premium-card p-8 space-y-10">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Communication</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Sovereign Draw Results', desc: 'Instant email verification when results are published.' },
                { label: 'Performance Analytics', desc: 'Weekly digest of your handicap and scoring efficiency.' },
                { label: 'Philanthropy Reports', desc: 'Detailed impact tracking for your selected charities.' },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-muted/20 border border-border hover:bg-muted/40 transition-colors group">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground uppercase tracking-wider">{n.label}</p>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{n.desc}</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-12 h-6.5 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* Subscription Card */}
          <section className="premium-card p-8 space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground tracking-tight">Financial Tier</h2>
            </div>

            <div className={cn(
              "p-6 rounded-[28px] border border-dashed flex flex-col gap-4 relative z-10",
              subStatusColor[profile.subscription_status] || "bg-muted border-border"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Membership Status</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {profile.subscription_status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-3xl font-black tracking-tighter capitalize text-foreground">
                {profile.sub_plan || 'Sovereign'} Tier
              </p>
              {profile.sub_current_period_end && (
                <div className="flex items-center gap-2 pt-2 opacity-70">
                  <Clock className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Next Cycle: {new Date(profile.sub_current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 relative z-10 space-y-3">
              {profile.subscription_status === 'active' ? (
                <div className="flex flex-col gap-3">
                  <RazorpayCheckout
                    plan={profile.sub_plan === 'monthly' ? 'yearly' : 'monthly'}
                    trigger={
                      <button className="w-full btn-primary text-[10px] py-4 uppercase tracking-widest font-black">
                        Upgrade to {profile.sub_plan === 'monthly' ? 'Annual Elite' : 'Standard Monthly'}
                      </button>
                    }
                  />
                  <button className="w-full text-[10px] py-3 uppercase tracking-widest font-black text-red-400 hover:text-red-500 transition-colors">
                    Suspend Membership
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <RazorpayCheckout
                    plan="monthly"
                    trigger={
                      <button className="w-full btn-primary text-[10px] py-4 uppercase tracking-widest font-black">
                        Activate Monthly
                      </button>
                    }
                  />
                  <RazorpayCheckout
                    plan="yearly"
                    trigger={
                      <button className="w-full btn-secondary text-[10px] py-4 uppercase tracking-widest font-black">
                        Activate Annual Elite
                      </button>
                    }
                  />
                </div>
              )}
            </div>
          </section>

          {/* Security & Support */}
          <section className="premium-card p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground tracking-tight">Security</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-5 rounded-[24px] bg-muted/20 border border-border hover:bg-muted/40 hover:border-primary/30 transition-all group">
                <span className="text-sm font-black uppercase tracking-widest text-foreground/80 group-hover:text-foreground">Update Passkey</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-5 rounded-[24px] bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all text-red-400 group"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-black uppercase tracking-widest">Terminate Session</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
