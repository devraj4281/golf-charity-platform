/**
 * lib/services/subscription.service.ts
 *
 * Handles subscription lifecycle business logic.
 * Called by API routes — never touches auth directly.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { activateSubscription } from '@/lib/db/queries'

type DB = SupabaseClient<Database>

export type SubscriptionPlan = 'monthly' | 'yearly'

/**
 * Activates a user's subscription after a verified payment.
 * Calculates correct period end date based on plan.
 */
export async function activateUserSubscription(
  db: DB,
  userId: string,
  plan: SubscriptionPlan,
  rzpOrderId: string,
  rzpPaymentId: string
) {
  const periodEnd = new Date()
  if (plan === 'yearly') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  }

  return activateSubscription(
    db,
    userId,
    plan,
    periodEnd.toISOString(),
    rzpOrderId,
    rzpPaymentId
  )
}
