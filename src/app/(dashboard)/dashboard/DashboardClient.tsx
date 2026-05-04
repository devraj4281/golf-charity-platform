'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Script from 'next/script'
import type { Profile, Draw } from '@/types/database'
import { DrawSection } from '@/components/draw/DrawSection'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { Trophy, Activity, Heart, BarChart3, ArrowRight } from 'lucide-react'

// Add Razorpay type to window to prevent TS errors
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function DashboardClient({ profile, latestDraw }: { profile: Profile, latestDraw: Draw | null }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const isActive = profile.subscription_status === 'active'

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan)
    setError(null)

    try {
      // 1. Generate Order ID on Backend
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })
      const data = await res.json()
      
      if (!data.order_id) {
        throw new Error(data.error || 'Failed to initialize Razorpay')
      }

      // 2. Launch Razorpay UI Menu manually
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_public_key',
        amount: data.amount,
        currency: "INR",
        name: "Golf Charity Platform",
        description: `Premium ${plan === 'monthly' ? 'Monthly' : 'Yearly'} Access`,
        order_id: data.order_id,
        handler: async function (response: any) {
          // 3. Razorpay confirmed charge, now tell Backend to Verify Cryptographic signatures natively
          try {
             const verifyRes = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  planType: plan
                })
             })
             
             const verifyData = await verifyRes.json()
             if (verifyData.success) {
               window.location.reload() // Successful update, refreshes to reveal active mode!
             } else {
               setError('Security verification failed. Please contact support.')
             }
          } catch(e) {
             setError('Failed to record active subscription.')
          }
        },
        prefill: {
          name: data.user_name,
          email: data.user_email,
        },
        theme: {
          color: "#09090b" // Zinc-950
        }
      }

      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', function (response: any){
        setError(`Payment Failed: ${response.error.description}`)
      })

      rzp.open()

    } catch (err: any) {
      setError(err.message || 'Network error attempting checkout')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      {/* Load Razorpay DOM Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Welcome, {profile.full_name}</h1>
          <p className="text-zinc-400 mt-2">Manage your subscription and performance scores.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {isActive ? 'Active Subscriber' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Subscription Call to Action */}
      {!isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Unlock The Platform</h2>
          <p className="text-zinc-300 max-w-2xl mx-auto mb-8 text-lg">
            You must have an active subscription to submit daily scores, participate in the monthly algorithmic draws, and earn placements. 
            <strong className="text-indigo-400"> 10% of your subscription is automatically donated to your linked charity.</strong>
          </p>
          
          {error && <p className="text-red-400 text-sm mb-6 bg-red-500/10 py-3 px-6 rounded-xl inline-block border border-red-500/20">{error}</p>}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => handleSubscribe('monthly')}
              disabled={loading !== null}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading === 'monthly' ? 'Loading Razorpay...' : 'Subscribe Monthly (₹4,900/mo)'}
            </button>
            <button 
              onClick={() => handleSubscribe('yearly')}
              disabled={loading !== null}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-700 text-white font-bold flex items-center justify-center gap-3 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading === 'yearly' ? 'Loading Razorpay...' : 'Subscribe Yearly (₹49,000/yr)'}
              <span className="bg-indigo-500 text-white text-[10px] px-2 py-1 rounded uppercase font-extrabold tracking-wider">Save 10%</span>
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Active State Details Component */}
      {isActive && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Draw Section (Hero) */}
          <DrawSection draw={latestDraw} />

          {/* Secondary Features Grid */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-xl font-bold text-white mb-6 font-sans">Your Activity</h3>
            <BentoGrid>
              <BentoGridItem 
                title="Recent Scores"
                description="You haven't submitted any scores this week. Submit your daily round to enter the draw."
                icon={<Activity className="w-5 h-5 text-emerald-400" />}
                header={
                  <div className="w-full h-full min-h-[6rem] bg-emerald-500/5 rounded-lg flex items-center justify-center">
                    <button className="flex items-center gap-2 text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full hover:bg-emerald-500/20 transition-colors">
                      Submit Score <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                }
              />
              <BentoGridItem 
                title="Winnings & Payouts"
                description="Lifetime earnings: ₹0. View your historical draw results and withdrawal options."
                icon={<Trophy className="w-5 h-5 text-amber-400" />}
                header={
                  <div className="w-full h-full min-h-[6rem] bg-amber-500/5 rounded-lg border border-amber-500/10 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white/20">₹0</span>
                  </div>
                }
              />
              <BentoGridItem 
                title="Charity Impact"
                description="Your contributions have supported Junior Golf Foundation. Next donation scheduled for end of month."
                icon={<Heart className="w-5 h-5 text-rose-400" />}
                header={
                  <div className="w-full h-full min-h-[6rem] bg-rose-500/5 rounded-lg border border-rose-500/10 flex flex-col items-center justify-center gap-2">
                     <div className="text-xs text-rose-300 font-medium uppercase tracking-wider">Total Donated</div>
                     <span className="text-2xl font-bold text-rose-400">₹4,900</span>
                  </div>
                }
              />
            </BentoGrid>
          </div>
        </div>
      )}
    </div>
  )
}

