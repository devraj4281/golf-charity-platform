'use client'

import { motion } from 'framer-motion'
import { login, signup } from '@/lib/actions/actions'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft, Loader2, Mail, Lock, User, ChevronLeft } from 'lucide-react'

export function LoginClient() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = isLogin
        ? await login(formData, next || undefined)
        : await signup(formData)

      if (result?.error) {
        setError(result.error)
      } else if ((result as any)?.confirmEmail) {
        setMessage('Success! Check your email to verify your account.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest z-20 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Return Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="premium-card p-10 md:p-12 border-white/5 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-primary/20 mb-6 glow-accent">
              S
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2 text-center leading-none">
              {isLogin ? 'Sovereign' : 'Join Sovereign'}
            </h1>
            <p className="text-muted-foreground text-sm font-medium text-center max-w-[280px]">
              {isLogin
                ? 'Access your elite golf performance network'
                : 'Enter the next tier of golf philanthropy'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1" htmlFor="fullName">
                  Full Identity
                </label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={!isLogin}
                    placeholder="E.g. James Vesper"
                    className="w-full bg-muted/30 border border-border rounded-2xl px-14 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1" htmlFor="email">
                Secure Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@sovereign.com"
                  className="w-full bg-muted/30 border border-border rounded-2xl px-14 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest" htmlFor="password">
                  Access Key
                </label>
                {isLogin && (
                  <Link href="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                    Reset
                  </Link>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-muted/30 border border-border rounded-2xl px-14 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                {error}
              </motion.div>
            )}

            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3 text-primary text-xs font-bold"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary glow-accent" />
                {message}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full btn-primary py-4.5 text-lg flex items-center justify-center gap-3 group active:scale-[0.98] transition-transform"
            >
              {isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="font-black uppercase tracking-widest text-sm">{isLogin ? 'Initialize Session' : 'Create Account'}</span>
                  <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null) }}
              className="text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
            >
              {isLogin ? "New to Sovereign? Request Access" : "Already established? Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-5 text-muted-foreground/40">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">End-to-End Sovereign Security</span>
        </div>
      </motion.div>
    </div>
  )
}
