import Link from 'next/link'
import { Trophy, Target, Heart, ShieldCheck, ArrowRight, Star, CheckCircle2, Zap, Crown, Flame, Diamond, ChevronRight } from 'lucide-react'
import { getUser } from '@/lib/auth/getUser'
import { cn } from '@/lib/utils/cn'

export default async function LandingPage() {
  const user = await getUser()

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform glow-accent">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-foreground tracking-tighter leading-none">Sovereign</span>
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1">Global Impact</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-12">
            <Link href="#features" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Experience</Link>
            <Link href="#pricing" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Membership</Link>
            <Link href="#impact" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Philanthropy</Link>
          </nav>

          <div className="flex items-center gap-6">
            {user ? (
              <Link href="/dashboard" className="bg-foreground text-background px-8 py-3 rounded-[18px] font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl">
                Command Center
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                <Link href="/login" className="bg-foreground text-background px-8 py-3 rounded-[18px] font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl">
                  Request Access
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-40 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/5 blur-[150px] rounded-full -z-10 animate-pulse" />
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full -z-10 translate-x-1/2" />
          
          <div className="max-w-7xl mx-auto px-6 text-center space-y-14 relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-foreground rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-background shadow-3xl shadow-primary/20">
              <Star className="w-3.5 h-3.5 fill-primary text-primary shadow-primary/50" />
              Elite Philanthropic Golf Network
            </div>
            
            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black text-foreground tracking-tighter leading-[0.8] max-w-6xl mx-auto">
              Play with <br />
              <span className="text-primary italic">Absolute</span> <br />
              Purpose.
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              Transform your performance into global impact. Sovereign connects high-performance golfers with verified charity initiatives through the world's most secure draw engine.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
              <Link href={user ? "/dashboard" : "/login"} className="group bg-primary text-white px-14 py-6 rounded-[28px] font-black text-xl shadow-3xl shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 glow-accent">
                <span>{user ? "Enter Dashboard" : "Begin Your Journey"}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#pricing" className="px-14 py-6 rounded-[28px] font-black text-xl border-2 border-border text-foreground hover:bg-muted/50 transition-all active:scale-95">
                The Membership
              </Link>
            </div>

            {/* Dashboard Mockup Preview */}
            <div className="mt-32 relative max-w-6xl mx-auto">
              <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full -z-10" />
              <div className="premium-card p-4 md:p-6 rounded-[48px] border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden bg-card/50 backdrop-blur-3xl">
                <div className="bg-background rounded-[36px] shadow-sm border border-border/50 aspect-[16/10] relative flex items-center justify-center overflow-hidden">
                   {/* Mock UI */}
                   <div className="absolute top-0 left-0 right-0 h-16 bg-muted/30 border-b border-border flex items-center px-8 gap-4">
                      <div className="flex gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-500/20" />
                        <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/20" />
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500/20" />
                      </div>
                      <div className="ml-6 h-7 w-80 bg-muted rounded-full border border-border" />
                   </div>
                   <div className="mt-16 w-full h-full p-14 grid grid-cols-12 gap-10">
                      <div className="col-span-8 space-y-10">
                        <div className="h-72 bg-[#262630] rounded-[40px] relative overflow-hidden group border border-white/5 shadow-2xl">
                           <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent" />
                           <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                              <div className="space-y-3">
                                 <div className="h-5 w-40 bg-white/20 rounded-full" />
                                 <div className="h-10 w-64 bg-white rounded-2xl" />
                              </div>
                              <div className="h-14 w-40 bg-primary rounded-2xl shadow-xl glow-accent" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-10">
                           <div className="h-44 bg-muted/20 border border-border rounded-[40px]" />
                           <div className="h-44 bg-muted/20 border border-border rounded-[40px]" />
                        </div>
                      </div>
                      <div className="col-span-4 space-y-10">
                        <div className="h-60 bg-primary/5 border border-primary/20 rounded-[40px] shadow-lg glow-accent" />
                        <div className="h-60 bg-success/5 border border-success/20 rounded-[40px] shadow-lg glow-success" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-40 bg-[#12121a] text-white overflow-hidden relative border-y border-white/5">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-success/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  Sustainable Philanthropy
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                  Score High, <br />
                  <span className="text-primary italic">Give Higher.</span>
                </h2>
                <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-xl">
                  We bridge the gap between competitive excellence and social responsibility. Every membership contributes to verified, high-impact projects globally.
                </p>
                <div className="space-y-6 pt-6">
                  {[
                    "Direct verification of charity payouts",
                    "Real-time impact tracking on your dashboard",
                    "Global network of philanthropic partners"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 group">
                      <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform glow-accent">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-foreground font-black uppercase tracking-widest text-[10px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <div className="aspect-square bg-white/5 rounded-[80px] border border-white/10 overflow-hidden shadow-3xl relative backdrop-blur-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Heart className="w-40 h-40 text-primary animate-pulse shadow-primary/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-40 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center space-y-8 mb-32">
               <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] glow-accent">
                  Membership Tiers
               </div>
               <h2 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-none">The Sovereign <span className="text-primary italic">Protocol.</span></h2>
               <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-xl leading-relaxed">Choose your level of engagement and start your impact journey today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Basic Tier */}
              <div className="premium-card p-12 space-y-12 border-border/50 hover:scale-[1.03] transition-all group">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground shadow-inner group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Flame className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground tracking-tight">Active Tier</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">Perfect for consistent players focused on baseline impact.</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-foreground tracking-tighter">₹499</span>
                  <span className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px]">/ Monthly</span>
                </div>
                <div className="space-y-5">
                  {[
                    "Unlimited Performance Tracking",
                    "Monthly Grand Draw Access",
                    "Philanthropic Ledger",
                    "Verified Impact Reports"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-success glow-success" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard?plan=monthly" className="block w-full py-5 bg-muted border border-border rounded-[24px] font-black text-center text-[10px] uppercase tracking-[0.2em] text-foreground hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                  Select Active
                </Link>
              </div>

              {/* Pro Tier (Featured) */}
              <div className="premium-card p-14 space-y-14 relative overflow-hidden bg-foreground text-background scale-[1.08] shadow-[0_50px_100px_-20px_rgba(173,158,253,0.3)] z-10 border-primary/20">
                <div className="absolute top-0 right-0 p-10 text-primary opacity-10">
                  <Zap className="w-40 h-40" />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 glow-accent">
                    <Crown className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-black text-white tracking-tight leading-none uppercase">Sovereign</h3>
                    <span className="px-3 py-1 bg-primary rounded-md text-[8px] font-black uppercase tracking-[0.2em] text-white">Elite</span>
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed">The definitive experience for absolute performance and maximum impact.</p>
                </div>
                <div className="flex items-baseline gap-3 relative z-10">
                  <span className="text-7xl font-black text-white tracking-tighter">₹999</span>
                  <span className="text-primary/70 font-black uppercase tracking-[0.2em] text-[10px]">/ Monthly</span>
                </div>
                <div className="space-y-5 relative z-10">
                  {[
                    "Priority Verification Queue",
                    "Advanced Scoring Analytics",
                    "Sovereign Network Access",
                    "Custom Charity Routing",
                    "VVIP Support Concierge"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary glow-accent" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard?plan=monthly" className="block w-full py-6 bg-primary text-white rounded-[28px] font-black text-center text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-3xl shadow-primary/30 relative z-10 active:scale-95">
                  Become Sovereign
                </Link>
              </div>

              {/* Elite Tier */}
              <div className="premium-card p-12 space-y-12 border-border/50 hover:scale-[1.03] transition-all group">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground shadow-inner group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Diamond className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground tracking-tight">Institutional</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">Scalable solutions for elite clubs and professional networks.</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-foreground tracking-tighter">Bespoke</span>
                </div>
                <div className="space-y-5">
                  {[
                    "Multi-User Federation",
                    "Custom Brand Integration",
                    "Corporate Tax Benefit Docs",
                    "Dedicated Impact Officer",
                    "Enterprise Draw Engine"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-success glow-success" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/support" className="block w-full py-5 bg-muted border border-border rounded-[24px] font-black text-center text-[10px] uppercase tracking-[0.2em] text-foreground hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                  Request Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
             <div className="bg-foreground rounded-[80px] p-20 md:p-32 text-center text-background relative shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=2000')] opacity-5 grayscale bg-cover bg-center mix-blend-overlay" />
                
                <div className="relative z-10 space-y-16">
                   <h2 className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.8] max-w-5xl mx-auto">
                      Your Next Round <br />
                      Is The <span className="text-primary italic">Legacy.</span>
                   </h2>
                   <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                      <Link href="/login" className="bg-primary text-white px-16 py-7 rounded-[32px] font-black text-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-3xl shadow-primary/30 glow-accent">
                        Enter The Tier
                      </Link>
                      <Link href="/support" className="px-16 py-7 rounded-[32px] font-black text-2xl border-2 border-white/20 hover:bg-white/10 transition-all active:scale-95">
                        Consult Advisory
                      </Link>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border/50 py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-32">
            <div className="col-span-1 lg:col-span-2 space-y-10">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20 glow-accent">S</div>
                <span className="text-3xl font-black text-foreground tracking-tighter">Sovereign</span>
              </Link>
              <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-md">
                The definitive platform for golfers who believe performance and purpose are inseparable. Secure. Transparent. Sovereign.
              </p>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Protocol</h4>
              <nav className="flex flex-col gap-5">
                {["Experience", "Membership", "Philanthropy", "Security"].map((link) => (
                  <Link key={link} href="#" className="text-xs font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]">{link}</Link>
                ))}
              </nav>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Advisory</h4>
              <nav className="flex flex-col gap-5">
                {["Our Mission", "Impact Ledger", "Terms of Use", "Support"].map((link) => (
                  <Link key={link} href="#" className="text-xs font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]">{link}</Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="pt-32 mt-32 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-12">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">© 2024 Sovereign Golf Philanthropy. Global Protocol v4.0</p>
            <div className="flex flex-wrap items-center justify-center gap-10">
              <div className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Quantum Encryption</span>
              </div>
              <div className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse shadow-[0_0_10px_rgba(148,253,182,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Network Active</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
