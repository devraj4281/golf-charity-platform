'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface Props {
  plan: 'monthly' | 'yearly'
  onSuccess?: () => void
  onCancel?: () => void
  onError?: (err: string) => void
  trigger?: React.ReactNode
  autoOpen?: boolean
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayCheckout({ plan, onSuccess, onCancel, onError, trigger, autoOpen }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (autoOpen && window.Razorpay) {
      initiatePayment()
    }
  }, [autoOpen])

  const initiatePayment = async () => {
    if (!window.Razorpay) {
      setError('Payment gateway is still loading. Please try again in a moment.')
      return
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setError('Razorpay Key ID is not configured. Please check your .env.local file.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Create Order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const orderData = await res.json()
      if (!res.ok) throw new Error(orderData.error || 'Failed to initiate order')

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Sovereign Golf',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
        order_id: orderData.order_id,
        prefill: {
          name: orderData.user_name,
          email: orderData.user_email,
        },
        theme: {
          color: '#4f46e5',
        },
        handler: async (response: any) => {
          setLoading(true)
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                planType: plan,
              }),
            })

            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed')

            setSuccess(true)
            onSuccess?.()
            // Reload page to reflect changes
            window.location.reload()
          } catch (err: any) {
            setError(err.message)
            onError?.(err.message)
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            onCancel?.()
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
      onError?.(err.message)
    }
  }

  return (
    <>
      <div className="relative inline-block w-full">
        <div onClick={initiatePayment} className={cn(loading && "pointer-events-none opacity-50")}>
          {trigger}
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl z-10"
            >
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-2 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase tracking-tight"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase tracking-tight"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Payment Successful!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
