'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Profile, Draw, Score } from '@/types/database'
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Heart, 
  Wallet,
  ArrowRight,
  Clock,
  Calendar,
  ChevronRight,
  CreditCard,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { RazorpayCheckout } from '@/components/payment/RazorpayCheckout'
import Image from 'next/image'

interface Props {
  profile: Profile
  latestDraw: Draw | null
  initialScores: Score[]
  totalWinnings: number
  totalCharity: number
}

export default function DashboardClient({ profile, latestDraw, initialScores, totalWinnings, totalCharity }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planParam = searchParams.get('plan') as 'monthly' | 'yearly' | null
  const [autoCheckout, setAutoCheckout] = useState(false)

  const firstName = profile.full_name?.split(' ')[0] || 'Golfer'
  const isSubscribed = profile.subscription_status === 'active'
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  
  useEffect(() => {
    if (planParam && !isSubscribed) {
      setAutoCheckout(true)
    }
  }, [planParam, isSubscribed])

  // Calculate stats
  const totalRounds = initialScores.length
  const bestScore = initialScores.length > 0 ? Math.max(...initialScores.map(s => s.score)) : 0
  
  // Draw countdown (simplified)
  const drawDate = latestDraw ? new Date(latestDraw.draw_month) : new Date()
  const daysLeft = Math.max(0, Math.ceil((drawDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 reveal-stagger">
      {/* Auto-checkout handler */}
      {autoCheckout && planParam && (
        <RazorpayCheckout 
          plan={planParam} 
          autoOpen={true}
          onSuccess={() => {
            setAutoCheckout(false)
            router.refresh()
          }}
          onCancel={() => setAutoCheckout(false)}
          onError={() => setAutoCheckout(false)}
        />
      )}
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Good Morning, {firstName}</h1>
          <p className="text-muted-foreground font-medium">Welcome back to your Sovereign command center.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-2xl shadow-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground/80">{today}</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Hero & Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Grand Draw Hero */}
          <section className="relative overflow-hidden bg-[#262630] rounded-[32px] p-8 md:p-10 text-white group border border-white/5 shadow-2xl glow-accent">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-l from-primary/30 to-transparent" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse glow-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
                  {latestDraw?.status === 'pending' ? 'Active Draw' : 'Next Draw Scheduled'}
                </span>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                  {latestDraw ? new Date(latestDraw.draw_month).toLocaleDateString('en-US', { month: 'long' }) : 'Monthly'} <span className="text-primary">Grand Draw</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-md font-medium leading-relaxed">
                  Support {profile.charity_id ? 'your chosen' : 'a global'} charity initiative and enter to win this month's jackpot.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Time Remaining</p>
                  <div className="flex items-center gap-2 text-2xl font-black tracking-tight">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{daysLeft}d 05h 22m</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Jackpot Prize</p>
                  <div className="text-2xl font-black text-primary tracking-tight">
                    ₹{(latestDraw?.total_pool || 250000).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                {isSubscribed ? (
                  <button className="btn-primary flex items-center gap-2 group/btn !bg-white !text-slate-900 !hover:bg-primary !hover:text-white transition-all">
                    <span>Record New Score</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <RazorpayCheckout 
                    plan="monthly"
                    trigger={
                      <button className="btn-primary flex items-center gap-2 group/btn">
                        <span>Subscribe to Enter</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    }
                  />
                )}
              </div>
            </div>
          </section>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="premium-card p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground">Subscription</p>
                <div className="flex flex-col gap-2">
                  <p className={cn("text-2xl font-black tracking-tight", isSubscribed ? "text-foreground" : "text-warning")}>
                    {isSubscribed ? 'Active Status' : 'Inactive'}
                  </p>
                  <div className={cn(
                    "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full w-fit border",
                    isSubscribed ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", isSubscribed ? "bg-success glow-success" : "bg-warning")} />
                    <span>{isSubscribed ? (profile.sub_plan === 'yearly' ? 'Sovereign Elite' : 'Sovereign Tier') : 'Not Enrolled'}</span>
                  </div>
                </div>
              </div>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center glow-accent", isSubscribed ? "bg-primary/10" : "bg-warning/10")}>
                {isSubscribed ? <TrendingUp className="w-7 h-7 text-primary" /> : <CreditCard className="w-7 h-7 text-warning" />}
              </div>
            </div>

            <div className="premium-card p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground">Best Performance</p>
                <p className="text-2xl font-black text-foreground tracking-tight">{bestScore > 0 ? `${bestScore} Points` : '—'}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2">Verified over {totalRounds} rounds</p>
              </div>
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center glow-accent">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Recent Rounds</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View Performance Log</button>
            </div>
            <div className="space-y-4">
              {initialScores.length === 0 ? (
                <div className="premium-card p-12 text-center space-y-4 border-dashed">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto text-muted-foreground">
                    <Target className="w-8 h-8" />
                  </div>
                  <p className="text-muted-foreground font-medium italic">No rounds recorded this period. Record your first score to enter.</p>
                </div>
              ) : (
                initialScores.slice(0, 3).map((score) => (
                  <div key={score.id} className="premium-card p-5 flex items-center justify-between group hover:border-primary/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors glow-accent">
                        <span className="text-lg font-black text-foreground group-hover:text-white">{score.score}</span>
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">Stableford Verified</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{new Date(score.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">+1 Entry Point</p>
                      <div className="flex items-center gap-1.5 justify-end mt-1">
                        <div className="w-1.5 h-1.5 bg-success rounded-full glow-success" />
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Verified</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Financials & Charity */}
        <div className="space-y-8">
          
          {/* Earnings Card */}
          <section className="premium-card p-8 space-y-8 bg-card border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground tracking-tight">Financials</h3>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center glow-accent">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-foreground tracking-tighter">₹{totalWinnings.toLocaleString()}</p>
              <p className="text-sm font-medium text-muted-foreground leading-none">Total Sovereign Winnings</p>
            </div>
            <button className="w-full py-4 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-white/5 transition-all active:scale-95">
              Manage Secure Payouts
            </button>
          </section>

          {/* Charity Impact Card */}
          <section className="premium-card p-8 space-y-8 bg-gradient-to-br from-card to-success/5 border-success/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground tracking-tight">Social Impact</h3>
              <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center glow-success">
                <Heart className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-5xl font-black text-success tracking-tighter">
                  {Math.round(totalCharity / 100)}kg
                </p>
                <p className="text-sm font-medium text-muted-foreground leading-none">Plastic removed from oceans</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Community Goal</span>
                  <span className="text-success">75% Complete</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden border border-border/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    className="h-full bg-success rounded-full glow-success" 
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-[24px] flex items-center gap-4 group cursor-pointer hover:border-success/30 transition-all">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border relative">
                <Image src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=100" alt="Ocean Cleanup" fill className="object-cover grayscale group-hover:grayscale-0 transition-all" sizes="40px" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-foreground leading-tight">The Ocean Cleanup</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Active Partner</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-success transition-transform group-hover:translate-x-1" />
            </div>
          </section>

          {/* Prompt to Subscribe if not active */}
          {!isSubscribed && (
            <section className="bg-warning rounded-[32px] p-8 text-white space-y-6 shadow-2xl shadow-warning/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-3 relative z-10">
                <AlertCircle className="w-8 h-8" />
                <p className="text-xl font-black tracking-tight">Entry Suspended</p>
              </div>
              <p className="text-sm text-white/90 font-medium leading-relaxed relative z-10">
                Your subscription is currently inactive. Re-activate now to participate in this month's draw and protect your streak.
              </p>
              <RazorpayCheckout 
                plan="monthly"
                trigger={
                  <button className="w-full py-4 bg-white text-warning font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-amber-50 transition-all active:scale-95 shadow-xl relative z-10">
                    Re-activate Subscription
                  </button>
                }
              />
            </section>
          )}

        </div>

      </div>
    </div>
  )
}
