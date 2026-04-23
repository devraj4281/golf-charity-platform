/**
 * lib/payments/razorpay.ts
 *
 * Pure Razorpay adapter. No Next.js, no Supabase — just the payment provider SDK.
 * All API routes must call these functions; never import razorpay SDK directly in routes.
 */

import Razorpay from 'razorpay'
import crypto from 'crypto'

function getClient() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (!key_id || !key_secret) {
    throw new Error('Razorpay API keys are not configured in environment variables.')
  }

  return new Razorpay({ key_id, key_secret })
}

export type RazorpayPlan = 'monthly' | 'yearly'

// ─── Pricing (in paise — Razorpay requires smallest currency unit) ────────────
const PRICES: Record<RazorpayPlan, number> = {
  monthly: 4900 * 100,  // ₹4,900
  yearly:  49000 * 100, // ₹49,000
}

// ─── Create Order ─────────────────────────────────────────────────────────────

export async function createOrder(
  userId: string,
  email: string,
  plan: RazorpayPlan
): Promise<{ order_id: string; amount: number; currency: string }> {
  const rzp = getClient()

  const order = await rzp.orders.create({
    amount: PRICES[plan],
    currency: 'INR',
    receipt: `${userId.substring(0, 20)}_${Date.now()}`,
    notes: { userId, email, planType: plan },
  })

  return {
    order_id: order.id,
    amount: order.amount as number,
    currency: order.currency,
  }
}

// ─── Server-side Payment Verification ────────────────────────────────────────
// NEVER expose this to the frontend. Always called from API routes only.

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET not configured')

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  return expected === signature
}
