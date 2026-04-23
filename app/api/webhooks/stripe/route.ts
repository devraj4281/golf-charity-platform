import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Maps Stripe subscription status to internal status
function mapStripeStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case 'active':   return 'active'
    case 'past_due': return 'past_due'
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired': return 'cancelled'
    default:         return 'inactive'
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const reqHeaders = await headers()
  const sig = reqHeaders.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return new Response('Webhook signature invalid', { status: 400 })
  }

  const supabase = createAdminClient()  // bypasses RLS for server writes

  switch (event.type) {

    // ── New subscription created ─────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as string
      const subId      = session.subscription as string
      const sub        = await stripe.subscriptions.retrieve(subId)
      const plan       = sub.items.data[0]?.price.recurring?.interval === 'year'
        ? 'yearly' : 'monthly'

      await supabase
        .from('profiles')
        .update({
          stripe_customer_id:      customerId,
          stripe_sub_id:           subId,
          subscription_status:     'active',
          sub_plan:                plan,
          sub_current_period_end:  new Date((sub as any).current_period_end * 1000).toISOString(),
        })
        .eq('email', session.customer_email)
      break
    }

    // ── Subscription updated (renewal, plan change) ──────────
    case 'customer.subscription.updated': {
      const sub  = event.data.object as Stripe.Subscription
      const plan = sub.items.data[0]?.price.recurring?.interval === 'year'
        ? 'yearly' : 'monthly'

      await supabase
        .from('profiles')
        .update({
          subscription_status:    mapStripeStatus(sub.status),
          sub_plan:               plan,
          sub_current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
        })
        .eq('stripe_sub_id', sub.id)
      break
    }

    // ── Subscription cancelled or payment permanently failed ──
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('profiles')
        .update({ subscription_status: 'cancelled' })
        .eq('stripe_sub_id', sub.id)
      break
    }

    // ── Payment failed (grace period) ────────────────────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase
        .from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_customer_id', invoice.customer as string)
      break
    }
  }

  return new Response('ok', { status: 200 })
}
