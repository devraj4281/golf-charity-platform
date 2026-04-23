import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/requireUser'
import { verifyPaymentSignature } from '@/lib/payments/razorpay'
import { createAdminClient } from '@/lib/supabase/server'
import { activateUserSubscription } from '@/lib/services/subscription.service'

export async function POST(req: Request) {
  try {
    const user = await requireUser()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planType) {
      return NextResponse.json({ error: 'Missing required payment verification fields' }, { status: 400 })
    }

    // Server-side HMAC verification — never trust the client
    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    if (!isValid) {
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 })
    }

    // Use admin client to bypass RLS for subscription write
    const adminDb = createAdminClient()
    await activateUserSubscription(adminDb, user.id, planType, razorpay_order_id, razorpay_payment_id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[verify]', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
