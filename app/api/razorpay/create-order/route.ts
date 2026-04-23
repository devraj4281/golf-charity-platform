import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/requireUser'
import { createOrder } from '@/lib/payments/razorpay'

export async function POST(req: Request) {
  try {
    const user = await requireUser()
    const { plan } = await req.json()

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan. Must be monthly or yearly.' }, { status: 400 })
    }

    const order = await createOrder(user.id, user.email, plan)

    return NextResponse.json({
      ...order,
      user_name: user.profile.full_name,
      user_email: user.email,
    })
  } catch (error: any) {
    console.error('[create-order]', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
