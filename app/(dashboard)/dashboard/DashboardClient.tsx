'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Script from 'next/script'
import type { Profile } from '@/types/database'

// Add Razorpay type to window to prevent TS errors
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function DashboardClient({ profile }: { profile: Profile }) {
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
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Load Razorpay DOM Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome, {profile.full_name}</h1>
          <p className="text-zinc-400 mt-2">Manage your subscription and performance scores.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {isActive ? 'Active Subscriber' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Subscription Call to Action */}
      {!isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 md:p-10 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-3">Unlock The Platform</h2>
          <p className="text-zinc-300 max-w-2xl mx-auto mb-8">
            You must have an active subscription to submit daily scores, participate in the monthly algorithmic draws, and earn placements. 
            10% of your subscription is automatically donated to your linked charity.
          </p>
          
          {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 py-2 px-4 rounded-lg inline-block border border-red-500/20">{error}</p>}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => handleSubscribe('monthly')}
              disabled={loading !== null}
              className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading === 'monthly' ? 'Loading Razorpay...' : 'Subscribe Monthly (₹4,900/mo)'}
            </button>
            <button 
              onClick={() => handleSubscribe('yearly')}
              disabled={loading !== null}
              className="w-full sm:w-auto px-8 py-3 bg-zinc-800 text-white font-semibold flex items-center justify-center gap-2 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {loading === 'yearly' ? 'Loading Razorpay...' : 'Subscribe Yearly (₹49,000/yr)'}
              <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Save 10%</span>
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Active State Details Component */}
      {isActive && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400 border-l-4 border-indigo-500 pl-4 py-1">Your razorpay subscription is active! The full score entry board will be unlocked here shortly.</p>
        </div>
      )}
    </div>
  )
}

